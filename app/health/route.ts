import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';

type ResponseData = {
  status: number;
  version: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GET() {
  let appVersion = '';
  try {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version?: string };

    appVersion = packageJson.version || '';
  } catch (error) {
    throw new Error((error as Error).message);
  }

  return NextResponse.json<ResponseData>({ status: 200, version: appVersion });
}

export const dynamic = 'force-dynamic';
