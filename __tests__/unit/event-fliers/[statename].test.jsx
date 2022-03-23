import {render, screen, within} from '@testing-library/react';
import {API, Storage} from '../../../__mocks__/aws-amplify';
import EventFliersByState, {getStaticPaths, getStaticProps} from '../../../pages/event-fliers/[statename]';
import Chance from 'chance';
import {stateNameList} from '../../../constants/state-names';
import {
  EVENT_API_ERROR_IMAGE,
  EVENT_API_RESPONSE_FIRST_IMAGE,
  EVENT_API_RESPONSE_SECOND_IMAGE, EVENT_FLIERS_RESPONSE, EVENT_FLIERS_RESPONSE_SINGLE_IMAGE
} from '../../../test-data/event-fliers-response';

const chance = new Chance();

describe('Unit : Event Fliers By State' , () => {
  describe('Get Static Paths', () => {
    it('should get the static paths params', async () => {
      const expectedPaths = [];

      for (let i = 0; i < stateNameList.length; i++) {
        expectedPaths.push({params: {statename: stateNameList[i].fullName}});
      }

      const expectedResult = {
        fallback: false,
        paths: expectedPaths
      };

      const result = await getStaticPaths();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('Get Static Props', () => {
    afterEach(() => {
      API.graphql.mockClear();
      Storage.get.mockClear();
    });
    describe('when event query returns an event with an image source', () => {
      it('should ', async () => {
        const givenParams = {
          params: {
            statename: 'iowa'
          }
        };

        const result = await getStaticProps(givenParams);

        expect(API.graphql).toHaveBeenCalledTimes(1);
        expect(API.graphql).toHaveBeenCalledWith({
          query: 'listEvents',
          variables: {
            filter: {
              state: {
                eq: 'IA'
              }
            }
          }
        });
        expect(Storage.get).toHaveBeenCalledTimes(2);
        expect(Storage.get).toHaveBeenNthCalledWith(1, EVENT_API_RESPONSE_FIRST_IMAGE);
        expect(Storage.get).toHaveBeenNthCalledWith(2, EVENT_API_RESPONSE_SECOND_IMAGE);
        expect(result).toEqual({
          props: {
            stateName: givenParams.params.statename,
            flierList: Promise.resolve(EVENT_FLIERS_RESPONSE),
            showErrorMessage: false
          },
          revalidate: 10
        });
      });
    });

    describe('when event query returns an event without an image source', () => {
      it('should ', async () => {
        const givenParams = {
          params: {
            statename: 'missouri'
          }
        };

        const result = await getStaticProps(givenParams);

        expect(API.graphql).toHaveBeenCalledTimes(1);
        expect(API.graphql).toHaveBeenCalledWith({
          query: 'listEvents',
          variables: {
            filter: {
              state: {
                eq: 'MO'
              }
            }
          }
        });
        expect(Storage.get).toHaveBeenCalledTimes(1);
        expect(Storage.get).toHaveBeenNthCalledWith(1, EVENT_API_RESPONSE_FIRST_IMAGE);
        expect(result).toEqual({
          props: {
            stateName: givenParams.params.statename,
            flierList: Promise.resolve(EVENT_FLIERS_RESPONSE_SINGLE_IMAGE),
            showErrorMessage: false
          },
          revalidate: 10
        });
      });
    });

    describe('when event query returns an error', () => {
      it('should ', async () => {
        const givenParams = {
          params: {
            statename: chance.string()
          }
        };

        const result = await getStaticProps(givenParams);

        expect(API.graphql).toHaveBeenCalledTimes(1);
        expect(API.graphql).toHaveBeenCalledWith({
          query: 'listEvents',
          variables: {
            filter: {
              state: {
                eq: undefined
              }
            }
          }
        });
        expect(Storage.get).toHaveBeenCalledTimes(0);
        expect(result).toEqual({
          props: {
            stateName: givenParams.params.statename,
            flierList: [],
            showErrorMessage: true
          },
          revalidate: 10
        });
      });
    });

    describe('when image storage returns an error', () => {
      it('should ', async () => {
        // TODO: fix unhandled promise warning
        const givenParams = {
          params: {
            statename: 'minnesota'
          }
        };

        const result = await getStaticProps(givenParams);

        expect(API.graphql).toHaveBeenCalledTimes(1);
        expect(API.graphql).toHaveBeenCalledWith({
          query: 'listEvents',
          variables: {
            filter: {
              state: {
                eq: 'MN'
              }
            }
          }
        });
        expect(Storage.get).toHaveBeenCalledTimes(1);
        expect(Storage.get).toHaveBeenNthCalledWith(1, EVENT_API_ERROR_IMAGE);
        expect(result).toEqual({
          props: {
            stateName: givenParams.params.statename,
            flierList: Promise.resolve([]),
            showErrorMessage: false
          },
          revalidate: 10
        });
      });
    });
  });

  describe('Render Flier List Page', () => {
    let givenProps,
      givenStateName,
      givenFlierList;

    beforeEach(() => {
      givenStateName = chance.string();
      givenFlierList = chance.n(() => ({
        name: chance.string(),
        imageSrc: 'https://placekitten.com/300/300'
      }), chance.d8());
      givenProps = {
        stateName: givenStateName,
        flierList: givenFlierList
      };
    });

    it('should render a heading', () => {
      const {getByRole} = render(<EventFliersByState {...givenProps}/>);

      const heading = getByRole('heading', {
        level: 1
      });

      expect(heading.textContent).toEqual(`Ricks List ${givenStateName} Event Fliers`);
    });

    it('should render a list of fliers', () => {
      render(<EventFliersByState {...givenProps}/>);

      const mainContainer = screen.getByRole('main');
      const {getByRole, getAllByRole} = within(mainContainer);
      getByRole('list');
      const flierItems = getAllByRole('listitem');

      expect(flierItems.length).toEqual(givenFlierList.length);

      for (let i = 0; i < flierItems.length; i++) {
        const expectedImage = givenFlierList[i];

        const image = screen.getByAltText(expectedImage.name);

        expect(image).toHaveAttribute('src', expectedImage.imageSrc);
        expect(image).toHaveAttribute('alt', expectedImage.name);
      }
    });
  });
});