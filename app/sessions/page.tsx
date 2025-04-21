import SessionsPage from '@/src/features/sessions/pages/SessionsPage';

const Sessions = async () => {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold text-center'>Sessions</h1>
      <SessionsPage />
    </div>
  );
};

export default Sessions;
