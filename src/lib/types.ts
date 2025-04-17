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
  signInCredentials?: Session;
  signInGoogle?: Session;
  refreshTokens?: Session;
}
