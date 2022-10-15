import {render, waitFor, within, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {firebase} from '../../firebase';
import * as NextRouter from 'next/router';
import Admin from '../../pages/admin';
import {stateNameList} from '../../constants/state-names';
import Chance from 'chance';
import {monthsMap} from '../../constants/months-map';
import imageCompression from 'browser-image-compression';


jest.mock('browser-image-compression', () => {
  return jest.fn().mockResolvedValue({
    name: 'super-compressed-image',
    type: 'image/png'
  });
});

const chance = new Chance();

describe('Integration : Admin', () => {
  describe('when authenticated', () => {
    let databaseSetSpy, storageUploadMock, signOutSpy, databaseRefMock, storageChildMock, routerPushMock, nextRouterSpy, expectedMonth, givenEventDate, givenEventName, givenEventTime, givenEventAddress, givenEventCity, givenEventState, givenContactPhone, givenContactEmail, givenEventMemo, givenEventImageName, givenEventImage;

    beforeEach(() => {
      givenEventDate = chance.date({string: true});
      givenEventName = chance.word();
      givenEventTime = chance.word();
      givenEventAddress = chance.address();
      givenEventCity = chance.city();
      givenEventState = chance.pickone(stateNameList);
      givenContactPhone = chance.phone();
      givenContactEmail = chance.email();
      givenEventImageName = `${chance.string()}.png`;
      givenEventImage = new File(['hello'], givenEventImageName, {type: 'image/png'});
      givenEventMemo = chance.word();
      databaseRefMock = jest.fn().mockReturnThis();
      storageChildMock = jest.fn().mockReturnThis();
      storageUploadMock = jest.fn();

      const dateParts = givenEventDate.split('/');

      if (dateParts[0].length === 1) {
        const updatedMonth = `0${dateParts[0]}`;

        givenEventDate = `${updatedMonth}/${dateParts[1]}/${dateParts[2]}`;
      }

      expectedMonth = monthsMap[givenEventDate.split('/')[0]];

      jest.spyOn(firebase.auth(), 'onAuthStateChanged')
        .mockImplementation(jest.fn((callback) => callback(
          {
            uid: chance.guid()
          }
        )));

      jest.spyOn(firebase, 'storage')
        .mockImplementation(() => ({
          ref: jest.fn().mockReturnThis(),
          child: storageChildMock,
          put: storageUploadMock
        }));

      jest.spyOn(firebase, 'database').mockImplementation(() => ({
        ref: databaseRefMock,
        push: databaseSetSpy
      }));


      signOutSpy = jest.spyOn(firebase.auth(), 'signOut');

      routerPushMock = jest.fn();
      nextRouterSpy = jest.spyOn(NextRouter, 'useRouter').mockImplementation(() => ({
        push: routerPushMock,
        prefetch: jest.fn().mockResolvedValue('prefetch resolve'),
      }));
    });

    afterEach(() => {
      firebase.auth().onAuthStateChanged.mockClear();
      firebase.database.mockClear();
      firebase.storage.mockClear();
      signOutSpy.mockClear();
      nextRouterSpy.mockClear();
      jest.clearAllMocks();
    });

    describe('when sign out is successful', () => {
      it('should sign the user out and redirect to the homepage', async () => {
        signOutSpy.mockResolvedValue('success');

        const {getByRole} = render(<Admin/>);
        const signOutButton = getByRole('button', {
          name: 'Sign Out'
        });

        userEvent.click(signOutButton);

        await waitFor(() => {
          expect(signOutSpy).toHaveBeenCalledTimes(1);
          expect(routerPushMock).toHaveBeenCalledTimes(1);
          expect(routerPushMock).toHaveBeenCalledWith('/');
        });
      });
    });

    describe('when sign out is not successful', () => {
      it('should not redirect the user to the homepage', async () => {
        signOutSpy.mockRejectedValue('error');

        const {getByRole} = render(<Admin/>);
        const signOutButton = getByRole('button', {
          name: 'Sign Out'
        });

        userEvent.click(signOutButton);

        await waitFor(() => {
          expect(signOutSpy).toHaveBeenCalledTimes(1);
          expect(routerPushMock).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('when image upload is successful', () => {
      it('should upload an event', async () => {
        storageUploadMock = jest.fn().mockResolvedValue({
          ref: {
            fullPath: 'super-compressed-image.png'
          }
        });
        databaseSetSpy = jest.fn().mockResolvedValue('yo');

        const {getByRole, queryByText} = render(<Admin/>);

        const form = getByRole('form', {
          name: 'upload-event-form'
        });
        const {getByLabelText} = within(form);
        const eventDate = getByLabelText('Date');
        const eventName = getByLabelText('Event Name');
        const eventTime = getByLabelText('Time');
        const eventAddress = getByLabelText('Address');
        const eventCity = getByLabelText('City');
        const eventContactPhone = getByLabelText('Contact Phone');
        const eventContactEmail = getByLabelText('Contact Email');
        const eventFlier = getByLabelText('Upload Flier');
        const eventMemo = getByLabelText('Memo');
        const submitButton = getByRole('button', {
          name: 'Upload Event'
        });

        userEvent.type(eventDate, givenEventDate);
        userEvent.type(eventName, givenEventName);
        userEvent.type(eventTime, givenEventTime);
        userEvent.type(eventAddress, givenEventAddress);
        userEvent.type(eventCity, givenEventCity);
        userEvent.selectOptions(
          getByRole('combobox'),
          getByRole('option', {name: givenEventState.abbreviation}),
        );
        userEvent.type(eventContactPhone, givenContactPhone);
        userEvent.type(eventContactEmail, givenContactEmail);
        userEvent.upload(eventFlier, givenEventImage);
        userEvent.type(eventMemo, givenEventMemo);
        userEvent.click(submitButton);

        await waitFor(() => {
          expect(imageCompression).toHaveBeenCalledTimes(1);
          expect(imageCompression).toHaveBeenCalledWith(givenEventImage, {'initialQuality': 0.8, 'maxWidthOrHeight': 1500, 'useWebWorker': true});
          expect(storageUploadMock).toHaveBeenCalledTimes(1);
          expect(storageUploadMock).toHaveBeenCalledWith({'name': 'super-compressed-image', 'type': 'image/png'});
          expect(storageChildMock).toHaveBeenCalledWith(`2022/${givenEventState.fullName}/${expectedMonth}/super-compressed-image`);
          expect(databaseRefMock).toHaveBeenCalledWith(`2022/${givenEventState.fullName}/${expectedMonth}`);
          expect(databaseSetSpy).toHaveBeenCalledTimes(1);
          expect(databaseSetSpy).toHaveBeenCalledWith({
            date: givenEventDate,
            name: givenEventName,
            time: givenEventTime,
            address: givenEventAddress,
            city: givenEventCity,
            state: givenEventState.fullName,
            phone: givenContactPhone,
            email: givenContactEmail,
            image: givenEventImageName,
            memo: givenEventMemo
          });
        });

        expect(queryByText('Event added successfully.')).toBeInTheDocument();
      });
    });

    describe('when image upload is not successful', () => {
      it('should not upload an event', async () => {
        storageUploadMock.mockRejectedValue('error ben');
        databaseSetSpy = jest.fn();

        const {getByRole} = render(<Admin/>);

        const form = getByRole('form', {
          name: 'upload-event-form'
        });
        const {getByLabelText} = within(form);
        const eventDate = getByLabelText('Date');
        const eventName = getByLabelText('Event Name');
        const eventTime = getByLabelText('Time');
        const eventAddress = getByLabelText('Address');
        const eventCity = getByLabelText('City');
        const eventContactPhone = getByLabelText('Contact Phone');
        const eventContactEmail = getByLabelText('Contact Email');
        const eventFlier = getByLabelText('Upload Flier');
        const eventMemo = getByLabelText('Memo');
        const submitButton = getByRole('button', {
          name: 'Upload Event'
        });

        userEvent.type(eventDate, givenEventDate);
        userEvent.type(eventName, givenEventName);
        userEvent.type(eventTime, givenEventTime);
        userEvent.type(eventAddress, givenEventAddress);
        userEvent.type(eventCity, givenEventCity);
        userEvent.selectOptions(
          getByRole('combobox'),
          getByRole('option', {name: givenEventState.abbreviation}),
        );
        userEvent.type(eventContactPhone, givenContactPhone);
        userEvent.type(eventContactEmail, givenContactEmail);
        userEvent.upload(eventFlier, givenEventImage);
        userEvent.type(eventMemo, givenEventMemo);
        userEvent.click(submitButton);

        await waitFor(() => {
          expect(imageCompression).toHaveBeenCalledTimes(1);
          expect(imageCompression).toHaveBeenCalledWith(givenEventImage, {'initialQuality': 0.8, 'maxWidthOrHeight': 1500, 'useWebWorker': true});
          expect(storageUploadMock).toHaveBeenCalledTimes(1);
          expect(storageUploadMock).toHaveBeenCalledWith({name: 'super-compressed-image', type: 'image/png'});
          expect(storageChildMock).toHaveBeenCalledWith(`2022/${givenEventState.fullName}/${expectedMonth}/super-compressed-image`);
          expect(databaseSetSpy).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('when database set is not successful', () => {
      it('should throw an error', async () => {
        storageUploadMock = jest.fn().mockResolvedValue({
          ref: {
            fullPath: givenEventImageName
          }
        });
        databaseSetSpy = jest.fn().mockRejectedValue('big error');

        const {getByRole, queryByText} = render(<Admin/>);

        const form = getByRole('form', {
          name: 'upload-event-form'
        });
        const {getByLabelText} = within(form);
        const eventDate = getByLabelText('Date');
        const eventName = getByLabelText('Event Name');
        const eventTime = getByLabelText('Time');
        const eventAddress = getByLabelText('Address');
        const eventCity = getByLabelText('City');
        const eventContactPhone = getByLabelText('Contact Phone');
        const eventContactEmail = getByLabelText('Contact Email');
        const eventFlier = getByLabelText('Upload Flier');
        const eventMemo = getByLabelText('Memo');
        const submitButton = getByRole('button', {
          name: 'Upload Event'
        });

        userEvent.type(eventDate, givenEventDate);
        userEvent.type(eventName, givenEventName);
        userEvent.type(eventTime, givenEventTime);
        userEvent.type(eventAddress, givenEventAddress);
        userEvent.type(eventCity, givenEventCity);
        userEvent.selectOptions(
          getByRole('combobox'),
          getByRole('option', {name: givenEventState.abbreviation}),
        );
        userEvent.type(eventContactPhone, givenContactPhone);
        userEvent.type(eventContactEmail, givenContactEmail);
        userEvent.upload(eventFlier, givenEventImage);
        userEvent.type(eventMemo, givenEventMemo);
        userEvent.click(submitButton);

        await waitFor(() => {
          expect(databaseRefMock).toHaveBeenCalledWith(`2022/${givenEventState.fullName}/${expectedMonth}`);
          expect(databaseSetSpy).toHaveBeenCalledTimes(1);
          expect(databaseSetSpy).toHaveBeenCalledWith({
            date: givenEventDate,
            name: givenEventName,
            time: givenEventTime,
            address: givenEventAddress,
            city: givenEventCity,
            state: givenEventState.fullName,
            phone: givenContactPhone,
            email: givenContactEmail,
            image: givenEventImageName,
            memo: givenEventMemo
          });
          expect(queryByText('Event failed to be added.')).toBeInTheDocument();
        });
      });
    });

    describe('when sign up is successful', () => {
      let authSpy;

      beforeEach(() => {
        authSpy = jest.spyOn(firebase.auth(), 'createUserWithEmailAndPassword').mockResolvedValue({
          user: {
            uid: chance.guid()
          }
        });
      });

      afterEach(() => {
        firebase.auth().createUserWithEmailAndPassword.mockClear();
      });

      it('should sign up new user successfully', async () => {
        const {getByRole, queryByText} = render(<Admin/>);

        expect(queryByText('User created successfully')).toBeNull();

        const givenEmail = chance.email();
        const givenPassword = chance.word();
        const givenName = chance.name();

        const form = getByRole('form', {
          name: 'sign-up-form'
        });
        const {getByLabelText} = within(form);

        const nameInput = getByLabelText('Name');
        const emailInput = getByLabelText('Email');
        const password = getByLabelText('Password');
        const signUpButton = getByRole('button', {
          name: 'Sign Up'
        });

        userEvent.type(nameInput, givenName);
        userEvent.type(emailInput, givenEmail);
        userEvent.type(password, givenPassword);

        await act(() => {
          userEvent.click(signUpButton);
        });

        // await waitFor(() => {
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenLastCalledWith({
          username: givenEmail,
          password: givenPassword,
        });
        // });

        expect(queryByText('User created successfully')).toBeInTheDocument();
      });
    });

    describe('when sign up is not successful', () => {
      let authSpy;

      beforeEach(() => {
        authSpy = jest.spyOn(firebase.auth(), 'createUserWithEmailAndPassword').mockRejectedValue({
          message: 'Error Signing In',
          statusCode: 500
        });
      });

      afterEach(() => {
        firebase.auth().createUserWithEmailAndPassword.mockClear();
      });

      it('should not sign up the new user', async () => {
        const {getByRole, queryByText, getByLabelText} = render(<Admin/>);

        expect(queryByText('Failed to create user')).toBeNull();

        const givenEmail = 'ben@ben.com';
        const givenPassword = chance.word();
        const givenName = chance.name();

        const nameInput = getByLabelText('Name');
        const emailInput = getByLabelText('Email');
        const password = getByLabelText('Password');
        const signUpButton = getByRole('button', {
          name: 'Sign Up'
        });

        userEvent.type(nameInput, givenName);
        userEvent.type(emailInput, givenEmail);
        userEvent.type(password, givenPassword);

        await act(() => {
          userEvent.click(signUpButton);
        });

        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenLastCalledWith({
          username: givenEmail,
          password: givenPassword,
        });

        expect(queryByText('Failed to create user')).toBeInTheDocument();
      });
    });
  });

  describe('when not authenticated', () => {
    beforeEach(() => {
      jest.spyOn(firebase.auth(), 'onAuthStateChanged')
        .mockImplementation(jest.fn((callback) => callback(null)));
    });

    afterEach(() => {
      firebase.auth().onAuthStateChanged.mockClear();
    });

    it('should take you to the sign up page', () => {
      const mockPushMethod = jest.fn();
      const useRouter = jest.spyOn(NextRouter, 'useRouter');
      useRouter.mockImplementationOnce(() => ({
        push: mockPushMethod,
      }));

      render(<Admin/>);

      expect(mockPushMethod).toHaveBeenCalledTimes(1);
      expect(mockPushMethod).toHaveBeenCalledWith('/sign-in');
    });
  });
});