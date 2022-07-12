import {useState, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {firebase} from '../firebase';
import Header from '../components/header';
import Footer from '../components/footer';
import UploadForm from '../components/upload-form';
import SignUp from '../components/sign-up';
import SignOut from '../components/sign-out';

export default function Admin() {
  const [isAuthenticated, updatedAuthenticatedState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        router.push('/sign-in');
      } else {
        updatedAuthenticatedState(true);
      }
    });
  }, [router]);

  return(
    <>
      <Head>
        <title>Ricks List Admin</title>
        <meta name="description" content="Admin Page for Ricks List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <main>
        <h1>Ricks List Admin</h1>
        {isAuthenticated ?
          <section>
            <UploadForm />
            <SignUp />
            <SignOut />
          </section>
          : undefined // TODO: replace with loader
        }
      </main>
      <Footer/>
    </>
  );
}