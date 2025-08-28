import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Test database connection
    let dbStatus = 'healthy';
    let dbResponseTime = 0;
    let dbError = null;
    
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'unhealthy';
      dbError = error instanceof Error ? error.message : 'Unknown database error';
    }

    // Test environment variables
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV
    };

    // Get system metrics
    const systemMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    };

    // Get database stats
    let dbStats = null;
    if (dbStatus === 'healthy') {
      try {
        const [userCount, merchantCount, venueCount, dealCount] = await Promise.all([
          prisma.user.count(),
          prisma.merchant.count(),
          prisma.venue.count(),
          prisma.deal.count()
        ]);

        dbStats = {
          users: userCount,
          merchants: merchantCount,
          venues: venueCount,
          deals: dealCount,
          totalRecords: userCount + merchantCount + venueCount + dealCount
        };
      } catch (error) {
        console.error('Error fetching database stats:', error);
      }
    }

    const totalResponseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      responseTime: totalResponseTime,
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
        error: dbError,
        stats: dbStats
      },
      environment: envStatus,
      system: systemMetrics,
      overall: {
        status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
        message: dbStatus === 'healthy' ? 'All systems operational' : 'Database issues detected'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      overall: {
        status: 'unhealthy',
        message: 'System health check failed'
      }
    }, { status: 500 });
  }
}
