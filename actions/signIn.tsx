'use server';

import { signIn } from '@/src/lib/auth';

const signInAction = async (formData: FormData) => {
  const email = formData.get('email');
  const password = formData.get('password');
  console.log('signInAction', email, password);

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const signInResult = await signIn('credentials', { email, password });
  console.log(signInResult);
};

export default signInAction;
