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
import { redirect } from 'next/navigation';

import { createAuthLink, errorLink, httpLink } from './links';

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
    console.log('query');

    return await getClient().query<T, TVariables>(options);
  } catch (error) {
    console.log('query error');

    // if (error instanceof ApolloError && error.cause instanceof AccessTokenError) {
    //   console.error(error);

    //   redirect(LOGOUT_ROUTE); //"/api/auth/logout"
    // }

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
    return await getClient().mutate<TData, TVariables, TContext, TCache>(options);
  } catch (error) {
    // if (error instanceof ApolloError && error.cause instanceof AccessTokenError) {
    //   console.error(error);

    //   redirect(LOGOUT_ROUTE);
    // }

    throw error;
  }
};
