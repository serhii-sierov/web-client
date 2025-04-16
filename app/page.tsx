import { signOutAction } from '@/actions/signOut';
import { getClient, query } from '@/src/lib/apollo/client';
import { auth, signOut } from '@/src/lib/auth';
import { gql } from '@apollo/client';
import { redirect } from 'next/navigation';

const Home = async () => {
  const session = await auth();

  let user;

  if (session) {
    user = await query({
      errorPolicy: 'all',
      query: gql`
        query {
          user {
            id
            email
            sessions {
              sessionId
              device
              ipAddress
            }
          }
        }
      `,
    });
  }

  return (
    <div>
      <main>Home</main>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      <footer>Footer</footer>
    </div>
  );
};

export default Home;
