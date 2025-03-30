import { gql } from '@apollo/client';
import { cookies } from 'next/headers';

import { getClient } from './apollo/client';

const getUser = async () => {
  const apolloClient = getClient();

  const cookiesObject = await cookies();

  console.log('Cookies:', cookiesObject);

  return apolloClient.query<{ id: number; email: string }>({
    query: gql`
      query GetUser {
        user {
          id
          email
        }
      }
    `,
  });
};

export default getUser;
