import { mutate } from '@/src/lib/apollo/client';
import { SIGN_OUT } from '@/src/lib/apollo/graphql/mutations';
import { signOut } from '@/src/lib/auth';

export async function GET() {
  await mutate({ mutation: SIGN_OUT });
  await signOut();
}
