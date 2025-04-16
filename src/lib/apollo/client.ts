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
  TypedDocumentNode,
} from '@apollo/client';
import { ApolloClient, InMemoryCache, registerApolloClient } from '@apollo/experimental-nextjs-app-support';
import { DocumentNode, GraphQLFormattedError } from 'graphql';
import { redirect } from 'next/navigation';

import { createAuthLink, errorLink, httpLink } from './links';

import { parseSetCookieStringToValues } from '../parseCookies';

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

export const rawQuery = async <T = unknown, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<T, TVariables>,
  variables: TVariables,
): Promise<FetchResult<T> & { cookies: Record<string, string>; status: number; statusText: string }> => {
  const uri = httpLink().options.uri?.toString();
  if (!uri) {
    throw new Error('GraphQL URI is not defined');
  }
  const res = await fetch(uri, {
    body: JSON.stringify({ query: query.loc?.source.body, variables }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
  if (!res.ok) {
    throw new Error('GraphQL request failed');
  }
  const cookiesString = res.headers.get('set-cookie') ?? '';

  const cookies = parseSetCookieStringToValues(cookiesString);

  const response: FetchResult<T> = await res.json();

  return { ...response, cookies, status: res.status, statusText: res.statusText };
};
