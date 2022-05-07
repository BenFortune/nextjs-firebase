import {useState} from 'react';
import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import {firebase} from '../firebase';

export default function SignIn() {
  const [isSignInError, showSignInError] = useState(false);

  async function signIn(event) {
    event.preventDefault();

    const {email, password} = event.target.elements;

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => {

        const userCredential = await firebase.auth().signInWithEmailAndPassword(email.value, password.value);

        console.log('Ben success signing in', userCredential.user);
      })
      .catch((error) => {
        // Handle Errors here.
        console.log('Ben - auth set persistence error', error);
        let errorCode = error.code;
        let errorMessage = error.message;

        showSignInError(true);
      });
  }

  return (
    <>
      <Head>
        <title>Ricks List Sign In</title>
        <meta name="description" content="Sign In Page for Ricks List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <main>
        <h1>Sign In</h1>
        {isSignInError ? <div>Sign In Error</div> : null}
        <form name="sign-in-form" onSubmit={signIn}>
          <label htmlFor="user-email">Email</label>
          <input id="user-email" type="email" name="email"/>
          <label htmlFor="user-password">Password</label>
          <input id="user-password" type="password" name="password"/>
          <button type="submit">Sign In</button>
        </form>
        <button type="button">Forgot Password</button>
      </main>
      <Footer/>
    </>
  );
}