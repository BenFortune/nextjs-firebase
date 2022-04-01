import Head from 'next/head';
import firebase from '../../firebase';
import Header from '../../components/header';
import Footer from '../../components/footer';
import EventList from '../../components/event-list';

export async function getServerSideProps(context) {
  const stateName = context.params.statename;
  const eventList = [];

  await firebase.database().ref(`/${stateName}`).on('value', (snapshot) => {
    const dataSnapshot = snapshot.val();

    Object.entries(dataSnapshot).forEach((entry) => {
      const [key, value] = entry;

      eventList.push(value);
    });
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
        {showErrorMessage
          ? <div>There was an error retrieving these events. Please try again later.</div>
          : <EventList eventList={eventList} />
        }
      </main>
      <Footer/>
    </>
  );
}