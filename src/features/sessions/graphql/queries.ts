import { gql } from '@apollo/client';

export const GET_SESSIONS = gql`
  query {
    user {
      sessions {
        sessionId
        device
        ipAddress
        createdAt
        expiresAt
        identity {
          provider
        }
      }
    }
  }
`;
