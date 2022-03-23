import {render, screen, within} from '@testing-library/react';
import Footer from '../../../components/footer';

describe('Unit : Footer', () => {
  it('should render a footer', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo',{
      name: 'Ricks List Footer'
    });

    expect(footer).toBeInTheDocument();
  });

  it('should render the logo as a link to the homepage', () => {
    render(<Footer />);

    const footerLink = screen.getByRole('link');

    expect(footerLink).toHaveAttribute('href', '/');

    const {getByRole} = within(footerLink);
    const footerLogo = getByRole('img');

    expect(footerLogo).toHaveAttribute('src', '/RicksListLogoFooter.png');
    expect(footerLogo).toHaveAttribute('alt', 'Ricks List Homepage');
  });
});