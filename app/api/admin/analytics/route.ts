import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get user location analytics
    const userLocations = await prisma.user.findMany({
      where: {
        role: 'USER',
        location: { not: null }
      },
      select: {
        location: true,
        createdAt: true
      }
    });

    // Process location data
    const locationStats = userLocations.reduce((acc, user) => {
      if (user.location) {
        const location = user.location;
        if (!acc[location]) {
          acc[location] = { count: 0, recent: 0 };
        }
        acc[location].count++;
        
        // Count recent users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (user.createdAt > thirtyDaysAgo) {
          acc[location].recent++;
        }
      }
      return acc;
    }, {} as Record<string, { count: number; recent: number }>);

    // Get redemption analytics by location
    const redemptionsWithLocation = await prisma.redemption.findMany({
      include: {
        user: {
          select: { location: true }
        },
        deal: {
          include: {
            venue: {
              select: { name: true, address: true }
            }
          }
        }
      },
      orderBy: { redeemedAt: 'desc' },
      take: 50
    });

    // Get deal performance by venue
    const dealPerformance = await prisma.deal.findMany({
      include: {
        venue: {
          select: { name: true, address: true }
        },
        _count: {
          select: { redemptions: true, favorites: true }
        }
      }
    });

    // Get user growth over time
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        role: 'USER',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get merchant analytics
    const merchantStats = await prisma.merchant.findMany({
      include: {
        user: {
          select: { location: true, createdAt: true }
        },
        venues: {
          include: {
            deals: {
              include: {
                _count: {
                  select: { redemptions: true, favorites: true }
                }
              }
            }
          }
        }
      }
    });

    // Calculate total stats
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    const totalMerchants = await prisma.merchant.count();
    const totalDeals = await prisma.deal.count();
    const totalRedemptions = await prisma.redemption.count();
    const totalFavorites = await prisma.favorite.count();

    // Recent activity (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUsers = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: last24Hours }
      }
    });
    const recentRedemptions = await prisma.redemption.count({
      where: { redeemedAt: { gte: last24Hours } }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalMerchants,
        totalDeals,
        totalRedemptions,
        totalFavorites,
        recentUsers,
        recentRedemptions
      },
      locationAnalytics: {
        userLocations: locationStats,
        topLocations: Object.entries(locationStats)
          .sort(([,a], [,b]) => b.count - a.count)
          .slice(0, 10)
          .map(([location, stats]) => ({ location, ...stats }))
      },
      redemptionAnalytics: {
        recentRedemptions: redemptionsWithLocation.slice(0, 20),
        dealPerformance: dealPerformance.map(deal => ({
          id: deal.id,
          title: deal.title,
          venue: deal.venue.name,
          venueAddress: deal.venue.address,
          redemptions: deal._count.redemptions,
          favorites: deal._count.favorites,
          status: deal.status
        }))
      },
      merchantAnalytics: merchantStats.map(merchant => ({
        id: merchant.id,
        businessName: merchant.businessName,
        location: merchant.user.location,
        venueCount: merchant.venues.length,
        totalDeals: merchant.venues.reduce((sum, venue) => sum + venue.deals.length, 0),
        totalRedemptions: merchant.venues.reduce((sum, venue) => 
          sum + venue.deals.reduce((dealSum, deal) => dealSum + deal._count.redemptions, 0), 0
        ),
        kycStatus: merchant.kycStatus
      })),
      userGrowth: userGrowth.map(day => ({
        date: day.createdAt.toISOString().split('T')[0],
        count: day._count.id
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