'use client';

import { signOutAction } from '@/actions/signOut';
import { cn } from '@/src/lib/utils';

import { NavigationMenuLink, navigationMenuTriggerStyle } from './ui/navigation-menu';

const SignOutLink = () => {
  return (
    <NavigationMenuLink
      className={cn(navigationMenuTriggerStyle(), 'font-bold text-lg cursor-pointer')}
      onClick={() => signOutAction()}
    >
      Sign Out
    </NavigationMenuLink>
  );
};

export default SignOutLink;
