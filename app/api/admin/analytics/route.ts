import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '24h';
    
    // Calculate time range
    const now = new Date();
    let startTime: Date;
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get user analytics
    const userAnalytics = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });

    // Get recent user registrations
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startTime
        }
      }
    });

    // Get merchant analytics
    const merchantAnalytics = await prisma.merchant.findMany({
      include: {
        _count: {
          select: {
            venues: true
          }
        }
      }
    });

    // Get deal analytics
    const dealAnalytics = await prisma.deal.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Get venue analytics
    const venueAnalytics = await prisma.venue.groupBy({
      by: ['businessType'],
      _count: {
        id: true
      }
    });

    // Calculate growth metrics
    const totalUsers = await prisma.user.count();
    const totalMerchants = await prisma.merchant.count();
    const totalVenues = await prisma.venue.count();
    const totalDeals = await prisma.deal.count();

    // Get active deals
    const activeDeals = await prisma.deal.count({
      where: {
        status: 'LIVE'
      }
    });

    // Get pending approvals
    const pendingDeals = await prisma.deal.count({
      where: {
        status: 'PENDING_APPROVAL'
      }
    });

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      timeRange,
      overview: {
        totalUsers,
        totalMerchants,
        totalVenues,
        totalDeals,
        activeDeals,
        pendingDeals,
        recentRegistrations: recentUsers
      },
      analytics: {
        users: userAnalytics,
        merchants: merchantAnalytics,
        deals: dealAnalytics,
        venues: venueAnalytics
      },
      growth: {
        newUsers: recentUsers,
        growthRate: totalUsers > 0 ? (recentUsers / totalUsers) * 100 : 0
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
