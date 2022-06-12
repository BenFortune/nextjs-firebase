import Head from 'next/head';
import {firebase} from '../../firebase';
import Header from '../../components/header';
import Footer from '../../components/footer';
import FlierList from '../../components/flier-list';

export async function getServerSideProps({params}) {
  let flierList = [];
  let error = false;
  const eventList = [];
  const stateName = params.statename;
  const storageRef = firebase.storage().ref();
  const currentYear = new Date().getFullYear();

  try {
    await firebase.database().ref(`${currentYear}/${stateName}`).on('value', (snapshot) => {
      const dataSnapshot = snapshot.val();

      Object.entries(dataSnapshot).forEach((entry) => {
        const [key, value] = entry;

        eventList.push(value);
      });
    });

    flierList = await Promise.all(eventList.map(async (event) => {
      if (!event.imageSrc) {
        return event;
      }
      event.imageSrc = await storageRef.child(event.imageSrc).getDownloadURL();

      return event;
    }));
  } catch (e) {
    error = true;
  }

  return {
    props: {
      stateName,
      flierList,
      showErrorMessage: error
    },
    revalidate: 10
  };
}

export default function EventFliersByState({stateName, flierList, showErrorMessage}) {
  return(
    <>
      <Head>
        <title>Rick&#39;s List Event Fliers</title>
        <meta name="description" content={`Rick's List ${stateName} car shows & car related event fliers`} />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Header />
      <main>
        <h1>Ricks List {stateName} Event Fliers</h1>
        {
          showErrorMessage
            ? <div>There was an error retrieving fliers. Please try again later</div>
            : <FlierList flierList={flierList}/>
        }
      </main>
      <Footer/>
    </>
  );
}