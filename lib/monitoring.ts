import { prisma } from './db';

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(operation: string): () => void {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.recordMetric(operation, duration);
    };
  }

  recordMetric(operation: string, value: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(value);
  }

  getMetrics(operation: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  } | null {
    const values = this.metrics.get(operation);
    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const average = values.reduce((sum, val) => sum + val, 0) / count;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);

    return {
      count,
      average,
      min,
      max,
      p95: sorted[p95Index],
      p99: sorted[p99Index],
    };
  }

  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [operation, values] of this.metrics.entries()) {
      result[operation] = this.getMetrics(operation);
    }
    return result;
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

// Error tracking
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Array<{
    timestamp: Date;
    error: Error;
    context: Record<string, any>;
    userId?: string;
  }> = [];

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  trackError(error: Error, context: Record<string, any> = {}, userId?: string) {
    const errorEntry = {
      timestamp: new Date(),
      error,
      context,
      userId,
    };

    this.errors.push(errorEntry);

    // Keep only last 1000 errors
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', errorEntry);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorEntry);
    }
  }

  private async sendToExternalService(errorEntry: any) {
    try {
      // In a real implementation, you'd send to Sentry, LogRocket, etc.
      console.log('Sending error to external service:', errorEntry);
    } catch (err) {
      console.error('Failed to send error to external service:', err);
    }
  }

  getErrors(limit: number = 100): any[] {
    return this.errors.slice(-limit);
  }

  getErrorCount(): number {
    return this.errors.length;
  }
}

// Usage tracking
export class UsageTracker {
  private static instance: UsageTracker;
  private usage: Map<string, number> = new Map();

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  trackUsage(feature: string, count: number = 1) {
    const current = this.usage.get(feature) || 0;
    this.usage.set(feature, current + count);
  }

  getUsage(feature: string): number {
    return this.usage.get(feature) || 0;
  }

  getAllUsage(): Record<string, number> {
    return Object.fromEntries(this.usage.entries());
  }

  clearUsage() {
    this.usage.clear();
  }
}

// System health monitoring
export class SystemHealthMonitor {
  private static instance: SystemHealthMonitor;
  private healthChecks: Map<string, () => Promise<boolean>> = new Map();

  static getInstance(): SystemHealthMonitor {
    if (!SystemHealthMonitor.instance) {
      SystemHealthMonitor.instance = new SystemHealthMonitor();
    }
    return SystemHealthMonitor.instance;
  }

  addHealthCheck(name: string, check: () => Promise<boolean>) {
    this.healthChecks.set(name, check);
  }

  async runHealthChecks(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [name, check] of this.healthChecks.entries()) {
      try {
        results[name] = await check();
      } catch (error) {
        console.error(`Health check ${name} failed:`, error);
        results[name] = false;
      }
    }
    
    return results;
  }

  async getOverallHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    timestamp: Date;
  }> {
    const checks = await this.runHealthChecks();
    const allHealthy = Object.values(checks).every(check => check);
    const someHealthy = Object.values(checks).some(check => check);
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (allHealthy) {
      status = 'healthy';
    } else if (someHealthy) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      checks,
      timestamp: new Date(),
    };
  }
}

// Database monitoring
export class DatabaseMonitor {
  private static instance: DatabaseMonitor;
  private connectionCount: number = 0;
  private queryCount: number = 0;
  private errorCount: number = 0;

  static getInstance(): DatabaseMonitor {
    if (!DatabaseMonitor.instance) {
      DatabaseMonitor.instance = new DatabaseMonitor();
    }
    return DatabaseMonitor.instance;
  }

  incrementConnectionCount() {
    this.connectionCount++;
  }

  incrementQueryCount() {
    this.queryCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }

  getStats(): {
    connectionCount: number;
    queryCount: number;
    errorCount: number;
    errorRate: number;
  } {
    return {
      connectionCount: this.connectionCount,
      queryCount: this.queryCount,
      errorCount: this.errorCount,
      errorRate: this.queryCount > 0 ? this.errorCount / this.queryCount : 0,
    };
  }

  reset() {
    this.connectionCount = 0;
    this.queryCount = 0;
    this.errorCount = 0;
  }
}

// API monitoring
export class APIMonitor {
  private static instance: APIMonitor;
  private requests: Map<string, number> = new Map();
  private responseTimes: Map<string, number[]> = new Map();
  private errorCounts: Map<string, number> = new Map();

  static getInstance(): APIMonitor {
    if (!APIMonitor.instance) {
      APIMonitor.instance = new APIMonitor();
    }
    return APIMonitor.instance;
  }

  trackRequest(endpoint: string, method: string, responseTime: number, statusCode: number) {
    const key = `${method} ${endpoint}`;
    
    // Track request count
    const currentCount = this.requests.get(key) || 0;
    this.requests.set(key, currentCount + 1);
    
    // Track response time
    if (!this.responseTimes.has(key)) {
      this.responseTimes.set(key, []);
    }
    this.responseTimes.get(key)!.push(responseTime);
    
    // Track error count
    if (statusCode >= 400) {
      const currentErrors = this.errorCounts.get(key) || 0;
      this.errorCounts.set(key, currentErrors + 1);
    }
  }

  getStats(endpoint?: string): Record<string, any> {
    if (endpoint) {
      const key = endpoint;
      const requests = this.requests.get(key) || 0;
      const responseTimes = this.responseTimes.get(key) || [];
      const errors = this.errorCounts.get(key) || 0;
      
      return {
        requests,
        errors,
        errorRate: requests > 0 ? errors / requests : 0,
        averageResponseTime: responseTimes.length > 0 
          ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
          : 0,
        p95ResponseTime: responseTimes.length > 0 
          ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)]
          : 0,
      };
    }
    
    const allStats: Record<string, any> = {};
    for (const [key, requests] of this.requests.entries()) {
      allStats[key] = this.getStats(key);
    }
    return allStats;
  }

  clearStats() {
    this.requests.clear();
    this.responseTimes.clear();
    this.errorCounts.clear();
  }
}

// Initialize monitoring
export function initializeMonitoring() {
  const healthMonitor = SystemHealthMonitor.getInstance();
  
  // Add database health check
  healthMonitor.addHealthCheck('database', async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  });
  
  // Add Redis health check
  healthMonitor.addHealthCheck('redis', async () => {
    try {
      // Add Redis health check logic here
      return true;
    } catch (error) {
      return false;
    }
  });
  
  // Add external API health checks
  healthMonitor.addHealthCheck('stripe', async () => {
    try {
      // Add Stripe health check logic here
      return !!process.env.STRIPE_SECRET_KEY;
    } catch (error) {
      return false;
    }
  });
  
  return healthMonitor;
}

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance();
export const errorTracker = ErrorTracker.getInstance();
export const usageTracker = UsageTracker.getInstance();
export const systemHealthMonitor = SystemHealthMonitor.getInstance();
export const databaseMonitor = DatabaseMonitor.getInstance();
export const apiMonitor = APIMonitor.getInstance();
