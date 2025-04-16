import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, null, 2)}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});
