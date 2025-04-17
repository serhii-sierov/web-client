'use server';

import { signIn } from '@/src/lib/auth';

const signInGoogleAction = async () => {
  console.log('signInGoogleAction');

  const signInResult = await signIn('google');
  console.log(signInResult);
};

export default signInGoogleAction;
