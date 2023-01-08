import Head from 'next/head';
import {firebase} from '../../../firebase';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import FlierList from '../../../components/flier-list';
import {getEventData} from '../../../services/get-event-data';

async function getFlierList(currentYear, stateName, monthName, eventList) {
  const storageRef = firebase.storage().ref();

  return await Promise.all(eventList.map(async (event) => {
    if (!event.image) {
      return event;
    }

    event.imageSrc = await storageRef.child(`${currentYear}/${stateName}/${monthName}/${event.image}`).getDownloadURL();

    return event;
  }));
}

export async function getServerSideProps({params}) {
  let flierList = [];
  let error = false;
  const currentYear = new Date().getFullYear();
  const stateName = params.statename;
  const monthName = params.month;
  const dbRef = firebase.database().ref(`${currentYear}/${stateName}/${monthName}`);

  await getEventData(dbRef)
    .then(async (value) => {
      const eventList = Object.values(value);
      flierList = await getFlierList(currentYear, stateName, monthName, eventList);
    });

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