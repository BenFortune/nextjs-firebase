import {useState} from 'react';
import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import {Auth} from 'aws-amplify';

export default function SignIn() {
  const [isSignInError, showSignInError] = useState(false);

  async function signIn(event) {
    event.preventDefault();

    const {email, password} = event.target.elements;

    console.log('Ben - Sign In Data', email.value, password.value);

    try {
      const user = await Auth.signIn(email.value, password.value);

      // router.push('/');
    } catch (e) {
      showSignInError(true);
    }
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