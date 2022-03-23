import user from '@testing-library/user-event';
import {
  EVENT_API_ERROR_IMAGE,
  EVENT_API_RESPONSE_FIRST_IMAGE, EVENT_API_RESPONSE_SECOND_IMAGE,
  EVENT_FLIERS_STORAGE_FIRST_RESPONSE,
  EVENT_FLIERS_STORAGE_SECOND_RESPONSE
} from '../test-data/event-fliers-response';

export const Auth = {
  forgotPassword: jest.fn((email) => {
    // console.log('Email', email);

    return new Promise((resolve, reject) => {
      return resolve('Forgot Password resolve');
    });
  }),
  signIn: jest.fn().mockImplementation(
    (email, password) => {
      return new Promise((resolve, reject) => {
        if (password === 'abc123') {
          const signedUser = {
            username: 'abcdfg123',
            attributes: {email, name: 'John Rambo', phone: '+460777777777'},
            signInUserSession: {
              accessToken: {jwtToken: '123456'},
            },
          };
          return resolve(signedUser);
        }

        return reject({
          code: 'UserNotFoundException',
          name: 'UserNotFoundException',
          message: 'User does not exist.'
        });
      });
    }
  ),
  signUp: jest.fn().mockImplementation(
    ({username, pass, attributes}) =>
      new Promise((resolve, reject) => {

        if (username !== 'ben@ben.com') {
          const newUser = {
            username: username,
            email: username,
            name: attributes.name,
            signInUserSession: {
              accessToken: {jwtToken: '123456'},
            },
          };
          return resolve(newUser);
        }

        return reject({
          code: 500,
          name: 'UnableToCreateException',
          message: 'Unable to Create User'
        });
      }),
  ),
};

export const API = {
  graphql: jest.fn().mockImplementation((requestParams) => { // This is the callbackFn from 'graphqlOperation'
    // console.log('Request Type', requestParams.query);
    // console.log('Variables', requestParams.variables);
    // console.log('Ben - API request params', requestParams);
    const requestFilter = requestParams.variables.filter.state.eq;

    if (requestParams.query === 'listEvents' && requestFilter === 'IA') {
      const response = {
        'data':{
          'listEvents':{
            'items':[
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
            'nextToken':null
          }
        }
      };

      return Promise.resolve(response);
    } else if (requestParams.query === 'listEvents' && requestFilter === 'IL') {
      const response = {
        'data':{
          'listEvents':{
            'items':[],
            'nextToken':null
          }
        }
      };

      return Promise.resolve(response);
    } else if (requestParams.query === 'listEvents' && requestFilter === 'MO') {
      const response = {
        'data':{
          'listEvents':{
            'items':[
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
                'createdAt':'2021-09-26T02:03:49.165Z',
                'updatedAt':'2021-09-26T02:03:49.165Z'
              }
            ],
            'nextToken':null
          }
        }
      };

      return Promise.resolve(response);
    } else if (requestParams.query === 'listEvents' && requestFilter === 'MN') {
      const response = {
        'data':{
          'listEvents':{
            'items':[
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
                'image': EVENT_API_ERROR_IMAGE,
                'createdAt':'2021-09-26T02:03:49.165Z',
                'updatedAt':'2021-09-26T02:03:49.165Z'
              }
            ],
            'nextToken':null
          }
        }
      };

      return Promise.resolve(response);
    } else if (requestParams.query === 'listEvents' && requestFilter !== 'IL' || 'IA' || 'MO' || 'MN') {
      return Promise.reject('Ben - Query Error');
    } else if (requestParams.query === 'createEvent') {
      if (requestParams.variables === 'mutation') {
        const response = {
          'data':{
            'createEvent':{
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
            }
          }
        };

        return Promise.resolve(response);
      }
    };
  }),
};

export const Storage = {
  get: jest.fn().mockImplementation((requestParams) => {
    // console.log('Ben - Storage Request Params', requestParams);

    if(requestParams === EVENT_API_RESPONSE_FIRST_IMAGE) {
      return Promise.resolve(EVENT_FLIERS_STORAGE_FIRST_RESPONSE);
    } else if (requestParams === EVENT_API_RESPONSE_SECOND_IMAGE) {
      return Promise.resolve(EVENT_FLIERS_STORAGE_SECOND_RESPONSE);
    } else {
      console.log('should reject storage');
      return Promise.reject('Bad Luck');
    }
  })
};