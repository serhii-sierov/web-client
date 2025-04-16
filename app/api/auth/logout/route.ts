import { signOut } from '@/src/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

  // const a = await getClient().mutate({ mutation: SIGN_OUT });
  // console.log('ddddd', a);
  // signOutAction();

  console.log('logout route');
  let response = NextResponse.next();
  // return Response.redirect(new URL('/login', request.url));

  // const res = await signOut();
  // console.log('res', res);

  return Response.json({
    success: true,
    status: 200,
    // success: res.ok,
    // status: res.status,
  });
}
