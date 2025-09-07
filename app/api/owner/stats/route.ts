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

    // Get platform statistics
    const [
      totalMerchants,
      totalVenues,
      totalDeals,
      totalRedemptions,
      activeDeals,
      pendingVerifications
    ] = await Promise.all([
      prisma.merchant.count(),
      prisma.venue.count(),
      prisma.deal.count(),
      prisma.redemption.count(),
      prisma.deal.count({
        where: {
          status: 'ACTIVE',
          endAt: {
            gt: new Date()
          }
        }
      }),
      prisma.merchant.count({
        where: {
          kycStatus: 'PENDING'
        }
      })
    ]);

    // Calculate total revenue (mock calculation)
    const totalRevenue = totalRedemptions * 2.50; // $2.50 per redemption

    // Determine platform health
    let platformHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (pendingVerifications > 10) {
      platformHealth = 'warning';
    }
    if (pendingVerifications > 25) {
      platformHealth = 'critical';
    }

    const stats = {
      totalMerchants,
      totalVenues,
      totalDeals,
      totalRedemptions,
      totalRevenue,
      activeDeals,
      pendingVerifications,
      platformHealth
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
