import { getClient } from '@/src/lib/apollo/client';
import { SIGN_OUT } from '@/src/lib/apollo/graphql/mutations';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  // const body = await request.json();

  // // change with your own endpoint
  // const res = await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     'Authorization': `Bearer ${body.accessToken}`,
  //   },
  // });

  // // remove cookies after
  // (await cookies()).getAll().forEach(async (cookie) => {
  //   if (cookie.name.startsWith(`prefix.`)) (await cookies()).delete(cookie.name as any);
  // });

  const a = await getClient().mutate({ mutation: SIGN_OUT });
  console.log('ddddd', a);

  return Response.json({
    success: true,
    status: 200,
    // success: res.ok,
    // status: res.status,
  });
}
