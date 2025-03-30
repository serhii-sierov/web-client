export interface Session {
  userId: number;
  sessionId: string;
  expiresAt: string;
}

export interface SignInResponse {
  signIn: Session;
}
