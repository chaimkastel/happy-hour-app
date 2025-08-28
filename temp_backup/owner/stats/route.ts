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

// Force dynamic rendering for stats API
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check here
    // For now, allow any authenticated user to access owner stats

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
      prisma.deal.count({ where: { status: 'LIVE' } }),
      prisma.venue.count({ where: { isVerified: false } })
    ]);

    // Calculate total revenue (simplified - would be more complex in real app)
    const totalRevenue = totalRedemptions * 2.50; // $2.50 per redemption

    // Determine platform health based on various metrics
    let platformHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (pendingVerifications > 10) {
      platformHealth = 'warning';
    }
    
    if (pendingVerifications > 20 || totalRedemptions === 0) {
      platformHealth = 'critical';
    }

    return NextResponse.json({
      totalMerchants,
      totalVenues,
      totalDeals,
      totalRedemptions,
      totalRevenue,
      activeDeals,
      pendingVerifications,
      platformHealth
    });
  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
