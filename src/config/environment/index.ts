/* eslint-disable @typescript-eslint/naming-convention -- Not needed for env vars */

const config = {
  env: {
    API_HOST: process.env.NEXT_PUBLIC_API_HOST ?? '',
    WS_API_HOST: process.env.NEXT_PUBLIC_WS_API_HOST ?? '',
    ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
  },
};

export default config;

/* eslint-enable @typescript-eslint/naming-convention */
