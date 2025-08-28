import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        venue: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the expected format
    const transformedDeals = deals.map(deal => ({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      percentOff: deal.percentOff,
      status: deal.status,
      startAt: deal.startAt.toISOString(),
      endAt: deal.endAt.toISOString(),
      maxRedemptions: deal.maxRedemptions,
      redeemedCount: deal.redeemedCount || 0,
      venue: {
        name: deal.venue?.name || 'Unknown Venue',
        businessType: deal.venue?.businessType || 'Restaurant'
      },
      merchant: {
        businessName: deal.venue?.name || 'Unknown Business',
        email: 'unknown@example.com'
      }
    }));

    return NextResponse.json({ deals: transformedDeals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}
