import Head from 'next/head';
import {firebase} from '../../../firebase';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import FlierList from '../../../components/flier-list';
import {stateNameToAbbreviation} from '../../../constants/state-names';

export async function getServerSideProps({params}) {
  let flierList = [];
  let error = false;
  let eventList = [];
  const stateName = params.statename;
  const monthName = params.month;
  const storageRef = firebase.storage().ref();
  const currentYear = new Date().getFullYear();

  try {
    await firebase.database().ref(`${currentYear}/${stateName}/${monthName}`).on('value', (snapshot) => {
      const dataSnapshot = snapshot.val();

      eventList = Object.values(dataSnapshot);
    });

    flierList = await Promise.all(eventList.map(async (event) => {
      if (!event.image) {
        return event;
      }

      const stateAbbreviation = stateNameToAbbreviation[event.state];

      event.imageSrc = await storageRef.child(`${currentYear}/${stateAbbreviation}/${monthName}/${event.image}`).getDownloadURL();

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
    }
  };
}

export default function EventFliersByState({stateName, flierList, showErrorMessage}) {
  return(
    <>
      <Head>
        <title>Rick&#39;s List Event Fliers</title>
        <meta name="description" content={`Rick's List ${stateName} car shows & car related event fliers`} />
        <link rel="icon" href="/public/favicon.ico"/>
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