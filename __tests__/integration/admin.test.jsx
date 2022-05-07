import {render, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {firebase} from '../../firebase';
import * as NextRouter from 'next/router';
import Admin from '../../pages/admin';
import {stateNameList} from '../../constants/state-names';
import Chance from 'chance';

const chance = new Chance();

describe('Integration : Admin', () => {
  let onAuthStateChangedSpy;

  describe('Header', () => {
    it('should render a header', () => {

    });

    it('should render navigation', () => {

    });
  });

  describe('when authenticated', () => {
    let databaseSetSpy, storageUploadSpy, givenEventDate, givenEventName, givenEventTime, givenEventAddress, givenEventCity, givenEventState, givenContactPhone, givenContactEmail, givenEventImage, givenEventMemo;

    beforeEach(() => {
      givenEventDate = `${chance.date()}`;
      givenEventName = chance.word();
      givenEventTime = chance.word();
      givenEventAddress = chance.address();
      givenEventCity = chance.city();
      givenEventState = chance.pickone(stateNameList);
      givenContactPhone = chance.phone();
      givenContactEmail = chance.email();
      givenEventImage = new File(['hello'], 'hello.png', {type: 'image/png'});
      givenEventMemo = chance.word();

      onAuthStateChangedSpy = jest.spyOn(firebase.auth(), 'onAuthStateChanged')
        .mockImplementation(jest.fn((callback) => callback(
          {
            uid: chance.guid()
          }
        )));

      jest.spyOn(firebase, 'database').mockImplementation(() => ({
        ref: jest.fn().mockReturnThis(),
        set: databaseSetSpy
      }));
    });

    afterEach(() => {
      firebase.auth().onAuthStateChanged.mockClear();
      firebase.database.mockClear();
    });

    describe('Upload Form', () => {
      it('should upload an event', async () => {
        databaseSetSpy = jest.fn().mockResolvedValue('yo');

        const {getByRole, getByText, queryByText} = render(<Admin/>);

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
            image: 'hello.png',
            memo: givenEventMemo
          });
        });

        expect(queryByText('Event added successfully.')).toBeInTheDocument();
      });

      it('should not upload an event', async () => {
        databaseSetSpy = jest.fn().mockRejectedValue('big error');

        const {getByRole, getByText, queryByText} = render(<Admin/>);

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
            image: 'hello.png',
            memo: givenEventMemo
          });
        });

        expect(queryByText('Event failed to be added.')).toBeInTheDocument();
      });
    });

    describe('Sign Up', () => {
      let authSpy;

      describe('when sign up is successful', () => {
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
          const givenPassword = chance.string();
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
          userEvent.click(signUpButton);

          await waitFor(() => {
            expect(authSpy).toHaveBeenCalledTimes(1);
            expect(authSpy).toHaveBeenLastCalledWith({
              username: givenEmail,
              password: givenPassword,
            });
          });

          expect(queryByText('User created successfully')).toBeInTheDocument();
        });
      });

      describe('when sign up is not successful', () => {
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
          const givenPassword = chance.string();
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
          userEvent.click(signUpButton);

          await waitFor(() => {
            expect(authSpy).toHaveBeenCalledTimes(1);
            expect(authSpy).toHaveBeenLastCalledWith({
              username: givenEmail,
              password: givenPassword,
            });
          });

          expect(queryByText('Failed to create user')).toBeInTheDocument();
        });
      });
    });
  });

  describe('when not authenticated', () => {
    beforeEach(() => {
      onAuthStateChangedSpy = jest.spyOn(firebase.auth(), 'onAuthStateChanged')
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
      const {getByTestId} = render(<Admin/>);

      expect(onAuthStateChangedSpy).toHaveBeenCalledTimes(1);
      expect(mockPushMethod).toHaveBeenCalledTimes(1);
      expect(mockPushMethod).toHaveBeenCalledWith('/sign-in');
    });
  });
});