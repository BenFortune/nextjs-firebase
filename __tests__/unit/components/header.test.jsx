import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../../components/header';

describe('Unit : Header', () => {
  it('renders a header', () => {
    render(<Header />);

    const header = screen.getByRole('banner');

    expect(header).toBeInTheDocument();
  });

  it('render the Rick\'s List logo', () => {
    render(<Header />);

    const ricksListLogo = screen.getByRole('img');

    expect(ricksListLogo).toBeInTheDocument();
    expect(ricksListLogo).toHaveAttribute('alt', 'Rick\'s List Logo');
    expect(ricksListLogo).toHaveAttribute('src', '/RicksListLogo.png');
  });
});


