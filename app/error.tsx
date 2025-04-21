'use client';

import { useEffect, useState } from 'react';

import { ErrorComponent } from '@/src/components/ErrorComponent';
import config from '@/src/config/environment';
import { Routes } from '@/src/constants/routes';
import { usePathname, useRouter } from 'next/navigation';

const REDIRECT_TIMEOUT = 10;

const ErrorHandler = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const [counter, setCounter] = useState(REDIRECT_TIMEOUT);
  const router = useRouter();
  const pathname = usePathname();
  const shouldRedirect = pathname !== Routes.HOME && config.env.IS_PRODUCTION;

  useEffect(() => {
    if (shouldRedirect) {
      const interval = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            reset();
            router.replace(Routes.HOME);

            return prev;
          }

          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <ErrorComponent
      error={error}
      shouldRedirect={shouldRedirect}
      counter={counter}
      isDevMode={!config.env.IS_PRODUCTION}
    />
  );
};

export default ErrorHandler;
