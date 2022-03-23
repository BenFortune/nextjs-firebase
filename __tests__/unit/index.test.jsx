import React from 'react';
import {render} from '@testing-library/react';
import Home from '../../pages';

describe('Unit : Home', () => {
  it('should render a heading and subtext', () => {
    const {getByRole, getByTestId} = render(<Home />);

    const heading = getByRole('heading', {
      name: 'Rick\'s List',
    });
    const subtext = getByTestId('header-subtext');

    expect(heading).toBeInTheDocument();
    expect(subtext).toBeInTheDocument();
    expect(subtext.textContent).toEqual('The top spot for cars shows in the heartland of America');
  });
});