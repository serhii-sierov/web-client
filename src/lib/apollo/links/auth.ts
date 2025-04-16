import { ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { cookies } from 'next/headers';

import { auth } from '../../auth';

export type CreateAuthLink = () => ApolloLink;

export const createAuthLink = (): ApolloLink => {
  return setContext(async (operation, { headers }) => {
    try {
      const { accessToken } = (await auth()) ?? {};

      console.log('accessToken', accessToken);

      return {
        headers: {
          ...headers,
          Cookie: `accessToken=${accessToken};`,
        },
      };
    } catch (error) {
      console.log('Error getting access token:', error);

      //TODO: Logout user
      throw error;
    }
  });
};
