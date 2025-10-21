import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all deals to see what's in the database
    const deals = await prisma.deal.findMany({
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            // city, state fields don't exist in current schema
          }
        }
      },
      take: 10
    });

    // Get count by active status
    const activeCount = await prisma.deal.count({
      where: { status: 'ACTIVE' }
    });
    const inactiveCount = await prisma.deal.count({
      where: { status: { not: 'ACTIVE' } }
    });

    return NextResponse.json({
      deals,
      statusCounts: {
        active: activeCount,
        inactive: inactiveCount
      },
      totalDeals: deals.length
    });
  } catch (error) {
    console.error('Error fetching debug deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug deals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
