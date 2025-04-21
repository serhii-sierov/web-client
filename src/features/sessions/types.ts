export type Session = {
  sessionId: string;
  device: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  identity: {
    provider: string;
  };
};
