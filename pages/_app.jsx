/* istanbul ignore file */

import '../styles/globals.css';
import {useEffect} from 'react';
import firebase from 'firebase';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
      firebase.analytics();
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;