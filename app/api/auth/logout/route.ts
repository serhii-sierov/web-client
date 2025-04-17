import { updateCookie } from '@/middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return updateCookie(null, request, new NextResponse());
}
