import Chance from 'chance';
import {getEventData} from '../../../services/get-event-data';

const chance = new Chance();

describe('Get Event Data Service', () => {
  it('should return successfully', async () => {
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
    const databaseRefMock = {
      on:  jest.fn((event, callback) => callback(snapshot))
    };

    const result = await getEventData(databaseRefMock);

    expect(result).toEqual(expectedFirebaseResponse);
  });
});