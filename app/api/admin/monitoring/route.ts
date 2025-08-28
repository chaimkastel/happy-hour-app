import { NextRequest, NextResponse } from 'next/server';
import { healthChecker } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '1h'; // 1h, 6h, 24h, 7d
    const includeMetrics = searchParams.get('includeMetrics') === 'true';
    const includeAlerts = searchParams.get('includeAlerts') === 'true';

    // Get current status
    const checks = await healthChecker.runAllChecks();
    const overallStatus = healthChecker.getOverallStatus();
    
    // Record metrics
    healthChecker.recordMetrics();

    const response: any = {
      timestamp: new Date().toISOString(),
      status: overallStatus,
      checks: Object.fromEntries(checks),
      summary: {
        totalChecks: checks.size,
        healthyChecks: Array.from(checks.values()).filter(c => c.status === 'healthy').length,
        warningChecks: Array.from(checks.values()).filter(c => c.status === 'warning').length,
        criticalChecks: Array.from(checks.values()).filter(c => c.status === 'critical').length,
      }
    };

    if (includeMetrics) {
      const allMetrics = healthChecker.getMetrics();
      const filteredMetrics = filterMetricsByTimeRange(allMetrics, timeRange);
      
      response.metrics = {
        current: allMetrics[0] || null,
        history: filteredMetrics,
        trends: calculateTrends(filteredMetrics)
      };
    }

    if (includeAlerts) {
      const allAlerts = healthChecker.getAlerts();
      const filteredAlerts = filterAlertsByTimeRange(allAlerts, timeRange);
      
      response.alerts = {
        recent: filteredAlerts.slice(0, 20),
        summary: {
          total: filteredAlerts.length,
          critical: filteredAlerts.filter(a => a.level === 'critical').length,
          warning: filteredAlerts.filter(a => a.level === 'warning').length,
          info: filteredAlerts.filter(a => a.level === 'info').length,
          unresolved: filteredAlerts.filter(a => !a.resolved).length
        }
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alertId } = body;

    if (action === 'resolve_alert' && alertId) {
      // In a real implementation, you'd persist alert resolutions
      // For now, just acknowledge the request
      console.log(`Alert ${alertId} marked as resolved`);
      
      return NextResponse.json({
        success: true,
        message: 'Alert resolved successfully'
      });
    }

    if (action === 'run_check') {
      const checks = await healthChecker.runAllChecks();
      return NextResponse.json({
        success: true,
        checks: Object.fromEntries(checks),
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Monitoring API POST error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function filterMetricsByTimeRange(metrics: any[], timeRange: string) {
  const now = new Date();
  let cutoffTime: Date;

  switch (timeRange) {
    case '1h':
      cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '6h':
      cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      break;
    case '24h':
      cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
  }

  return metrics.filter(metric => new Date(metric.timestamp) >= cutoffTime);
}

function filterAlertsByTimeRange(alerts: any[], timeRange: string) {
  const now = new Date();
  let cutoffTime: Date;

  switch (timeRange) {
    case '1h':
      cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '6h':
      cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      break;
    case '24h':
      cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
  }

  return alerts.filter(alert => new Date(alert.timestamp) >= cutoffTime);
}

function calculateTrends(metrics: any[]) {
  if (metrics.length < 2) return null;

  const recent = metrics.slice(0, Math.min(10, metrics.length));
  const older = metrics.slice(Math.min(10, metrics.length), Math.min(20, metrics.length));

  if (older.length === 0) return null;

  const recentAvg = {
    memoryUsage: recent.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) / recent.length,
    responseTime: recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length,
    errorRate: recent.reduce((sum, m) => sum + m.errorRate, 0) / recent.length
  };

  const olderAvg = {
    memoryUsage: older.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) / older.length,
    responseTime: older.reduce((sum, m) => sum + m.responseTime, 0) / older.length,
    errorRate: older.reduce((sum, m) => sum + m.errorRate, 0) / older.length
  };

  return {
    memoryUsage: {
      trend: recentAvg.memoryUsage > olderAvg.memoryUsage ? 'increasing' : 'decreasing',
      change: ((recentAvg.memoryUsage - olderAvg.memoryUsage) / olderAvg.memoryUsage) * 100
    },
    responseTime: {
      trend: recentAvg.responseTime > olderAvg.responseTime ? 'increasing' : 'decreasing',
      change: ((recentAvg.responseTime - olderAvg.responseTime) / olderAvg.responseTime) * 100
    },
    errorRate: {
      trend: recentAvg.errorRate > olderAvg.errorRate ? 'increasing' : 'decreasing',
      change: ((recentAvg.errorRate - olderAvg.errorRate) / (olderAvg.errorRate || 1)) * 100
    }
  };
}