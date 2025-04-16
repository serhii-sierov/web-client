import { auth } from '@/src/lib/auth';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
  // description: 'Generated by create next app',
};

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // if (session) {
  //   redirect('/');
  // }

  return <>{children}</>;
}
