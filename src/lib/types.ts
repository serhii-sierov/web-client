export interface Session {
  userId: number;
  sessionId: string;
  expiresAt: string;
  user: {
    name?: string;
    picture?: string;
  };
}

export interface SignInResponse {
  signIn?: Session;
  signInGoogle?: Session;
  refreshTokens?: Session;
}
