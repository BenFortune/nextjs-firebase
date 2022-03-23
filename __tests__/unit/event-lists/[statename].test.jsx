import {render} from '@testing-library/react';
import EventListByState, {getStaticPaths, getStaticProps}  from '../../../pages/event-lists/[statename]';
import Chance from 'chance';
import {API} from '../../../__mocks__/aws-amplify';
import {stateNameList} from '../../../constants/state-names';

const chance = new Chance();

describe('Unit : Event List', () => {
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
    });
    describe('when the event query returns a result', () => {
      it('should return the static props with a populated event list',  async () => {
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
        expect(result).toEqual({
          props: {
            stateName: givenParams.params.statename,
            eventList: [
              {
                'id':'b16ba3e0-a8ba-4c80-9a95-63201f3d18df',
                'date':'11/18/2021',
                'month':'november',
                'name':'November Event',
                'time':'10-2',
                'address':'1234 Turkey Dr',
                'city':'Fort Dodge',
                'state':'IA',
                'contact':'555-111-3333',
                'memo':'Cool Event',
                'image':'/IA/40-Ford.jpg',
                'createdAt':'2021-11-25T02:49:54.002Z',
                'updatedAt':'2021-11-25T02:49:54.002Z'
              },
              {
                'id':'b5602de2-6833-4287-8e51-4374db30cb60',
                'date':'10/18/2021',
                'month':'october',
                'name':'Some Show In Iowa',
                'time':'9-4',
                'address':'123 Abc Dr',
                'city':'Cresco',
                'state':'IA',
                'contact':'555-222-3333',
                'memo':'some event info here',
                'image':'/IA/SEPT-CEDAR-RAPIDS-IA.jpeg',
                'createdAt':'2021-09-26T02:03:49.165Z',
                'updatedAt':'2021-09-26T02:03:49.165Z'
              }
            ],
            showErrorMessage: false
          },
          revalidate: 10
        });
      });
    });

    describe('when the event query does not return a result', () => {
      it('should return the static props with an empty event list', async () => {
        const givenParams = {
          params: {
            statename: 'illinois'
          }
        };

        const result = await getStaticProps(givenParams);
        expect(API.graphql).toHaveBeenCalledTimes(1);
        expect(API.graphql).toHaveBeenCalledWith({
          query: 'listEvents',
          variables: {
            filter: {
              state: {
                eq: 'IL'
              }
            }
          }
        });
        expect(result).toEqual({
          props: {
            stateName: givenParams.params.statename,
            eventList: [],
            showErrorMessage: false
          },
          revalidate: 10
        });
      });
    });

    describe('when the event query returns an error', () => {
      it('should return the static props with an empty event list and an error property', async () => {
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
        expect(result).toEqual({
          props: {
            stateName: givenParams.params.statename,
            eventList: [],
            showErrorMessage: true
          },
          revalidate: 10
        });
      });
    });
  });

  describe('Render Events List Page', () => {
    it('should render a header', async () => {
      const givenStateName = chance.string();
      const givenProps = {
        stateName: givenStateName,
        eventList: []
      };

      const {getByRole} = render(<EventListByState {...givenProps}/>);

      const heading = getByRole('heading', {
        level: 1
      });

      expect(heading.textContent).toEqual(`Ricks List ${givenStateName} Event List`);
    });
  });
});