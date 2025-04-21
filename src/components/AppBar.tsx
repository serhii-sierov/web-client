import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import Link from 'next/link';

import SignOutLink from './SignOutLink';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

import { auth } from '../lib/auth';
import { cn } from '../lib/utils';

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
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Avatar className='size-16'>
              <AvatarImage src={session.user?.image ?? ''} />
              <AvatarFallback className='text-black text-2xl'>{initials}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-lg font-bold'>Hi, {session.user?.name || session.user?.email}</span>
              <span className='text-sm text-muted-foreground'>{session.user?.email}</span>
            </div>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href='/' className={cn(navigationMenuTriggerStyle(), 'font-bold text-lg')}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href='/profile' className={cn(navigationMenuTriggerStyle(), 'font-bold text-lg')}>
                  Profile
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href='/sessions' className={cn(navigationMenuTriggerStyle(), 'font-bold text-lg')}>
                  Sessions
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <SignOutLink />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </div>
  );
};

export default AppBar;
