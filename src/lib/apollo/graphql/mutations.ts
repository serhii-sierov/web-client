import { gql } from '@apollo/client';

export const SIGN_IN_CREDENTIALS = gql`
  mutation SignInCredentials($email: String!, $password: String!, $forceNewSession: Boolean) {
    signInCredentials(input: { email: $email, password: $password, forceNewSession: $forceNewSession }) {
      userId
      sessionId
      expiresAt
    }
  }
`;

export const SIGN_IN_GOOGLE = gql`
  mutation SignInGoogle($idToken: String!) {
    signInGoogle(input: { idToken: $idToken }) {
      userId
      sessionId
      expiresAt
    }
  }
`;

export const REFRESH_TOKENS = gql`
  mutation RefreshTokens {
    refreshTokens {
      userId
      sessionId
      expiresAt
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`;
