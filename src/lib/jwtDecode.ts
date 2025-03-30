import { DefaultJWT } from 'next-auth/jwt';

export const jwtDecode = <T extends DefaultJWT>(token: string): T | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};
