import signInAction from '@/actions/signIn';
import signInGoogleAction from '@/actions/signInGoogle';

const LoginPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <form action={signInAction}>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' name='email' />
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' name='password' />
        <button type='submit'>Sign In</button>
      </form>
      <form action={signInGoogleAction}>
        <button type='submit'>Sign In with Google</button>
      </form>
    </div>
  );
};

export default LoginPage;
