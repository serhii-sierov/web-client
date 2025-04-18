import signInAction from '@/actions/signIn';
import signInGoogleAction from '@/actions/signInGoogle';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <div className='animate-fade-in'>Animated Content</div>
      <form action={signInAction}>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' name='email' />
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' name='password' />
        <Button type='submit' variant='outline'>
          Sign In
        </Button>
      </form>
      <form action={signInGoogleAction}>
        <Button type='submit' variant='secondary'>
          Sign In with Google
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
