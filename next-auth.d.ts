import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    sessionId: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    name?: string;
    image?: string;
  }

  interface Session {
    sessionId: string;
    accessToken: string;
    provider?: string;
  }
}
