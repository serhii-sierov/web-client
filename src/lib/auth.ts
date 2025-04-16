import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { SIGN_IN } from './apollo/graphql/mutations';
import { jwtDecode } from './jwtDecode';
import { parseSetCookieString } from './parseCookies';
import { SignInResponse } from './types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/api/auth/login',
    signOut: '/api/auth/logout',
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = (credentials as { email: string; password: string }) ?? {};

        const res = await fetch('http://localhost:4400/graphql', {
          body: JSON.stringify({ query: SIGN_IN.loc?.source.body, variables: { email, password } }),
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
        const cookiesString = res.headers.get('set-cookie') ?? '';

        const parsedCookies = parseSetCookieString(cookiesString);
        const parsedCookiesObject = parsedCookies.reduce<Record<string, string>>((acc, cookie) => {
          acc[cookie.name] = cookie.value;
          return acc;
        }, {});

        const { data }: { data: SignInResponse } = await res.json();
        const session = data.signIn;

        const accessToken = parsedCookiesObject?.accessToken;
        const refreshToken = parsedCookiesObject?.refreshToken;
        const { exp } = jwtDecode(accessToken) ?? {};

        if (!session || !accessToken || !refreshToken || !exp) {
          throw new Error('Unauthorized');
        }

        return {
          id: String(session.userId),
          sessionId: session.sessionId,
          email,
          accessToken: parsedCookiesObject?.accessToken,
          refreshToken: parsedCookiesObject?.refreshToken,
          accessTokenExpiresAt: exp,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized: async ({ request, auth }) => {
      // console.log('===== authorized', { request, auth });

      return !!auth;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // console.log('===== signIn', { user, account, profile, email, credentials });

      const { provider, access_token } = account ?? {};
      if (provider === 'google') {
        // user.image = profile?.picture;
        try {
          const res = await fetch('http://localhost:4400/aoi/auth/google', {
            body: JSON.stringify({ email: user.email, token: account?.accessToken }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
          });
          console.log('res', res);
          console.log('res.json', await res.json());
        } catch (error) {
          console.log('error', error);
        }
      } else if (provider === 'credentials') {
        // const res = await fetch('http://localhost:4000/api/auth/credentials', {
      }

      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account, user, profile, trigger, session }): Promise<JWT> {
      if (account && user) {
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.accessToken = user.accessToken!;
        token.refreshToken = user.refreshToken;
        token.sessionId = user.sessionId;
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token.error === 'RefreshTokenError') {
        // await signOut();
        throw new Error('Session expired');
      }
      if (!token) {
        return session;
      }

      return {
        sessionId: token.sessionId,
        expires: session.expires,
        user: session.user,
        accessToken: token.accessToken,
      };
    },
  },
});

declare module 'next-auth' {
  interface Session {
    sessionId: string;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sessionId: string;
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken?: string;
    error?: 'RefreshTokenError';
  }
}
