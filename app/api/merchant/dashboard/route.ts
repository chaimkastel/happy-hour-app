import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get merchant
    const merchant = await db.merchant.findUnique({
      where: { userId: session.user.id },
      include: {
        venues: {
          include: {
            deals: {
              where: { status: 'ACTIVE' },
              orderBy: { createdAt: 'desc' },
              include: {
                _count: {
                  select: { redemptions: true }
                }
              }
            },
          },
        },
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const allDeals = merchant.venues.flatMap(venue => venue.deals);
    const totalDeals = allDeals.length;
    const activeDeals = allDeals.filter(deal => deal.active).length;
    
    const totalRedemptions = await db.redemption.count({
      where: {
        deal: {
          venueId: {
            in: merchant.venues.map(venue => venue.id),
          },
        },
        status: 'REDEEMED',
      },
    });

    // Calculate monthly revenue (simplified - in real app, this would be more complex)
    const monthlyRevenue = totalRedemptions * 5; // $5 per redemption as example

    const topDeal = allDeals.length > 0 
      ? allDeals.reduce((prev, current) => 
          (current._count.redemptions > prev._count.redemptions) ? current : prev
        )
      : null;

    const stats = {
      totalDeals,
      activeDeals,
      totalRedemptions,
      monthlyRevenue,
      topDeal,
    };

    return NextResponse.json({ merchant, stats });
  } catch (error) {
    console.error('Error fetching merchant dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
