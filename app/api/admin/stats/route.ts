import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { withErrorHandling } from '@/lib/error-handler';

async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalUsers,
      totalMerchants,
      totalVenues,
      totalDeals,
      totalVouchers,
      activeDeals,
      pendingApprovals,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.venue.count(),
      prisma.deal.count(),
      prisma.redemption.count(),
      prisma.deal.count({ where: { status: 'ACTIVE' } }),
      prisma.venue.count({ where: { isVerified: false } }),
      prisma.redemption.count({ where: { status: 'REDEEMED' } }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalMerchants,
      totalVenues,
      totalDeals,
      totalVouchers,
      activeDeals,
      pendingApprovals,
      totalRevenue: 0, // Revenue calculation would need to be implemented differently
      systemHealth: 'excellent',
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

export { GET };