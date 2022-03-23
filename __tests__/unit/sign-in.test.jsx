import {getByRole, render, within} from '@testing-library/react';
import SignIn from '../../pages/sign-in';

describe('Unit : Sign In', () => {
  it('should render', () => {
    const {getByRole} = render(<SignIn/>);

    expect(getByRole('main')).toBeInTheDocument();
  });

  it('should have a heading', () => {
    const {getByRole} = render(<SignIn/>);

    const heading = getByRole('heading', {
      level: 1
    });

    expect(heading.textContent).toEqual('Sign In');
  });

  it('should have a sign in form', () => {
    const {getByRole} = render(<SignIn/>);

    const form = getByRole('form');
    const {getByLabelText} = within(form);

    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });

  it('should render a submit button', () => {
    const {getByRole} = render(<SignIn/>);

    const signInButton = getByRole('button', {
      name: 'Sign In'
    });

    expect(signInButton).toBeInTheDocument();
  });

  it('should render a forgot password button', () => {
    const {getByRole} = render(<SignIn/>);

    const forgotPasswordButton = getByRole('button', {
      name: 'Forgot Password'
    });

    expect(forgotPasswordButton).toBeInTheDocument();
  });
});