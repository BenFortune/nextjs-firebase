import {render} from '@testing-library/react';
import ForgotPassword from '../../../components/forgot-password';

describe('Unit : Forgot Password', () => {
  it('should render a heading', () => {
    const {getByRole} = render(<ForgotPassword/>);

    const heading = getByRole('heading', {
      heading: 2
    });

    expect(heading.textContent).toEqual('Forgot Password');
  });

  it('should render subtext', () => {
    const {getByTestId} = render(<ForgotPassword/>);

    const subtext = getByTestId('forgot-password-subtext');

    expect(subtext.textContent).toEqual('Enter your email below to have a password reset email sent to you');
  });

  it('should render a form', () => {
    const {getByRole} = render(<ForgotPassword/>);

    const form = getByRole('form');

    expect(form).toBeInTheDocument();
  });

  it('should render a form control', () => {
    const {getByLabelText} = render(<ForgotPassword/>);

    expect(getByLabelText('User Email')).toBeInTheDocument();
  });

  it('should render a submit button', () => {
    const {getByRole} = render(<ForgotPassword/>);
    const forgotPasswordButton = getByRole('button');

    expect(forgotPasswordButton.textContent).toEqual('Reset Password');
    expect(forgotPasswordButton).toHaveAttribute('type', 'submit');
  });
});