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
              createdAt
              identity {
                provider
              }
            }
          }
        }
      `,
    });
  }

  return (
    <div>
      <main>Home</main>
      <h1 className='text-3xl font-bold underline'>User info</h1>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      <footer>Footer</footer>
    </div>
  );
};

export default Home;
