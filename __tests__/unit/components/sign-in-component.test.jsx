/* istanbul ignore file */

import {render, screen, within} from '@testing-library/react';
import SignInComponent from '../../../components/sign-in-component';

describe.skip('Unit : Sign In', () => {
  it('should render a heading', () => {
    const {getByRole} = render(<SignInComponent/>);

    const heading = getByRole('heading', {
      level: 1
    });

    expect(heading.textContent).toEqual('Sign In');
  });

  it('should render a form', () => {
    const {getByRole} = render(<SignInComponent/>);

    const signInForm = getByRole('form');

    expect(signInForm).toBeInTheDocument();
  });

  it('should render form controls', () => {
    render(<SignInComponent/>);

    const signInForm = screen.getByRole('form');
    const {getByLabelText} = within(signInForm);

    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });

  it('should render a submit button', () => {
    const {getByRole} = render(<SignInComponent/>);

    const signInButton = getByRole('button', {
      name: 'Sign In'
    });

    expect(signInButton).toHaveAttribute('type', 'submit');
  });

  it('should render a forgot password button', async () => {
    const {getByRole} = render(<SignInComponent/>);

    const forgotPasswordButton = getByRole('button', {
      name: 'Forgot Password'
    });

    expect(forgotPasswordButton).toHaveAttribute('type', 'button');
  });
});