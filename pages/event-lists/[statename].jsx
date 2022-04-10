import Head from 'next/head';
import firebase from '../../firebase';
import Header from '../../components/header';
import Footer from '../../components/footer';
import EventList from '../../components/event-list';

export async function getServerSideProps(context) {
  const stateName = context.params.statename;
  const eventList = [];
  const dbRef = firebase.database().ref(`/${stateName}`);
  const getEventData = (ref) => {
    return new Promise((resolve, reject) => {
      const onError = (error) => reject(error);
      const onSuccess = (snapshot) => resolve(snapshot.val());

      ref.on('value', onSuccess, onError);
    });
  };

  await getEventData(dbRef)
    .then((value) => {
      Object.entries(value).forEach((entry) => {
        const [key, value] = entry;

        eventList.push(value);
      });
    })
    .catch((error) => {
      console.log('Ben - error in db call', error);
      // Error handle here
    });

  return { props: { stateName, eventList } };
}

export default function EventLists({stateName, eventList, showErrorMessage}) {
  return (
    <>
      <Head>
        <title>Rick&#39;s List {stateName} Event List</title>
        <meta name="description" content={`Rick's List ${stateName} car shows & car related events list`} />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Header/>
      <main>
        <h1>Ricks List {stateName} Event List</h1>
        <p>{eventList.length} Events to Show</p>
        {showErrorMessage
          ? <div>There was an error retrieving these events. Please try again later.</div>
          : <EventList eventList={eventList} />
        }
      </main>
      <Footer/>
    </>
  );
}