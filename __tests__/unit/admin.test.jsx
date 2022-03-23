import {render} from '@testing-library/react';
import Admin from '../../pages/admin';

describe('Unit : Admin', () => {
  it('should render a header', () => {
    const {getByRole} = render(<Admin/>);

    const heading = getByRole('heading', {
      level: 1
    });

    expect(heading.textContent).toEqual('Ricks List Admin');
  });
});