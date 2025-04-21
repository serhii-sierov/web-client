import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';

import SignOutButton from './SignOutButton';

import { auth } from '../lib/auth';

const AppBar = async () => {
  const session = await auth();

  const initials = (session?.user?.name ?? session?.user?.email ?? '?')
    .split(' ')
    .map((name) => name.charAt(0))
    .join('');

  return (
    <div style={{ borderBottom: '1px solid white', padding: '10px' }}>
      {!session && <Link href='/login'>Sign In</Link>}
      {session && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Avatar className='size-16'>
            <AvatarImage src={session.user?.image ?? ''} />
            <AvatarFallback className='text-black text-2xl'>{initials}</AvatarFallback>
          </Avatar>
          Hi, {session.user?.name || session.user?.email}
          <br />
          Session ID: {session.sessionId}
          <br />
          Provider: {session?.provider}
          <SignOutButton>Sign Out</SignOutButton>
        </div>
      )}
    </div>
  );
};

export default AppBar;
