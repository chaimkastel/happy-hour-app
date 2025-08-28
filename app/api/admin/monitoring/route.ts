import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Test all critical endpoints
    const endpointTests = [
      { name: 'Database Connection', url: 'internal', critical: true },
      { name: 'User Authentication', url: 'internal', critical: true },
      { name: 'Deal Management', url: 'internal', critical: true },
      { name: 'Merchant Portal', url: 'internal', critical: true }
    ];

    const testResults = [];
    
    // Test database connection
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbTime = Date.now() - dbStart;
      
      testResults.push({
        name: 'Database Connection',
        status: 'healthy',
        responseTime: dbTime,
        critical: true,
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      testResults.push({
        name: 'Database Connection',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        critical: true,
        lastChecked: new Date().toISOString()
      });
    }

    // Test user count
    try {
      const userCount = await prisma.user.count();
      testResults.push({
        name: 'User Data Access',
        status: 'healthy',
        responseTime: Date.now() - startTime,
        critical: true,
        data: { userCount },
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      testResults.push({
        name: 'User Data Access',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        critical: true,
        lastChecked: new Date().toISOString()
      });
    }

    // Test deal count
    try {
      const dealCount = await prisma.deal.count();
      testResults.push({
        name: 'Deal Data Access',
        status: 'healthy',
        responseTime: Date.now() - startTime,
        critical: true,
        data: { dealCount },
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      testResults.push({
        name: 'Deal Data Access',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        critical: true,
        lastChecked: new Date().toISOString()
      });
    }

    // Test merchant count
    try {
      const merchantCount = await prisma.merchant.count();
      testResults.push({
        name: 'Merchant Data Access',
        status: 'healthy',
        responseTime: Date.now() - startTime,
        critical: true,
        data: { merchantCount },
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      testResults.push({
        name: 'Merchant Data Access',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        critical: true,
        lastChecked: new Date().toISOString()
      });
    }

    // Calculate overall health
    const criticalTests = testResults.filter(test => test.critical);
    const healthyCritical = criticalTests.filter(test => test.status === 'healthy');
    const overallHealth = healthyCritical.length === criticalTests.length ? 'healthy' : 'degraded';

    // Get system performance metrics
    const performanceMetrics = {
      totalResponseTime: Date.now() - startTime,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      nodeVersion: process.version
    };

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      overallHealth,
      tests: testResults,
      performance: performanceMetrics,
      summary: {
        totalTests: testResults.length,
        healthyTests: testResults.filter(t => t.status === 'healthy').length,
        unhealthyTests: testResults.filter(t => t.status === 'unhealthy').length,
        criticalIssues: criticalTests.filter(t => t.status === 'unhealthy').length
      }
    });

  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      overallHealth: 'unhealthy'
    }, { status: 500 });
  }
}
