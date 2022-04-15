/* istanbul ignore file */

import '../styles/globals.css';
import {useEffect} from 'react';
import {analytics} from '../firebase';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
      analytics();
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;