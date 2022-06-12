import {useState} from 'react';
import {firebase} from '../firebase';
import {stateNameToAbbreviation} from '../constants/state-names';
import StatenameSelect from './statename-select';

export default function UploadForm() {
  const [imageFileObj, setImageFileObj] = useState();
  const [alertMessage, updateAlertMessage] = useState({
    display: false,
    alertType: null
  });

  // TODO: extract firebase database and storage reference pointers to new files
  async function uploadEvent(event) {
    event.preventDefault();

    const {date, name, time, address, city, state, phone, email, memo} = event.target.elements;
    const currentYear = new Date().getFullYear();
    const stateAbbreviation = stateNameToAbbreviation[state.value];
    const imageResponse = await uploadImage(currentYear, stateAbbreviation, imageFileObj);

    if (imageResponse !== 'error') {
      firebase.database().ref(`${currentYear}/${state.value}`).push({
        date: date.value,
        name: name.value,
        time: time.value,
        address: address.value,
        city: city.value,
        state: state.value,
        phone: phone.value,
        email: email.value,
        image: imageFileObj.name,
        memo: memo.value
      }).then(() => {
        updateAlertMessage({
          display: true,
          alertType: 'success'
        });
      }).catch(() => {
        updateAlertMessage({
          display: true,
          alertType: 'error'
        });
      });
    }
  }

  function uploadImage(year, stateAbbreviation, imageFile) {
    const childRef = firebase.storage().ref().child(`${year}/${stateAbbreviation}/${imageFile.name}`);
    return childRef.put(imageFile).then((snapshot) => {
      return `${snapshot.ref.fullPath}`;
    }).catch(() => {
      return 'error';
    });
  }

  function renderAlertMessage(alertType) {
    return (
      <>
        {alertType === 'success'
          ? <div>Event added successfully.</div>
          : <div>Event failed to be added.</div>
        });
      </>
    );
  }

  return (
    <section className="upload-form-wrapper">
      <h2>Upload an Event</h2>
      {alertMessage.display ? renderAlertMessage(alertMessage.alertType) : null}
      <form name="upload-event-form" aria-label="upload-event-form" onSubmit={uploadEvent}>
        <label htmlFor="event-date">Date</label>
        <input id="event-date" type="text" name="date" />
        <label htmlFor="event-name">Event Name</label>
        <input id="event-name" type="text" name="name"/>
        <label htmlFor="event-time">Time</label>
        <input id="event-time" type="text" name="time"/>
        <label htmlFor="event-address">Address</label>
        <input id="event-address" type="text" name="address"/>
        <label htmlFor="event-city">City</label>
        <input id="event-city" type="text" name="city"/>
        <StatenameSelect />
        <label htmlFor="event-contact-phone">Contact Phone</label>
        <input id="event-contact-phone" type="text" pattern="[0-9]{3}.[0-9]{3}.[0-9]{4}" name="phone"/>
        <label htmlFor="event-contact-email">Contact Email</label>
        <input id="event-contact-email" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2, 4}$" name="email"/>
        <label htmlFor="event-memo">Memo</label>
        <input id="event-memo" type="text" name="memo"/>
        <label htmlFor="event-flier-upload">Upload Flier</label>
        <input id="event-flier-upload"  type="file" name="flier" accept="image/*" onChange={(event) => setImageFileObj(event.target.files[0])}/>
        <button type="submit">Upload Event</button>
      </form>
    </section>
  );
};
