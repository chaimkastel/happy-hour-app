import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || 'NOT_FOUND',
    environment: process.env.NODE_ENV
  });
}
