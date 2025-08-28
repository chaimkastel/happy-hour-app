import { prisma } from './db'
import { z } from 'zod'

// Types for monitoring
export interface HealthCheck {
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  responseTime: number
  error?: string
  details?: Record<string, any>
  lastCheck: Date
}

export interface SystemMetrics {
  timestamp: Date
  uptime: number
  memoryUsage: NodeJS.MemoryUsage
  cpuUsage: number
  activeConnections: number
  errorRate: number
  responseTime: number
}

export interface Alert {
  id: string
  level: 'info' | 'warning' | 'critical'
  title: string
  message: string
  timestamp: Date
  resolved: boolean
  metadata?: Record<string, any>
}

// Health check functions
export class HealthChecker {
  private checks: Map<string, HealthCheck> = new Map()
  private alerts: Alert[] = []
  private metrics: SystemMetrics[] = []
  private readonly maxMetricsHistory = 1000

  async runAllChecks(): Promise<Map<string, HealthCheck>> {
    const checkPromises = [
      this.checkDatabase(),
      this.checkApi(),
      this.checkDiskSpace(),
      this.checkMemory(),
      this.checkCriticalEndpoints(),
      this.checkBusinessLogic(),
      this.checkExternalServices()
    ]

    try {
      await Promise.allSettled(checkPromises)
    } catch (error) {
      console.error('Error running health checks:', error)
    }

    return this.checks
  }

  private async timeFunction<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> {
    const start = Date.now()
    const result = await fn()
    const time = Date.now() - start
    return { result, time }
  }

  private updateCheck(name: string, status: HealthCheck['status'], responseTime: number, error?: string, details?: Record<string, any>) {
    const check: HealthCheck = {
      name,
      status,
      responseTime,
      error,
      details,
      lastCheck: new Date()
    }
    this.checks.set(name, check)

    // Generate alert if critical
    if (status === 'critical' || status === 'warning') {
      this.generateAlert(status, `${name} Health Check`, error || `${name} is ${status}`, { check })
    }
  }

  async checkDatabase(): Promise<void> {
    try {
      const { time } = await this.timeFunction(async () => {
        // Test basic connectivity
        await prisma.$queryRaw`SELECT 1`
        
        // Test transaction capability
        await prisma.$transaction(async (tx) => {
          await tx.user.findFirst()
        })

        // Check database stats
        const stats = await Promise.all([
          prisma.user.count(),
          prisma.merchant.count(),
          prisma.venue.count(),
          prisma.deal.count(),
          prisma.redemption.count()
        ])

        return { stats }
      })

      let status: HealthCheck['status'] = 'healthy'
      if (time > 1000) status = 'warning'
      if (time > 5000) status = 'critical'

      this.updateCheck('database', status, time, undefined, { responseTime: time })
    } catch (error) {
      this.updateCheck('database', 'critical', 0, error instanceof Error ? error.message : 'Database connection failed')
    }
  }

  async checkApi(): Promise<void> {
    const endpoints = [
      '/api/admin/health',
      '/api/deals/search',
      '/api/merchant/settings'
    ]

    for (const endpoint of endpoints) {
      try {
        const { time } = await this.timeFunction(async () => {
          const response = await fetch(`${process.env.NEXTAUTH_URL}${endpoint}`, {
            method: 'GET',
            headers: { 'User-Agent': 'HealthCheck/1.0' }
          })
          if (!response.ok && response.status !== 401) {
            throw new Error(`HTTP ${response.status}`)
          }
          return response
        })

        let status: HealthCheck['status'] = 'healthy'
        if (time > 2000) status = 'warning'
        if (time > 10000) status = 'critical'

        this.updateCheck(`api-${endpoint.replace(/\//g, '-')}`, status, time)
      } catch (error) {
        this.updateCheck(`api-${endpoint.replace(/\//g, '-')}`, 'critical', 0, error instanceof Error ? error.message : 'API endpoint failed')
      }
    }
  }

  async checkMemory(): Promise<void> {
    try {
      const memUsage = process.memoryUsage()
      const totalMem = memUsage.heapTotal
      const usedMem = memUsage.heapUsed
      const memPercent = (usedMem / totalMem) * 100

      let status: HealthCheck['status'] = 'healthy'
      if (memPercent > 80) status = 'warning'
      if (memPercent > 95) status = 'critical'

      this.updateCheck('memory', status, 0, undefined, {
        usedPercent: memPercent,
        heapUsed: usedMem,
        heapTotal: totalMem,
        external: memUsage.external,
        rss: memUsage.rss
      })
    } catch (error) {
      this.updateCheck('memory', 'critical', 0, error instanceof Error ? error.message : 'Memory check failed')
    }
  }

  async checkDiskSpace(): Promise<void> {
    try {
      // Note: This is a simplified check. In production, you'd use fs.stat or similar
      const stats = await prisma.$queryRaw`SELECT pg_database_size(current_database()) as size`
      
      this.updateCheck('disk', 'healthy', 0, undefined, { dbSize: stats })
    } catch (error) {
      this.updateCheck('disk', 'warning', 0, error instanceof Error ? error.message : 'Disk check failed')
    }
  }

  async checkCriticalEndpoints(): Promise<void> {
    try {
      // Test critical business logic endpoints
      const criticalChecks = await Promise.allSettled([
        // Check user authentication flow
        this.testAuthFlow(),
        // Check deal creation capability
        this.testDealCreation(),
        // Check payment processing
        this.testPaymentFlow()
      ])

      const failures = criticalChecks.filter(result => result.status === 'rejected').length
      const status = failures === 0 ? 'healthy' : failures < 2 ? 'warning' : 'critical'

      this.updateCheck('critical-endpoints', status, 0, undefined, { 
        totalChecks: criticalChecks.length, 
        failures,
        details: criticalChecks
      })
    } catch (error) {
      this.updateCheck('critical-endpoints', 'critical', 0, error instanceof Error ? error.message : 'Critical endpoint check failed')
    }
  }

  async checkBusinessLogic(): Promise<void> {
    try {
      // Verify key business logic constraints
      const issues = []

      // Check for deals without venues
      const orphanedDeals = await prisma.deal.count({
        where: { venue: null }
      })
      if (orphanedDeals > 0) issues.push(`${orphanedDeals} orphaned deals`)

      // Check for expired deals still showing as LIVE
      const expiredLiveDeals = await prisma.deal.count({
        where: {
          status: 'LIVE',
          endAt: { lt: new Date() }
        }
      })
      if (expiredLiveDeals > 0) issues.push(`${expiredLiveDeals} expired live deals`)

      // Check for venues without merchants
      const orphanedVenues = await prisma.venue.count({
        where: { merchant: null }
      })
      if (orphanedVenues > 0) issues.push(`${orphanedVenues} orphaned venues`)

      const status = issues.length === 0 ? 'healthy' : issues.length < 3 ? 'warning' : 'critical'
      this.updateCheck('business-logic', status, 0, issues.length > 0 ? issues.join(', ') : undefined, { issues })
    } catch (error) {
      this.updateCheck('business-logic', 'critical', 0, error instanceof Error ? error.message : 'Business logic check failed')
    }
  }

  async checkExternalServices(): Promise<void> {
    // Check external service dependencies
    const services = []

    try {
      // Check if we can resolve DNS
      const dnsCheck = await fetch('https://www.google.com', { signal: AbortSignal.timeout(5000) })
      services.push({ name: 'DNS/Internet', status: dnsCheck.ok ? 'healthy' : 'warning' })
    } catch (error) {
      services.push({ name: 'DNS/Internet', status: 'critical' })
    }

    const overallStatus = services.every(s => s.status === 'healthy') ? 'healthy' : 
                         services.some(s => s.status === 'critical') ? 'critical' : 'warning'

    this.updateCheck('external-services', overallStatus, 0, undefined, { services })
  }

  private async testAuthFlow(): Promise<void> {
    // Test authentication without actually creating sessions
    const testUser = await prisma.user.findFirst()
    if (!testUser) throw new Error('No test users available')
  }

  private async testDealCreation(): Promise<void> {
    // Test that we can create deals (without actually creating them)
    const merchant = await prisma.merchant.findFirst({ include: { venues: true } })
    if (!merchant || merchant.venues.length === 0) {
      throw new Error('No merchants with venues available for testing')
    }
  }

  private async testPaymentFlow(): Promise<void> {
    // Test payment processing capability
    const redemptions = await prisma.redemption.findFirst()
    // Just verify the table exists and is accessible
  }

  generateAlert(level: Alert['level'], title: string, message: string, metadata?: Record<string, any>): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      title,
      message,
      timestamp: new Date(),
      resolved: false,
      metadata
    }

    this.alerts.unshift(alert)
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100)
    }

    console.log(`🚨 ALERT [${level.toUpperCase()}]: ${title} - ${message}`)
  }

  getAlerts(): Alert[] {
    return this.alerts
  }

  getChecks(): Map<string, HealthCheck> {
    return this.checks
  }

  getMetrics(): SystemMetrics[] {
    return this.metrics
  }

  recordMetrics(): void {
    const memUsage = process.memoryUsage()
    const metrics: SystemMetrics = {
      timestamp: new Date(),
      uptime: process.uptime(),
      memoryUsage: memUsage,
      cpuUsage: 0, // Would need external library for real CPU usage
      activeConnections: 0, // Would track active DB/HTTP connections
      errorRate: this.calculateErrorRate(),
      responseTime: this.calculateAverageResponseTime()
    }

    this.metrics.unshift(metrics)
    
    // Keep only last 1000 metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(0, this.maxMetricsHistory)
    }
  }

  private calculateErrorRate(): number {
    const recentChecks = Array.from(this.checks.values())
    const errorCount = recentChecks.filter(check => check.status === 'critical').length
    return recentChecks.length > 0 ? (errorCount / recentChecks.length) * 100 : 0
  }

  private calculateAverageResponseTime(): number {
    const recentChecks = Array.from(this.checks.values())
    const totalTime = recentChecks.reduce((sum, check) => sum + check.responseTime, 0)
    return recentChecks.length > 0 ? totalTime / recentChecks.length : 0
  }

  getOverallStatus(): 'healthy' | 'warning' | 'critical' {
    const checks = Array.from(this.checks.values())
    
    if (checks.some(check => check.status === 'critical')) {
      return 'critical'
    }
    
    if (checks.some(check => check.status === 'warning')) {
      return 'warning'
    }
    
    return 'healthy'
  }
}

// Singleton instance
export const healthChecker = new HealthChecker()