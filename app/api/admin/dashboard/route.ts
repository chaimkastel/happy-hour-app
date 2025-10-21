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

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get dashboard stats
    const [
      totalUsers,
      totalMerchants,
      totalVenues,
      totalDeals,
      totalVouchers,
      activeDeals,
      pendingMerchants,
      recentVouchers
    ] = await Promise.all([
      db.user.count(),
      db.merchant.count(),
      db.venue.count(),
      db.deal.count(),
      db.redemption.count(),
      db.deal.count({ where: { status: 'ACTIVE' } }),
      db.merchant.count({ where: { kycStatus: 'PENDING' } }),
      db.redemption.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          deal: {
            include: {
              venue: true
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })
    ]);

    const stats = {
      totalUsers,
      totalMerchants,
      totalVenues,
      totalDeals,
      totalVouchers,
      activeDeals,
      pendingMerchants,
      redemptionRate: totalVouchers > 0 ? (await db.redemption.count({ where: { status: 'REDEEMED' } })) / totalVouchers : 0
    };

    return NextResponse.json({ stats, recentVouchers });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
