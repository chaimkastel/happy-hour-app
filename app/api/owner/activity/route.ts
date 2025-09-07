import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has owner or admin role
    if (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get recent merchants
    const recentMerchants = await prisma.merchant.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        businessName: true,
        createdAt: true,
        kycStatus: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });

    // Get recent deals
    const recentDeals = await prisma.deal.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        percentOff: true,
        createdAt: true,
        status: true,
        venue: {
          select: {
            name: true
          }
        }
      }
    });

    // Get recent redemptions
    const recentRedemptions = await prisma.redemption.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        deal: {
          select: {
            title: true,
            venue: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Format activities
    const activities = [
      ...recentMerchants.map(merchant => ({
        id: `merchant_${merchant.id}`,
        type: 'merchant_signup' as const,
        description: `New merchant "${merchant.businessName}" (${merchant.user.email}) signed up`,
        timestamp: merchant.createdAt.toISOString(),
        status: merchant.kycStatus === 'VERIFIED' ? 'success' as const : 'pending' as const
      })),
      ...recentDeals.map(deal => ({
        id: `deal_${deal.id}`,
        type: 'deal_created' as const,
        description: `New deal "${deal.title}" created at ${deal.venue.name}`,
        timestamp: deal.createdAt.toISOString(),
        status: deal.status === 'ACTIVE' ? 'success' as const : 'pending' as const
      })),
      ...recentRedemptions.map(redemption => ({
        id: `redemption_${redemption.id}`,
        type: 'redemption' as const,
        description: `Deal "${redemption.deal.title}" redeemed at ${redemption.deal.venue.name}`,
        timestamp: redemption.createdAt.toISOString(),
        status: redemption.status === 'USED' ? 'success' as const : 'pending' as const
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching owner activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
