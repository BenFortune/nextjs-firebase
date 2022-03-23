import {getByRole, render, within} from '@testing-library/react';
import UploadForm from '../../../components/upload-form';
import FlierUpload from '../../../components/flier-upload';

describe('Unit : UploadForm', () => {
  it('should render a heading', () => {
    const {getByRole} = render(<UploadForm/>);
    const heading = getByRole('heading', {
      level: 2
    });

    expect(heading.textContent).toEqual('Upload an Event');
  });

  it('should render a form', () => {
    const {getByRole} = render(<UploadForm/>);
    const form = getByRole('form');

    expect(form).toBeInTheDocument();
  });

  it('should render text input form controls', () => {
    const {getByRole} = render(<UploadForm/>);

    const form = getByRole('form');
    const {getByLabelText} = within(form);
    expect(getByLabelText('Date')).toBeInTheDocument();
    expect(getByLabelText('Event Name')).toBeInTheDocument();
    expect(getByLabelText('Time')).toBeInTheDocument();
    expect(getByLabelText('Address')).toBeInTheDocument();
    expect(getByLabelText('City')).toBeInTheDocument();
    expect(getByLabelText('Contact Phone')).toBeInTheDocument();
    expect(getByLabelText('Contact Email')).toBeInTheDocument();
    expect(getByLabelText('Memo')).toBeInTheDocument();
  });

  it('should render a file upload form control', () => {
    const {getByLabelText, getByTestId} = render(<FlierUpload/>);

    getByLabelText('Upload Flier');
    const uploadInput = getByTestId('event-flier-upload');

    expect(uploadInput).toHaveAttribute('type', 'file');
    expect(uploadInput).toHaveAttribute('accept', 'image/*');
  });

  it('should render a submit button', () => {
    const {getByRole} = render(<UploadForm/>);
    const submitButton = getByRole('button');

    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton.textContent).toEqual('Upload Event');
  });
});
