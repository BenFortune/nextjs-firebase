import Head from 'next/head';
import {API} from 'aws-amplify';
import {stateNameList, stateNameToAbbreviation} from '../../constants/state-names';
import Header from '../../components/header';
import Footer from '../../components/footer';
import EventList from '../../components/event-list';

export async function getStaticPaths() {
  const paths = stateNameList.map((stateName) => ({
    params: { statename: stateName.fullName },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  let eventList = [], showErrorMessage = false;
  const stateName = params.statename;
  const stateNameAbbreviation = stateNameToAbbreviation[stateName];

  try {
    const events = await API.graphql({
      query: 'listEvents',
      variables: {
        filter: {
          state: {
            eq: stateNameAbbreviation
          }
        }
      }
    });

    eventList = events.data.listEvents.items;
  } catch {
    showErrorMessage = true;
  }

  return {
    props: {
      stateName,
      eventList,
      showErrorMessage
    },
    revalidate: 10
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
        {showErrorMessage
          ? <div>There was an error retrieving these events. Please try again later.</div>
          : <EventList eventList={eventList} />
        }
      </main>
      <Footer/>
    </>
  );
}