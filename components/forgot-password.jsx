export default function ForgotPassword() {
  return (
    <>
      <h2>Forgot Password</h2>
      <p data-testid="forgot-password-subtext">Enter your email below to have a password reset email sent to you</p>
      <form name="forgot-password-form">
        <label htmlFor="user-email">User Email</label>
        <input id="user-email" type="email"/>
        <button type="submit">Reset Password</button>
      </form>
    </>
  );
}