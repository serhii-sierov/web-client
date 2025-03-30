import Image from 'next/image';
import Link from 'next/link';

import SignOutButton from './SignInOutButton';

import { auth } from '../lib/auth';

const AppBar = async () => {
  const session = await auth();
  console.log('AppBar', session);

  return (
    <div style={{ borderBottom: '1px solid white', padding: '10px' }}>
      {!session && <Link href='/login'>Sign In</Link>}
      {session && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {session.user?.image && (
            <Image
              src={session.user?.image}
              alt='Profile Picture'
              width={50}
              height={50}
              style={{ borderRadius: '50%' }}
            />
          )}
          Hi, {session.user?.name || session.user?.email}
          <br />
          Session ID: {session.sessionId}
          <SignOutButton>Sign Out</SignOutButton>
        </div>
      )}
    </div>
  );
};

export default AppBar;
