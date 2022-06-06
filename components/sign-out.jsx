import {firebase} from '../firebase';
import {useRouter} from 'next/router';

export default function SignOut() {
  const router = useRouter();

  function signOut() {
    firebase.auth().signOut().then((response) => {
      router.push('/');
    }).catch((error) => {
      // TODO: show error banner on error?
      console.log('Sign Out Error', error);
    });
  }

  return(
    <button type='button' onClick={signOut}>Sign Out</button>
  );
}