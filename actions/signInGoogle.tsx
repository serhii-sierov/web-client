'use server';

import { signIn } from '@/src/lib/auth';

const signInGoogleAction = async () => {
  console.log('signIGoogleAction');

  const signInResult = await signIn('google', { redirect: true });
  console.log(signInResult);
};

export default signInGoogleAction;
