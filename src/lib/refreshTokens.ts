import { type JWT } from 'next-auth/jwt';

import { REFRESH_TOKENS } from './apollo/graphql/mutations';
import { RefreshTokenError } from './errors';
import { jwtDecode } from './jwtDecode';
import { parseSetCookieStringToValues } from './parseCookies';

let isRefreshing = false;

export function shouldUpdateToken(token: JWT): boolean {
  const timeInSeconds = Math.floor(Date.now() / 1000);

  return timeInSeconds >= token.accessTokenExpiresAt;
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log('REFRESHING TOKENS using refresh token', token);

  if (isRefreshing) {
    return token;
  }

  isRefreshing = true;

  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `refreshToken=${token.refreshToken}`,
      },
      body: JSON.stringify({ query: REFRESH_TOKENS.loc?.source.body }),
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/graphql`, options);

    if (!response.ok) {
      throw new RefreshTokenError(`Token refresh failed with status: ${response.status}`);
    }

    const cookiesString = response.headers.get('set-cookie') ?? '';

    const cookies = parseSetCookieStringToValues(cookiesString);

    const { accessToken, refreshToken } = cookies;
    const decodedAccessToken = jwtDecode(accessToken);

    if (!accessToken || !refreshToken || !decodedAccessToken?.exp) {
      throw new RefreshTokenError('No access token or refresh token found');
    }

    return {
      ...token,
      accessToken: accessToken ?? token?.accessToken,
      accessTokenExpiresAt: decodedAccessToken?.exp,
      refreshToken: refreshToken ?? token?.refreshToken,
    };
  } finally {
    isRefreshing = false;
  }
}
