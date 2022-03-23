import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import UploadForm from '../components/upload-form';
import SignUp from '../components/sign-up';

export default function Admin() {
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
        <UploadForm/>
        <SignUp />
      </main>
      <Footer/>
    </>
  );
}