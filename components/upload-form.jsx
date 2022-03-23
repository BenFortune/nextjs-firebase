import {stateNameList} from '../constants/state-names';
import StatenameSelect from './statename-select';
import FlierUpload from './flier-upload';

export default function UploadForm() {
  return (
    <section className="upload-form-wrapper">
      <h2>Upload an Event</h2>
      <form name="upload-event-form">
        <label htmlFor="event-date">Date</label>
        <input id="event-date" type="text"/>
        <label htmlFor="event-name">Event Name</label>
        <input id="event-name" type="text"/>
        <label htmlFor="event-time">Time</label>
        <input id="event-time" type="text"/>
        <label htmlFor="event-address">Address</label>
        <input id="event-address" type="text"/>
        <label htmlFor="event-city">City</label>
        <input id="event-city" type="text"/>
        <StatenameSelect />
        <label htmlFor="event-contact-phone">Contact Phone</label>
        <input id="event-contact-phone" type="text" pattern="[0-9]{3}.[0-9]{3}.[0-9]{4}"/>
        <label htmlFor="event-contact-email">Contact Email</label>
        <input id="event-contact-email" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2, 4}$"/>
        <label htmlFor="event-memo">Memo</label>
        <input id="event-memo" type="text"/>
        <label htmlFor="event-flier-upload">Upload Flier</label>
        <input id="event-flier-upload" type="file" accept="image/*" data-testid="event-flier-upload"/>
        <button type="submit">Upload Event</button>
      </form>
    </section>
  );
};
