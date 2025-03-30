import config from '@/src/config/environment';
import { HttpLink } from '@apollo/client';

export const httpLink = () => {
  return new HttpLink({
    uri: `${config.env.API_HOST}/graphql`,
  });
};
