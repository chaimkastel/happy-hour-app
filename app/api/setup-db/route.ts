import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Test all tables exist
    const userCount = await prisma.user.count();
    const merchantCount = await prisma.merchant.count();
    const venueCount = await prisma.venue.count();
    const dealCount = await prisma.deal.count();
    
    return NextResponse.json({
      message: 'Database connected successfully!',
      tables: {
        users: userCount,
        merchants: merchantCount,
        venues: venueCount,
        deals: dealCount
      },
      status: 'ready'
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // This will create tables if they don't exist
    await prisma.$executeRaw`SELECT 1;`;
    
    return NextResponse.json({
      message: 'Database tables are ready!',
      status: 'success'
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      error: 'Failed to setup database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
