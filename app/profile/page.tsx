import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const initials = (session.user?.name ?? session.user?.email ?? '?')
    .split(' ')
    .map((name) => name.charAt(0))
    .join('');

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold text-center'>Profile</h1>
      <div className='p-6 rounded-lg shadow-sm border'>
        <div className='flex items-start gap-6'>
          <Avatar className='size-24'>
            <AvatarImage src={session.user?.image ?? ''} />
            <AvatarFallback className='text-4xl'>{initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='text-xl font-semibold'>{session.user?.name || 'No name set'}</h2>
              <p className='text-muted-foreground'>{session.user?.email}</p>
            </div>
            <div className='space-y-2'>
              <div>
                <span className='text-sm text-muted-foreground'>Session ID:</span>
                <p className='font-mono text-sm'>{session.sessionId}</p>
              </div>
              <div>
                <span className='text-sm text-muted-foreground'>Provider:</span>
                <p className='font-mono text-sm'>{session.provider || 'Email/Password'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
