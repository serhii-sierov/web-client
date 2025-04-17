import { type JWT } from 'next-auth/jwt';

import { rawQuery } from './apollo/client';
import { REFRESH_TOKENS } from './apollo/graphql/mutations';
import { RefreshTokenError } from './errors';
import { getUserAgentAndIp } from './getUserAgentAndIp';
import { jwtDecode } from './jwtDecode';
import { SignInResponse } from './types';

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
  const { userAgent, ip } = await getUserAgentAndIp();

  try {
    const { cookies } = await rawQuery<SignInResponse>(
      REFRESH_TOKENS,
      {},
      {
        'Cookie': `refreshToken=${token.refreshToken}`,
        'User-Agent': userAgent,
        'X-Forwarded-For': ip,
      },
    );
    console.log('cookies', cookies);
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
