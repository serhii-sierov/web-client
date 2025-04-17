import { headers } from 'next/headers';

export const getUserAgentAndIp = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || 'unknown';
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

  return { userAgent, ip };
};
