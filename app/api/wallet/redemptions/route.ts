import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Type assertion for session
type SessionWithUser = {
  user: {
    email: string;
    [key: string]: any;
  };
};

// Force dynamic rendering for wallet API
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's redemptions with deal and venue information
    const redemptions = await prisma.redemption.findMany({
      where: {
        user: { email: session.user.email }
      },
      include: {
        deal: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                address: true,
                rating: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform the data to match the frontend interface
    const transformedRedemptions = redemptions.map(redemption => ({
      id: redemption.id,
      deal: {
        id: redemption.deal.id,
        title: redemption.deal.title,
        description: redemption.deal.description,
        percentOff: redemption.deal.percentOff,
        startAt: redemption.deal.startAt.toISOString(),
        endAt: redemption.deal.endAt.toISOString(),
        minSpend: redemption.deal.minSpend,
        tags: redemption.deal.tags ? JSON.parse(redemption.deal.tags) : [],
        venue: redemption.deal.venue
      },
      redeemedAt: redemption.createdAt.toISOString(),
      status: redemption.status
    }));

    return NextResponse.json({
      redemptions: transformedRedemptions,
      total: transformedRedemptions.length
    });
  } catch (error) {
    console.error('Error fetching wallet redemptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet redemptions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
