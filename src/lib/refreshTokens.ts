import { type JWT } from 'next-auth/jwt';

import { REFRESH_TOKENS } from './apollo/graphql/mutations';
import { jwtDecode } from './jwtDecode';
import { parseSetCookieString } from './parseCookies';

// export async function refreshAccessToken<T extends { refreshToken?: string }>(token: T, val?: number): Promise<T> {
//   console.log('REFRESHING TOKENS', val);

//   if (!token.refreshToken) {
//     throw new Error('Missing refresh token');
//   }

//   console.log('Refreshing tokens:', val, { refreshToken: token.refreshToken });
//   try {
//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Cookie': `refreshToken=${token.refreshToken}`,
//       },
//       body: JSON.stringify({ query: REFRESH_TOKENS.loc?.source.body }),
//     };
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/graphql`, options);

//     const cookiesString = res.headers.get('set-cookie') ?? '';

//     const parsedCookies = parseSetCookieString(cookiesString);
//     const parsedCookiesObject = parsedCookies.reduce<Record<string, string>>((acc, cookie) => {
//       acc[cookie.name] = cookie.value;
//       return acc;
//     }, {});

//     const { data, errors } = await res.json();

//     console.log(val, { data, parsedCookiesObject, errors });

//     // return token;

//     if (res.status === 200 && !errors) {
//       // Success 200 OK
//       const decodedAccessToken = jwtDecode(parsedCookiesObject?.accessToken);
//       return {
//         ...token,
//         accessToken: parsedCookiesObject?.accessToken,
//         refreshToken: parsedCookiesObject?.refreshToken,
//         accessTokenExpiresAt: decodedAccessToken?.exp,
//       };
//     } else {
//       throw new Error('RefreshAccessTokenError');
//     }
//   } catch (error) {
//     console.log('Error refreshing tokens:', error);

//     return {
//       ...token,
//       error: 'RefreshAccessTokenError',
//     };
//   }
// }

let isRefreshing = false;

export function shouldUpdateToken(token: JWT): boolean {
  const timeInSeconds = Math.floor(Date.now() / 1000);

  return timeInSeconds >= token.accessTokenExpiresAt;
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log('REFRESHING TOKENS using', token);

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
      console.log('Error refreshing tokens:', response);

      throw new Error(`Token refresh failed with status: ${response.status}`);
    }

    const cookiesString = response.headers.get('set-cookie') ?? '';

    const parsedCookies = parseSetCookieString(cookiesString);
    const newTokens = parsedCookies.reduce<Record<string, string>>((acc, cookie) => {
      acc[cookie.name] = cookie.value;
      return acc;
    }, {});

    const { accessToken, refreshToken } = newTokens;
    const decodedAccessToken = jwtDecode(accessToken);

    if (!accessToken || !refreshToken || !decodedAccessToken?.exp) {
      token.error = 'RefreshTokenError';
      throw new Error('Unauthorized');
    }

    return {
      ...token,
      accessToken: accessToken ?? token?.accessToken,
      accessTokenExpiresAt: decodedAccessToken?.exp,
      refreshToken: refreshToken ?? token?.refreshToken,
    };
  } catch (e) {
    // console.error(e);
    throw e;
  } finally {
    isRefreshing = false;
  }

  return token;
}
