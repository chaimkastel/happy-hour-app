import { NextRequest, NextResponse } from 'next/server';
import { healthChecker } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Run comprehensive health checks
    const checks = await healthChecker.runAllChecks();
    
    // Record current metrics
    healthChecker.recordMetrics();
    
    // Get recent alerts
    const alerts = healthChecker.getAlerts().slice(0, 10); // Last 10 alerts
    
    // Get system metrics
    const metrics = healthChecker.getMetrics().slice(0, 1)[0]; // Most recent metrics
    
    // Convert checks map to object for JSON response
    const checksObject = Object.fromEntries(checks);
    
    // Calculate overall status
    const overallStatus = healthChecker.getOverallStatus();
    
    const totalResponseTime = Date.now() - startTime;

    // Environment check
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV
    };

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      responseTime: totalResponseTime,
      overall: {
        status: overallStatus,
        message: getStatusMessage(overallStatus),
        lastUpdate: new Date().toISOString()
      },
      checks: checksObject,
      metrics: metrics || {
        timestamp: new Date(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: 0,
        activeConnections: 0,
        errorRate: 0,
        responseTime: totalResponseTime
      },
      environment: envStatus,
      alerts: alerts.map(alert => ({
        ...alert,
        timestamp: alert.timestamp.toISOString()
      })),
      summary: {
        totalChecks: checks.size,
        healthyChecks: Array.from(checks.values()).filter(c => c.status === 'healthy').length,
        warningChecks: Array.from(checks.values()).filter(c => c.status === 'warning').length,
        criticalChecks: Array.from(checks.values()).filter(c => c.status === 'critical').length,
        activeAlerts: alerts.filter(a => !a.resolved).length
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    // Generate alert for health check failure
    healthChecker.generateAlert('critical', 'Health Check Failed', 
      error instanceof Error ? error.message : 'Unknown error', 
      { timestamp: new Date(), error: String(error) }
    );
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      overall: {
        status: 'critical',
        message: 'System health check failed'
      }
    }, { status: 500 });
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'healthy':
      return 'All systems operational';
    case 'warning':
      return 'Some issues detected - monitoring required';
    case 'critical':
      return 'Critical issues detected - immediate attention required';
    default:
      return 'System status unknown';
  }
}
