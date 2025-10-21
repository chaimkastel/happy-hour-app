import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
      activeDeals
    ] = await Promise.all([
      prisma.merchant.count(),
      prisma.venue.count(),
      prisma.deal.count(),
      prisma.deal.count({
        where: {
          endAt: {
            gt: new Date()
          }
        }
      })
    ]);

    // Calculate total revenue (mock calculation)
    const totalRevenue = totalDeals * 2.50; // $2.50 per deal

    // Determine platform health
    let platformHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (totalMerchants < 5) {
      platformHealth = 'warning';
    }
    if (totalMerchants < 2) {
      platformHealth = 'critical';
    }

    const stats = {
      totalMerchants,
      totalVenues,
      totalDeals,
      totalRedemptions: 0, // Placeholder since redemption model doesn't exist
      totalRevenue,
      activeDeals,
      pendingVerifications: 0, // Placeholder since kycStatus doesn't exist
      platformHealth
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}