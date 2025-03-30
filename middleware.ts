import { encode, getToken } from 'next-auth/jwt';
import { type NextMiddleware, type NextRequest, NextResponse } from 'next/server';

import { refreshAccessToken, shouldUpdateToken } from './src/lib/refreshTokens';

export const SIGNIN_SUB_URL = '/login';
export const SESSION_TIMEOUT = 60 * 60 * 24 * 30; // 30 days
export const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://');
export const SESSION_COOKIE = SESSION_SECURE ? '__Secure-authjs.session-token' : 'authjs.session-token';

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
    request.cookies.set(SESSION_COOKIE, sessionToken);
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      maxAge: SESSION_TIMEOUT,
      secure: SESSION_SECURE,
      sameSite: 'lax',
    });
  } else {
    request.cookies.delete(SESSION_COOKIE);
    return NextResponse.redirect(new URL(SIGNIN_SUB_URL, request.url));
  }

  return response;
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  //   const isAuthenticated = !!token;

  let response = NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL(SIGNIN_SUB_URL, request.url));
  }

  if (shouldUpdateToken(token)) {
    try {
      const newToken = await refreshAccessToken(token);

      const newSessionToken = await encode({
        secret: process.env.NEXTAUTH_SECRET!,
        token: newToken,
        maxAge: SESSION_TIMEOUT,
        salt: SESSION_COOKIE,
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
  //   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  matcher: ['/'],
};
