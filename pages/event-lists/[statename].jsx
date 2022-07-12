import Head from 'next/head';
import {firebase} from '../../firebase';
import Header from '../../components/header';
import Footer from '../../components/footer';
import EventList from '../../components/event-list';
import {monthsMap, monthFullName} from '../../constants/months-map';

export async function getServerSideProps(context) {
  const stateName = context.params.statename;
  let eventMappedList = [];
  const currentYear = new Date().getFullYear();
  const dbRef = firebase.database().ref(`${currentYear}/${stateName}`);
  const getEventData = (ref) => {
    return new Promise((resolve, reject) => {
      const onError = (error) => reject(error);
      const onSuccess = (snapshot) => resolve(snapshot.val());

      ref.on('value', onSuccess, onError);
    });
  };

  await getEventData(dbRef)
    .then((value) => {
      const events = {};
      const sortedEvents = {};
      // console.log('Ben - value', value);
      Object.entries(value).forEach((entry) => {
        const [key, values] = entry;
        const unsortedEvents = Object.values(values);
        events[key] = unsortedEvents.sort((a, b) => a.date.split('/')[1] - b.date.split('/')[1]);
      });

      monthFullName.forEach((month) => {
        sortedEvents[month] = events[month];
      });

      eventMappedList = Object.entries(sortedEvents).map((event) => {
        const [month, list] = event;

        return {
          month,
          list: list ? list : null
        };
      });
    })
    .catch((error) => {
      console.log('Ben - error in db call', error);
      // Error handle here
    });

  return {
    props: {
      stateName,
      eventList: eventMappedList
    }
  };
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