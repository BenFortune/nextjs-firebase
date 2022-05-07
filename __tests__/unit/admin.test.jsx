import {render} from '@testing-library/react';
import Admin from '../../pages/admin';
import * as NextRouter from 'next/router';

describe('Unit : Admin', () => {
  it('should render a header', () => {
    const mockPushMethod = jest.fn();
    const useRouter = jest.spyOn(NextRouter, 'useRouter');
    useRouter.mockImplementationOnce(() => ({
      push: mockPushMethod,
    }));
    const {getByRole} = render(<Admin/>);

    const heading = getByRole('heading', {
      level: 1
    });

    expect(heading.textContent).toEqual('Ricks List Admin');
  });
});