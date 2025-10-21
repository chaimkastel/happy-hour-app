import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Calculate total stats
    const totalUsers = await db.user.count({ where: { role: 'USER' } });
    const totalMerchants = await db.merchant.count();
    const totalDeals = await db.deal.count();
    const totalVouchers = await db.redemption.count();
    const totalFavorites = await db.favorite.count();

    // Recent activity (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUsers = await db.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: last24Hours }
      }
    });
    const recentVouchers = await db.redemption.count({
      where: { createdAt: { gte: last24Hours } }
    });

    // Get deal performance by venue
    const dealPerformance = await db.deal.findMany({
      include: {
        venue: {
          select: { name: true, address: true }
        },
        _count: {
          select: { vouchers: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Get merchant analytics
    const merchantStats = await db.merchant.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, createdAt: true }
        },
        venues: {
          include: {
            deals: {
              include: {
                _count: {
                  select: { vouchers: true }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalMerchants,
        totalDeals,
        totalVouchers,
        totalFavorites,
        recentUsers,
        recentVouchers
      },
      dealAnalytics: {
        recentDeals: dealPerformance.slice(0, 10),
        dealPerformance: dealPerformance.map(deal => ({
          id: deal.id,
          title: deal.title,
          venue: deal.venue.name,
          venueAddress: deal.venue.address,
          vouchers: deal._count.vouchers,
          status: deal.active ? 'active' : 'inactive'
        }))
      },
      merchantAnalytics: merchantStats.map(merchant => ({
        id: merchant.id,
        companyName: merchant.companyName,
        contactEmail: merchant.contactEmail,
        venueCount: merchant.venues.length,
        totalDeals: merchant.venues.reduce((sum, venue) => sum + venue.deals.length, 0),
        totalVouchers: merchant.venues.reduce((sum, venue) => 
          sum + venue.deals.reduce((dealSum, deal) => dealSum + deal._count.vouchers, 0), 0
        ),
        subscriptionStatus: merchant.subscriptionStatus,
        approved: merchant.approved
      }))
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}