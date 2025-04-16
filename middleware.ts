import { encode, getToken } from 'next-auth/jwt';
import { type NextMiddleware, type NextRequest, NextResponse } from 'next/server';

import { refreshAccessToken, shouldUpdateToken } from './src/lib/refreshTokens';

export const SIGNIN_SUB_URL = '/login';

const sessionTimeout = 60 * 60 * 24 * 30; // 30 days
const isSecure = process.env.NEXTAUTH_URL?.startsWith('https://');
const cookiePrefix = isSecure ? '__Secure-' : '';
const sessionCookieName = `${cookiePrefix}authjs.session-token`;

export function updateCookie(
  sessionToken: string | null,
  request: NextRequest,
  response: NextResponse,
): NextResponse<unknown> {
  /*
   * BASIC IDEA:
   *
   * 1. Set request cookies for the incoming getServerSession to read new session
   * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
   * 3. Set response cookies to send back to browser
   */

  if (sessionToken) {
    // Set the session token in the request and response cookies for a valid session
    request.cookies.set(sessionCookieName, sessionToken);
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    response.cookies.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      maxAge: sessionTimeout,
      secure: isSecure,
      sameSite: 'lax',
    });
  } else {
    console.log('deleting session token');

    response.cookies.delete(sessionCookieName);
    // return NextResponse.redirect(new URL(SIGNIN_SUB_URL, request.url));
  }

  return response;
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
  console.log('middleware', request.url);
  let response = NextResponse.next();

  if (request.url.includes('/api/auth/logout')) {
    console.log('logout middleware');
    const redirectUrl = new URL('/login', request.url);
    response = NextResponse.redirect(redirectUrl);
    response = updateCookie(null, request, response);

    return response;
  }

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  console.log('token', token);

  //   const isAuthenticated = !!token;

  if (!token) {
    console.log('redirecting to login');
    return NextResponse.redirect(new URL(SIGNIN_SUB_URL, request.url));
  }

  if (shouldUpdateToken(token)) {
    try {
      const newToken = await refreshAccessToken(token);
      console.log('newToken', newToken);

      const newSessionToken = await encode({
        secret: process.env.NEXTAUTH_SECRET!,
        token: newToken,
        maxAge: sessionTimeout,
        salt: sessionCookieName,
      });
      response = updateCookie(newSessionToken, request, response);
    } catch (error) {
      console.log('Error refreshing token: ', error);
      return updateCookie(null, request, response);
    }
  }

  //   if (isAdminPage && isAuthenticated && !admins.includes(token.email!)) {
  //     return NextResponse.redirect(new URL('/forbidden', request.url));
  //   }

  return response;
};

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|login).*)', '/', '/(api|trpc)(.*)'],
  // matcher: ['/'],
};
