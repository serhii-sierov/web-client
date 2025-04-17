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

        return {
          id: String(session.userId),
          sessionId: session.sessionId,
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
      console.log('===== signIn', { user, account, profile, email, credentials });
      // const { userAgent, ip } = credentials ?? {};
      const { provider, id_token } = account ?? {};
      if (provider === 'google') {
        if (!profile?.email_verified) {
          throw new Error('Email not verified');
        }
        // user.image = profile?.picture;
        try {
          // const res = await fetch(`${config.env.API_HOST}/auth/google`, {
          //   body: JSON.stringify({ email: user.email, token: account?.accessToken }),
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${id_token}`,
          //     'User-Agent': userAgent?.value as string,
          //     'X-Forwarded-For': ip?.value as string,
          //   },
          // });
          // // console.log('res', res);
          // console.log(res.status, res.statusText);

          // console.log('res.json', await res.json());
          const { userAgent, ip } = await getUserAgentAndIp();

          const { data, cookies } = await rawQuery<SignInResponse>(
            SIGN_IN_GOOGLE,
            { idToken: id_token },
            {
              'User-Agent': userAgent as string,
              'X-Forwarded-For': ip as string,
            },
          );

          console.log('cookies', cookies);
          console.log('data', data);
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
      // console.log('===== jwt', { token, account, user, profile, trigger, session });
      if (account && user) {
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.accessToken = user.accessToken!;
        token.refreshToken = user.refreshToken;
        token.sessionId = user.sessionId;
      }

      return token;
    },
    async session({ session, token }): Promise<Session> {
      // console.log('===== session', { session, token });
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
  }
}
