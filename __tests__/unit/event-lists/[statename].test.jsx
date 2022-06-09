import {render} from '@testing-library/react';
import EventListByState, {getServerSideProps}  from '../../../pages/event-lists/[statename]';
import {firebase} from '../../../firebase';
import Chance from 'chance';

const chance = new Chance();

describe('Unit : Event List', () => {
  describe('Get Server Side Props', () => {
    afterEach(() => {
      firebase.database.mockClear();
    });

    describe('when the firebase database call returns events', () => {
      it('should return an event list with server side props ', async () => {
        const context = {
          params: {
            statename: chance.string()
          }
        };
        const expectedEventList = [{
          'address': chance.string(),
          'city': chance.city(),
          'contact': chance.phone(),
          'date': chance.date(),
          'imageSrc': 'IA/40-ford',
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

        const result = await getServerSideProps(context);

        expect(firebase.database).toHaveBeenCalledTimes(1);
        expect(databaseRefMock).toHaveBeenCalledWith(`2022/${context.params.statename}`);
        expect(result).toEqual({
          props: {
            stateName: context.params.statename,
            eventList: expectedEventList
          }
        });
      });
    });

    describe('when the firebase database call does not return an event', () => {
      it('should return an empty event list', async () => {
        const context = {
          params: {
            statename: chance.string()
          }
        };
        const expectedEventList = [];
        const expectedFirebaseResponse = {};
        const snapshot = {val: () => expectedFirebaseResponse};
        const databaseRefMock = jest.fn().mockReturnThis();

        jest.spyOn(firebase, 'database').mockImplementation(() => ({
          ref: databaseRefMock,
          on:  jest.fn((event, callback) => callback(snapshot))
        }));

        const result = await getServerSideProps(context);

        expect(firebase.database).toHaveBeenCalledTimes(1);
        expect(databaseRefMock).toHaveBeenCalledWith(`2022/${context.params.statename}`);
        expect(result).toEqual({
          props: {
            stateName: context.params.statename,
            eventList: expectedEventList
          }
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