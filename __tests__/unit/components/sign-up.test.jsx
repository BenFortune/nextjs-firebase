import {render, screen, within} from '@testing-library/react';
import SignUp from '../../../components/sign-up';

describe('Unit : Sign Up', () => {
  it('should render a heading', () => {
    const {getByRole} = render(<SignUp/>);
    const heading = getByRole('heading', {
      level: 2
    });

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual('Sign Up');
  });

  it('should render a sign up form', () => {
    render(<SignUp/>);

    const signUpForm = screen.getByRole('form');
  });

  it('should render form controls', () => {
    render(<SignUp/>);

    const signUpForm = screen.getByRole('form');
    const {getByLabelText} = within(signUpForm);

    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
  });

  it('should render a submit button', () => {
    render(<SignUp/>);

    const signUpForm = screen.getByRole('form');
    const {getByRole} = within(signUpForm);
    const signUpButton = getByRole('button');

    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute('type', 'submit');
    expect(signUpButton.textContent).toEqual('Sign Up');
  });
});