import {render, screen, within} from '@testing-library/react';
import EventFliersByState, {getServerSideProps} from '../../../../pages/event-fliers/[statename]/[month]';
import Chance from 'chance';
import {firebase} from '../../../../firebase';
import {stateNameList} from '../../../../constants/state-names';
import {monthFullName} from '../../../../constants/months-map';

const chance = new Chance();

describe('Unit : Event Fliers By State' , () => {
  describe('Get Server Side Props', () => {
    afterEach(() => {
      firebase.database.mockClear();
      firebase.storage.mockClear();
    });

    describe('when event query returns an event with an image source', () => {
      it('should get the download url for the image', async () => {
        const givenContext = {
          params: {
            statename: chance.pickone(stateNameList).fullName,
            month: chance.pickone(monthFullName)
          }
        };
        const expectedFlierUrl = chance.url();
        const expectedEventList = [{
          'address': chance.string(),
          'city': chance.city(),
          'contact': chance.phone(),
          'date': chance.date(),
          'image': 'IA/40-ford',
          'memo': chance.string(),
          'name': chance.string(),
          'state': chance.state()
        }];
        const expectedFirebaseResponse = {
          [chance.string()]: expectedEventList[0]
        };
        const snapshot = {val: () => expectedFirebaseResponse};
        const databaseRefMock = jest.fn().mockReturnThis();

        jest.spyOn(firebase, 'database').mockImplementation(() => ({
          ref: databaseRefMock,
          on:  jest.fn((event, callback) => callback(snapshot))
        }));

        jest.spyOn(firebase, 'storage').mockImplementation(() => ({
          ref: jest.fn().mockReturnThis(),
          child: jest.fn().mockReturnThis(),
          getDownloadURL: jest.fn().mockResolvedValue(expectedFlierUrl)
        }));

        const result = await getServerSideProps(givenContext);

        expect(firebase.database).toHaveBeenCalledTimes(1);
        expect(databaseRefMock).toHaveBeenCalledWith(`2023/${givenContext.params.statename}/${givenContext.params.month}`);
        expect(firebase.storage).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          props: {
            stateName: givenContext.params.statename,
            flierList: [{
              'address': expectedEventList[0].address,
              'city': expectedEventList[0].city,
              'contact': expectedEventList[0].contact,
              'date': expectedEventList[0].date,
              'image': expectedEventList[0].image,
              'imageSrc': expectedFlierUrl,
              'memo': expectedEventList[0].memo,
              'name': expectedEventList[0].name,
              'state': expectedEventList[0].state
            }],
            showErrorMessage: false
          }
        });
      });
    });

    describe('when event query returns an event without an image source', () => {
      it('should return the event list unmodified', async () => {
        const givenContext = {
          params: {
            statename: chance.pickone(stateNameList).fullName,
            month: chance.pickone(monthFullName)
          }
        };
        const expectedFlierUrl = chance.url();
        const expectedEventList = [{
          'address': chance.string(),
          'city': chance.city(),
          'contact': chance.phone(),
          'date': chance.date(),
          'image': undefined,
          'memo': chance.string(),
          'name': chance.string(),
          'state': chance.state()
        }];
        const expectedFirebaseResponse = {
          [chance.string()]: expectedEventList[0]
        };
        const snapshot = {val: () => expectedFirebaseResponse};
        const databaseRefMock = jest.fn().mockReturnThis();

        jest.spyOn(firebase, 'database').mockImplementation(() => ({
          ref: databaseRefMock,
          on:  jest.fn((event, callback) => callback(snapshot))
        }));

        jest.spyOn(firebase, 'storage').mockImplementation(() => ({
          ref: jest.fn().mockReturnThis(),
          child: jest.fn().mockReturnThis(),
          getDownloadURL: jest.fn().mockResolvedValue(expectedFlierUrl)
        }));

        const result = await getServerSideProps(givenContext);

        expect(firebase.database).toHaveBeenCalledTimes(1);
        expect(databaseRefMock).toHaveBeenCalledWith(`2023/${givenContext.params.statename}/${givenContext.params.month}`);
        expect(firebase.storage).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          props: {
            stateName: givenContext.params.statename,
            flierList: expectedEventList,
            showErrorMessage: false
          }
        });
      });
    });

    // describe('when image storage returns an error', () => {
    //   it('should ', async () => {
    // TODO: add test
    //   });
    // });
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