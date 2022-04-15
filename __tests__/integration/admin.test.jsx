import {fireEvent, render, waitFor} from '@testing-library/react';
import {firebase} from '../../firebase';
import Admin from '../../pages/admin';
import Chance from 'chance';

const chance = new Chance();

describe('Integration : Admin', () => {
  describe('Upload Form', () => {
    it('should upload an event', () => {

    });
    it('should not upload an event', () => {

    });
  });
  describe('Header', () => {
    it('should render a header', () => {

    });

    it('should render navigation', () => {

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
        const {getByRole, queryByText, getByLabelText} = render(<Admin/>);

        expect(queryByText('User created successfully')).toBeNull();

        const givenEmail = chance.email();
        const givenPassword = chance.string();
        const givenName = chance.name();

        const nameInput = getByLabelText('Name');
        const emailInput = getByLabelText('Email');
        const password = getByLabelText('Password');
        const signUpButton = getByRole('button', {
          name: 'Sign Up'
        });

        fireEvent.change(nameInput, {target: {value: givenName}});
        fireEvent.change(emailInput, {target: {value: givenEmail}});
        fireEvent.change(password, {target: {value: givenPassword}});
        fireEvent.click(signUpButton);

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

        fireEvent.change(nameInput, {target: {value: givenName}});
        fireEvent.change(emailInput, {target: {value: givenEmail}});
        fireEvent.change(password, {target: {value: givenPassword}});
        fireEvent.click(signUpButton);

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