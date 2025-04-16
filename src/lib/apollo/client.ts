import {
  ApolloCache,
  ApolloError,
  ApolloQueryResult,
  DefaultContext,
  FetchResult,
  from,
  MaybeMasked,
  MutationOptions,
  OperationVariables,
  QueryOptions,
} from '@apollo/client';
import { ApolloClient, InMemoryCache, registerApolloClient } from '@apollo/experimental-nextjs-app-support';
import { GraphQLFormattedError } from 'graphql';
import { redirect } from 'next/navigation';

import { createAuthLink, errorLink, httpLink } from './links';

const handleUnauthorizedError = (errors?: readonly GraphQLFormattedError[]) => {
  if (errors?.some((err) => err.message === 'Unauthorized')) {
    redirect('/api/auth/logout');
  }
};

export const { getClient, PreloadQuery } = registerApolloClient(() => {
  const authLink = createAuthLink();

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, errorLink, httpLink()]),
  });
});

export const query = async <T = unknown, TVariables extends OperationVariables = OperationVariables>(
  options: QueryOptions<TVariables, T>,
): Promise<ApolloQueryResult<MaybeMasked<T>>> => {
  try {
    console.log(
      'QUERY:',
      options.query.loc?.source.body
        .split('\n')
        .map((line) => line.trim())
        .join(' '),
    );

    const response = await getClient().query<T, TVariables>(options);
    handleUnauthorizedError(response.errors);

    return response;
  } catch (error) {
    console.log('query error');

    if (error instanceof ApolloError) {
      handleUnauthorizedError(error.graphQLErrors);
    }

    throw error;
  }
};

export const mutate = async <
  // eslint-disable-next-line @typescript-eslint/naming-convention -- ApolloClient defines this shape.
  TData = unknown,
  // eslint-disable-next-line @typescript-eslint/naming-convention -- ApolloClient defines this shape.
  TVariables extends OperationVariables = OperationVariables,
  // eslint-disable-next-line @typescript-eslint/naming-convention -- ApolloClient defines this shape.
  TContext extends Record<string, unknown> = DefaultContext,
  // eslint-disable-next-line @typescript-eslint/naming-convention -- ApolloClient defines this shape.
  TCache extends ApolloCache<unknown> = ApolloCache<unknown>,
>(
  options: MutationOptions<TData, TVariables, TContext>,
): Promise<FetchResult<MaybeMasked<TData>>> => {
  try {
    console.log(
      'MUTATION:',
      options.mutation.loc?.source.body
        .split('\n')
        .map((line) => line.trim())
        .join(' '),
    );
    const response = await getClient().mutate<TData, TVariables, TContext, TCache>(options);
    handleUnauthorizedError(response.errors);

    return response;
  } catch (error) {
    if (error instanceof ApolloError) {
      handleUnauthorizedError(error.graphQLErrors);
    }

    throw error;
  }
};
