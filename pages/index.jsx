import Head from 'next/head';
import Header from '../components/header';
import styles from '../styles/Home.module.css';
import EventButtonsList from '../components/event-buttons-list';
import Footer from '../components/footer';

export default function Home() {
  return (
    // <div className={styles.container}>
    <div>
      <Head>
        <title>Ricks List</title>
        <meta name="description" content="The top spot for cars shows in the heartland of America" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <main>
        <h1>Rick&#39;s List</h1>
        <p data-testid="header-subtext">The top spot for cars shows in the heartland of America</p>
        <section>
          <EventButtonsList />
        </section>
      </main>
      <Footer />
    </div>
  );
}
