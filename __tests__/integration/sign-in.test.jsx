import React from 'react';
import {fireEvent, render, waitFor, within} from '@testing-library/react';
import SignIn from '../../pages/sign-in';
import firebase from '../../firebase';
import Chance from 'chance';

const chance = new Chance();

describe('Integration : Sign In', () => {
  let authSpy, persistenceSpy;

  it('should render a header with navigation', () => {
    const {getByRole} = render(<SignIn/>);

    const header = getByRole('banner');
    const navigation = getByRole('navigation');

    expect(header).toBeInTheDocument();
    expect(navigation).toBeInTheDocument();
  });

  it('should render a footer', () => {
    const {getByRole} = render(<SignIn/>);

    const footer = getByRole('contentinfo',{
      name: 'Ricks List Footer'
    });

    expect(footer).toBeInTheDocument();
  });

  describe('when auth is successful', () => {
    beforeEach(() => {
      persistenceSpy = jest.spyOn(firebase.auth(), 'setPersistence').mockResolvedValue(() => {
        return jest.fn();
      });
      authSpy = jest.spyOn(firebase.auth(), 'signInWithEmailAndPassword').mockResolvedValue({
        name: 'ben',
        title: 'sup'
      });
    });

    afterEach(() => {
      firebase.auth().signInWithEmailAndPassword.mockClear();
    });

    it('should sign the user in ', async () => {
      const givenEmail = chance.email();
      const givenPassword = 'abc123';

      const {getByRole, queryByText} = render(<SignIn/>);

      const heading = getByRole('heading', {
        level: 1
      });
      const signInForm = getByRole('form');
      const {getByLabelText} = within(signInForm);
      const emailInput = getByLabelText('Email');
      const passwordInput = getByLabelText('Password');
      const signInButton = getByRole('button', {
        name: 'Sign In'
      });
      const signInError = queryByText('Sign In Error');

      expect(heading.textContent).toEqual('Sign In');
      expect(signInError).toBeNull();

      fireEvent.change(emailInput, {target: {value: givenEmail}});
      fireEvent.change(passwordInput, {target: {value: givenPassword}});
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenLastCalledWith(
          givenEmail,
          givenPassword
        );
      });

    });
  });
  describe('when auth is not successful', () => {
    beforeEach(() => {
      authSpy = jest.spyOn(firebase.auth(), 'signInWithEmailAndPassword').mockRejectedValue({
        message: 'Error Signing In',
        statusCode: 500
      });
    });

    afterEach(() => {
      firebase.auth().signInWithEmailAndPassword.mockClear();
    });

    it('should not sign the user in ', async () => {
      const givenProps = {
        signInError: false,
        updateSignInError: jest.fn().mockReturnValue(true)
      };
      const givenEmail = chance.email();
      const givenPassword = chance.word();

      const {getByRole, queryByText} = render(<SignIn {...givenProps}/>);

      const heading = getByRole('heading', {
        level: 1
      });
      const signInForm = getByRole('form');
      const {getByLabelText} = within(signInForm);
      const emailInput = getByLabelText('Email');
      const passwordInput = getByLabelText('Password');
      const signInButton = getByRole('button', {
        name: 'Sign In'
      });
      const initialSignInError = queryByText('Sign In Error');

      expect(heading.textContent).toEqual('Sign In');
      expect(initialSignInError).toBeNull();

      fireEvent.change(emailInput, {target: {value: givenEmail}});
      fireEvent.change(passwordInput, {target: {value: givenPassword}});
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenLastCalledWith(
          givenEmail,
          givenPassword
        );
      });

      const postAuthSignInError = queryByText('Sign In Error');

      expect(postAuthSignInError).toBeInTheDocument();
    });
  });
});