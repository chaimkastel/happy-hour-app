import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const startDate = new Date();
    
    // Calculate start date based on period
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const [
      userStats,
      merchantStats,
      dealStats,
      voucherStats,
      revenueStats,
      topVenues,
      topDeals,
      userGrowth,
      dealGrowth,
    ] = await Promise.all([
      // User statistics
      prisma.user.aggregate({
        _count: { id: true },
        where: { createdAt: { gte: startDate } },
      }),
      
      // Merchant statistics
      prisma.merchant.aggregate({
        _count: { id: true },
        where: { createdAt: { gte: startDate } },
      }),
      
      // Deal statistics
      prisma.deal.aggregate({
        _count: { id: true },
        _avg: { percentOff: true },
        where: { createdAt: { gte: startDate } },
      }),
      
      // Voucher statistics
      prisma.redemption.count({
        where: { createdAt: { gte: startDate } },
      }),
      
      // Revenue statistics (placeholder - would need to calculate from deals)
      prisma.redemption.count({
        where: { 
          status: 'REDEEMED',
          updatedAt: { gte: startDate },
        },
      }),
      
      // Top venues by deal count
      prisma.venue.findMany({
        take: 10,
        orderBy: { deals: { _count: 'desc' } },
        include: {
          _count: {
            select: {
              deals: true,
            },
          },
          merchant: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      
      // Top deals by favorites count
      prisma.deal.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              redemptions: true,
            },
          },
          venue: {
            select: {
              name: true,
              address: true,
            },
          },
        },
      }),
      
      // User growth over time
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "User"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      
      // Deal growth over time
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "Deal"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ]);

    return NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      summary: {
        users: userStats._count.id,
        merchants: merchantStats._count.id,
        deals: dealStats._count.id,
        vouchers: voucherStats,
        averageDiscount: dealStats._avg.percentOff || 0,
        totalRevenue: 0, // Would need to calculate from deals
        totalSavings: 0, // Would need to calculate from deals
      },
      topVenues: topVenues.map(venue => ({
        id: venue.id,
        name: venue.name,
        city: venue.address, // Using address since city field doesn't exist
        state: 'Unknown', // Using placeholder since state field doesn't exist
        dealsCount: venue._count.deals,
        merchant: venue.merchant.user,
      })),
      topDeals: topDeals.map(deal => ({
        id: deal.id,
        title: deal.title,
        percentOff: deal.percentOff,
        vouchersCount: deal._count.redemptions,
        favoritesCount: 0, // Simplified for now
        venue: deal.venue,
      })),
      growth: {
        users: userGrowth,
        deals: dealGrowth,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
