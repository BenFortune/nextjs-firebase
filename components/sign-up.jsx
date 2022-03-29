import firebase from 'firebase';
import {useState} from 'react';

export default function SignUp() {
  const [alertMessage, updateAlertMessage] = useState({
    display: false,
    alertType: null
  });

  async function signUp(event) {
    event.preventDefault();

    const {name, email, password} = event.target.elements;
    const req = {
      username: email.value,
      password: password.value,
    };

    try {
      await firebase.auth().createUserWithEmailAndPassword(req);
      updateAlertMessage({display: true, alertType: 'success'});
    } catch (error) {
      updateAlertMessage({display: true, alertType: 'failure'});
    }
  }

  function renderAlertMessage(alertType) {
    return (
      <>
        {alertType === 'success'
          ? <div data-testid="success-message">User created successfully</div>
          : <div data-testid="error-message">Failed to create user</div>
        });
      </>
    );
  }

  return (
    <section className="sign-up-form-wrapper">
      <h2>Sign Up</h2>
      {alertMessage.display ? renderAlertMessage(alertMessage.alertType) : null}
      <form name="sign-up-form" onSubmit={signUp}>
        <label htmlFor="user-name">Name</label>
        <input id="user-name" type="text" name="name"/>
        <label htmlFor="user-email">Email</label>
        <input id="user-email" type="email" name="email" />
        <label htmlFor="user-password">Password</label>
        <input id="user-password" type="password" name="password"/>
        <button type="submit">Sign Up</button>
      </form>
    </section>
  );
}