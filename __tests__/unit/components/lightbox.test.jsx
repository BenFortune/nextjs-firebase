import {render} from '@testing-library/react';
import Lightbox from '../../../components/lightbox';

describe('Unit : Lightbox', () => {
  it('should render', () => {
    const {getByTestId} = render(<Lightbox/>);

    expect(getByTestId('lightbox-wrapper')).toBeTruthy();
  });
});