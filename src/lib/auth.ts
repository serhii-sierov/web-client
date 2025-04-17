import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { rawQuery } from './apollo/client';
import { SIGN_IN_CREDENTIALS, SIGN_IN_GOOGLE } from './apollo/graphql/mutations';
import { getUserAgentAndIp } from './getUserAgentAndIp';
import { jwtDecode } from './jwtDecode';
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

        const { userAgent, ip } = await getUserAgentAndIp();

        const { data, cookies } = await rawQuery<SignInResponse>(
          SIGN_IN_CREDENTIALS,
          { email, password },
          {
            'User-Agent': userAgent,
            'X-Forwarded-For': ip,
          },
        );

        const { accessToken, refreshToken } = cookies;
        const { exp } = jwtDecode(accessToken) ?? {};

        const session = data?.signInCredentials;

        if (!session || !accessToken || !refreshToken || !exp) {
          throw new Error('Unauthorized');
        }

        const { name, picture } = session.user ?? {};

        return {
          id: String(session.userId),
          sessionId: session.sessionId,
          name,
          image: picture,
          email,
          accessToken,
          refreshToken,
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
      const { provider, id_token } = account ?? {};
      if (provider === 'google') {
        if (!profile?.email_verified) {
          throw new Error('Email not verified');
        }
        try {
          const { userAgent, ip } = await getUserAgentAndIp();

          const { data, cookies } = await rawQuery<SignInResponse>(
            SIGN_IN_GOOGLE,
            { idToken: id_token },
            {
              'User-Agent': userAgent,
              'X-Forwarded-For': ip,
            },
          );

          const { accessToken, refreshToken } = cookies;
          const { exp } = jwtDecode(accessToken) ?? {};

          const session = data?.signInGoogle;

          if (!session || !accessToken || !refreshToken || !exp) {
            throw new Error('Unauthorized');
          }

          const { name, picture } = session.user ?? {};

          // Store the token data in the token object
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.accessTokenExpiresAt = exp;
          user.sessionId = session.sessionId;
          user.name = name;
          user.image = picture;
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }

      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account, user, profile, trigger, session }): Promise<JWT> {
      // console.log('===== jwt', { token, account, user, profile, trigger, session });
      if (user) {
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.sessionId = user.sessionId;
        token.provider = account?.provider;
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      // console.log('===== session', { session, token, user });
      if (!token) {
        return session;
      }

      return {
        sessionId: token.sessionId,
        expires: session.expires,
        user: session.user,
        accessToken: token.accessToken,
        provider: token.provider,
      };
    },
  },
});

declare module 'next-auth/jwt' {
  interface JWT {
    sessionId: string;
    accessToken: string;
    accessTokenExpiresAt: number;
    refreshToken: string;
    provider?: string;
  }
}
