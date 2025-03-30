'use server';

import { getClient } from './apollo/client';
import { SIGN_OUT } from './apollo/graphql/mutations';
import { signOut } from './auth';

export const signOutAction = async () => {
  await getClient().mutate({ mutation: SIGN_OUT });
  await signOut();
};
