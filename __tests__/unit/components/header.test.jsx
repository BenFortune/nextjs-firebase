import React from 'react';
import {render, screen, within} from '@testing-library/react';
import Header from '../../../components/header';

describe('Unit : Header', () => {
  it('should render a header', () => {
    render(<Header />);

    const header = screen.getByRole('banner');

    expect(header).toBeInTheDocument();
  });

  it('should render the Rick\'s List logo', () => {
    render(<Header />);

    const ricksListLogo = screen.getByRole('img');

    expect(ricksListLogo).toBeInTheDocument();
    expect(ricksListLogo).toHaveAttribute('alt', 'Rick\'s List Header Logo');
    expect(ricksListLogo).toHaveAttribute('src', '/_next/image?url=%2FRicksListLogo.png&w=3840&q=75');
  });

  it('should render the navigation', () => {
    render(<Header />);

    const list = screen.getByRole('list', {
      name: /ricks-lists-states-fliers/i,
    });
    const { getAllByTestId } = within(list);
    const stateNameListItems = getAllByTestId('state-flier-navigation-container');

    expect(stateNameListItems.length).toBe(6);
  });
});


