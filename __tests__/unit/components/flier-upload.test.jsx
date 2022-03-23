import {render} from '@testing-library/react';
import FlierUpload from '../../../components/flier-upload';

describe('Unit : Flier Upload', () => {
  it('should render a file upload form control', () => {
    const {getByLabelText, getByTestId} = render(<FlierUpload/>);

    getByLabelText('Upload Flier');
    const uploadInput = getByTestId('event-flier-upload');

    expect(uploadInput).toHaveAttribute('type', 'file');
    expect(uploadInput).toHaveAttribute('accept', 'image/*');
  });
});