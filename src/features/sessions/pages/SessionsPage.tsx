import { DataTable } from '@/src/features/sessions/components/DataTable';
import { query } from '@/src/lib/apollo/client';
import { auth } from '@/src/lib/auth';

import { columns } from '../constants/columns';
import { GET_SESSIONS } from '../graphql/queries';
import { Session } from '../types';

const SessionsPage = async () => {
  const currentSession = await auth();

  const { data } = await query<{
    user: {
      sessions: Session[];
    };
  }>({
    // errorPolicy: 'all',
    query: GET_SESSIONS,
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable
        columns={columns}
        data={data.user.sessions.map((session) => ({
          ...session,
          isCurrent: session.sessionId === currentSession?.sessionId,
        }))}
      />
    </div>
  );
};

export default SessionsPage;
