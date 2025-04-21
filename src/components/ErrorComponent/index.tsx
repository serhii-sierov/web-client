'use client';

import { FC } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Routes } from '@/src/constants/routes';
import Link from 'next/link';

import { errorComponentContent } from './content';

export interface ErrorComponentProps {
  error: Error & { digest?: string };
  shouldRedirect: boolean;
  counter: number;
  isDevMode?: boolean;
}

export const ErrorComponent: FC<ErrorComponentProps> = ({ error, shouldRedirect, counter, isDevMode }) => {
  return (
    <Card className='w-full p-4 pb-10'>
      <CardHeader>
        <CardTitle>{errorComponentContent.header}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {!shouldRedirect ? (
          <p className='text-lg font-medium'>{errorComponentContent.refresh}</p>
        ) : (
          <>
            <p>
              {errorComponentContent.redirect.part1} {counter} {errorComponentContent.redirect.part2}
            </p>
            <p>
              {errorComponentContent.pressHere.part1}
              <Link href={Routes.HOME} className='text-primary hover:underline'>
                {errorComponentContent.pressHere.link}
              </Link>
              {errorComponentContent.pressHere.part2}
            </p>
          </>
        )}
        {isDevMode && (
          <div className='space-y-2'>
            <hr />
            <p className='font-bold'>{errorComponentContent.unhandledException}</p>
            <pre className='overflow-auto whitespace-pre text-sm font-mono p-4 bg-muted/10 rounded-md'>
              {error.stack}
            </pre>
            <hr />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
