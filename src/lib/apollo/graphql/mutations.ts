import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!, $forceNewSession: Boolean) {
    signIn(input: { email: $email, password: $password, forceNewSession: $forceNewSession }) {
      userId
      sessionId
      expiresAt
      user {
        name
        picture
      }
    }
  }
`;

export const SIGN_IN_GOOGLE = gql`
  mutation SignInGoogle($idToken: String!) {
    signInGoogle(input: { idToken: $idToken }) {
      userId
      sessionId
      expiresAt
      user {
        name
        picture
      }
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
