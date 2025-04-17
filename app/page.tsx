import { query } from '@/src/lib/apollo/client';
import { auth } from '@/src/lib/auth';
import { gql } from '@apollo/client';

const Home = async () => {
  const session = await auth();

  let user;

  if (session) {
    user = await query({
      // errorPolicy: 'all',
      query: gql`
        query {
          user {
            id
            email
            name
            picture
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
