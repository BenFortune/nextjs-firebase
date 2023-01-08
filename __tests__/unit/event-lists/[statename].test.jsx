import {render} from '@testing-library/react';
import EventListByState, {getServerSideProps}  from '../../../pages/event-lists/[statename]';
import {firebase} from '../../../firebase';
import Chance from 'chance';
import {monthFullName, monthsMap} from '../../../constants/months-map';

const chance = new Chance();

function buildDate() {
  const month = chance.pickone(Object.keys(monthsMap));
  const day = chance.integer({max: 31, min: 1});
  const year = chance.year();

  return {
    month,
    day,
    year
  };
}

function buildExpectedEventList(expectedMonthName, expectedDateObj) {
  const monthsNames = Object.values(monthFullName);

  return monthsNames.map((month) => {
    let list = null;

    if (month === expectedMonthName) {
      list = [{
        address: chance.string(),
        city: chance.city(),
        date: `${expectedDateObj.month}/${expectedDateObj.day}/${expectedDateObj.year}`,
        email: '',
        image: 'IA/40-ford',
        memo: chance.string(),
        name: chance.string(),
        phone: '000-111-2222',
        state: chance.state(),
        time: chance.string()
      }];
    }

    return {
      list,
      month
    };
  });
}

describe('Unit : Event List', () => {
  describe('Get Server Side Props', () => {
    afterEach(() => {
      firebase.database.mockClear();
    });

    describe('when the firebase database call returns events', () => {
      it('should return an event list with server side props ', async () => {
        const expectedFirebaseResponse = {};
        const context = {
          params: {
            statename: chance.string()
          }
        };
        const expectedDateObj = buildDate();
        const expectedMonth = monthsMap[expectedDateObj.month];
        const expectedFullEventList = buildExpectedEventList(expectedMonth, expectedDateObj);
        expectedFullEventList.forEach((event, index ) => {
          if (event.month === expectedMonth) {
            expectedFirebaseResponse[event.month] = {
              [chance.guid()]: [...event.list][0]
            };
          }
        });

        const snapshot = {val: () => expectedFirebaseResponse};
        const databaseRefMock = jest.fn().mockReturnThis();

        jest.spyOn(firebase, 'database').mockImplementation(() => ({
          ref: databaseRefMock,
          on:  jest.fn((event, callback) => callback(snapshot))
        }));

        const result = await getServerSideProps(context);

        expect(firebase.database).toHaveBeenCalledTimes(1);
        expect(databaseRefMock).toHaveBeenCalledWith(`2023/${context.params.statename}`);
        expect(result).toEqual({
          props: {
            stateName: context.params.statename,
            eventList: expectedFullEventList
          }
        });
      });
    });

    describe('when the firebase database call does not return an event', () => {
      it('should return an empty event list', async () => {
        const expectedFirebaseResponse = {};
        const context = {
          params: {
            statename: chance.string()
          }
        };
        const expectedDateObj = buildDate();
        const expectedFullEventList = buildExpectedEventList(undefined, expectedDateObj);
        const snapshot = {val: () => expectedFirebaseResponse};
        const databaseRefMock = jest.fn().mockReturnThis();

        jest.spyOn(firebase, 'database').mockImplementation(() => ({
          ref: databaseRefMock,
          on:  jest.fn((event, callback) => callback(snapshot))
        }));

        const result = await getServerSideProps(context);

        expect(firebase.database).toHaveBeenCalledTimes(1);
        expect(databaseRefMock).toHaveBeenCalledWith(`2023/${context.params.statename}`);
        expect(result).toEqual({
          props: {
            stateName: context.params.statename,
            eventList: expectedFullEventList
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