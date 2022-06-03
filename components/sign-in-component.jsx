/* istanbul ignore file */
// TODO: renable when this component is used
// export default function SignInComponent() {
//   // async function forgotPassword() {
//   //   const username = 'coolUsername';
//   //
//   //   try {
//   //     const password = await Auth.forgotPassword(username);
//   //
//   //     console.log('Ben - password', password);
//   //   } catch (e) {
//   //     console.log('dude failure');
//   //   }
//   //   return undefined;
//   // }
//
//   async function signIn(event) {
//     event.preventDefault();
//
//     const {email, password} = event.target.elements;
//
//     console.log('Ben - Sign In Data', email.value, password.value);
//
//     try {
//       const user = await Auth.signIn(email.value, password.value);
//
//       console.log('Ben - User', user);
//
//       // router.push('/');
//     } catch (e) {
//       console.log('Ben - Error', e);
//       // showSignInError(true);
//     }
//   }
//
//   return(
//     <section>
//       <h1>Sign In</h1>
//       <form name="sign-in-form" onSubmit={signIn}>
//         <label htmlFor="user-email">Email</label>
//         <input id="user-email" type="email" name="email"/>
//         <label htmlFor="user-password">Password</label>
//         <input id="user-password" type="password" name="password"/>
//         <button type="submit">Sign In</button>
//       </form>
//       <button type="button">Forgot Password</button>
//     </section>
//   );
// }