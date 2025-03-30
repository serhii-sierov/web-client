import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    sessionId: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
    // idToken?: string;
    // exp: number;
    // role: string;
  }

  // interface Session {
  //   user: User & DefaultSession['user'];
  //   sessionId: string;
  //   expires: string;
  //   error: string;
  //   accessToken?: string;
  //   refreshToken?: string;
  // }
}
