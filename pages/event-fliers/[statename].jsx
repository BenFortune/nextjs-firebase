import Head from 'next/head';
import {API, Storage} from 'aws-amplify';
import Header from '../../components/header';
import Footer from '../../components/footer';
import {stateNameList, stateNameToAbbreviation} from '../../constants/state-names';
import FlierList from '../../components/flier-list';

export async function getStaticPaths() {
  const paths = stateNameList.map((stateName) => ({
    params: { statename: stateName.fullName },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({params}) {
  let flierList = [];
  let error = false;
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

    flierList = Promise.all(events.data.listEvents.items.map(async (event) => {
      if (!event.image) {
        return event;
      }
      event.imageSrc = await Storage.get(event.image).catch(() => (error = true));

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