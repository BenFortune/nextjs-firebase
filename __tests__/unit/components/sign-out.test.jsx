import {getByRole, render} from '@testing-library/react';
import SignOut from '../../../components/sign-out';

describe('Unit : Sign Out', () => {
  it('should render', () => {
    const {getByRole} = render(<SignOut/>);
    const signOutButton = getByRole('button');

    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton.textContent).toEqual('Sign Out');
  });
});