import { prisma } from './db'
import { healthChecker } from './monitoring'

export interface ErrorLog {
  id: string
  timestamp: Date
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  context?: Record<string, any>
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
  resolved: boolean
  tags: string[]
}

export interface ErrorPattern {
  pattern: string
  count: number
  lastOccurrence: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class ErrorTracker {
  private errors: ErrorLog[] = []
  private patterns: Map<string, ErrorPattern> = new Map()
  private readonly maxErrors = 1000
  private readonly patternThresholds = {
    low: 5,
    medium: 15,
    high: 30,
    critical: 50
  }

  async logError(
    level: ErrorLog['level'],
    message: string,
    error?: Error,
    context?: Record<string, any>,
    userInfo?: { userId?: string; sessionId?: string; url?: string; userAgent?: string }
  ): Promise<string> {
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      stack: error?.stack,
      context: context || {},
      userId: userInfo?.userId,
      sessionId: userInfo?.sessionId,
      url: userInfo?.url,
      userAgent: userInfo?.userAgent,
      resolved: false,
      tags: this.generateTags(message, error, context)
    }

    // Store error
    this.errors.unshift(errorLog)
    
    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // Update error patterns
    this.updatePatterns(errorLog)

    // Log to console for immediate visibility
    this.logToConsole(errorLog)

    // Try to persist to database (non-blocking)
    this.persistError(errorLog).catch(dbError => {
      console.error('Failed to persist error to database:', dbError)
    })

    // Generate alerts for critical errors
    if (level === 'error' || this.isPatternCritical(message)) {
      healthChecker.generateAlert(
        level === 'error' ? 'critical' : 'warning',
        'Application Error',
        message,
        { errorId: errorLog.id, context }
      )
    }

    return errorLog.id
  }

  private generateTags(message: string, error?: Error, context?: Record<string, any>): string[] {
    const tags: string[] = []

    // Add tags based on error message
    if (message.toLowerCase().includes('database')) tags.push('database')
    if (message.toLowerCase().includes('auth')) tags.push('authentication')
    if (message.toLowerCase().includes('payment')) tags.push('payment')
    if (message.toLowerCase().includes('api')) tags.push('api')
    if (message.toLowerCase().includes('network')) tags.push('network')
    if (message.toLowerCase().includes('validation')) tags.push('validation')

    // Add tags based on error type
    if (error) {
      if (error.name === 'PrismaClientKnownRequestError') tags.push('database', 'prisma')
      if (error.name === 'ValidationError') tags.push('validation')
      if (error.name === 'TypeError') tags.push('type-error')
      if (error.name === 'ReferenceError') tags.push('reference-error')
    }

    // Add tags based on context
    if (context) {
      if (context.userId) tags.push('user-specific')
      if (context.merchantId) tags.push('merchant-specific')
      if (context.endpoint) tags.push('endpoint-error')
    }

    return tags
  }

  private updatePatterns(errorLog: ErrorLog): void {
    // Extract pattern from error message (simplified)
    const pattern = this.extractPattern(errorLog.message)
    
    const existing = this.patterns.get(pattern)
    if (existing) {
      existing.count++
      existing.lastOccurrence = errorLog.timestamp
      existing.severity = this.calculateSeverity(existing.count)
    } else {
      this.patterns.set(pattern, {
        pattern,
        count: 1,
        lastOccurrence: errorLog.timestamp,
        severity: 'low'
      })
    }
  }

  private extractPattern(message: string): string {
    // Remove specific IDs, numbers, and variable parts to create patterns
    return message
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '<UUID>')
      .replace(/\b\d+\b/g, '<NUMBER>')
      .replace(/['"][^'"]*['"]/g, '<STRING>')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private calculateSeverity(count: number): ErrorPattern['severity'] {
    if (count >= this.patternThresholds.critical) return 'critical'
    if (count >= this.patternThresholds.high) return 'high'
    if (count >= this.patternThresholds.medium) return 'medium'
    return 'low'
  }

  private isPatternCritical(message: string): boolean {
    const pattern = this.extractPattern(message)
    const existing = this.patterns.get(pattern)
    return existing?.severity === 'critical' || false
  }

  private logToConsole(errorLog: ErrorLog): void {
    const emoji = errorLog.level === 'error' ? '❌' : errorLog.level === 'warning' ? '⚠️' : 'ℹ️'
    const timestamp = errorLog.timestamp.toISOString()
    
    console.log(`${emoji} [${timestamp}] [${errorLog.level.toUpperCase()}] ${errorLog.message}`)
    
    if (errorLog.stack) {
      console.log(`Stack: ${errorLog.stack}`)
    }
    
    if (errorLog.context && Object.keys(errorLog.context).length > 0) {
      console.log(`Context: ${JSON.stringify(errorLog.context, null, 2)}`)
    }
  }

  private async persistError(errorLog: ErrorLog): Promise<void> {
    try {
      await prisma.errorLog.create({
        data: {
          id: errorLog.id,
          level: errorLog.level,
          message: errorLog.message,
          stack: errorLog.stack,
          context: errorLog.context ? JSON.stringify(errorLog.context) : null,
          userId: errorLog.userId,
          sessionId: errorLog.sessionId,
          url: errorLog.url,
          userAgent: errorLog.userAgent,
          resolved: errorLog.resolved,
          tags: JSON.stringify(errorLog.tags),
          createdAt: errorLog.timestamp
        }
      })
    } catch (error) {
      // Don't throw here to avoid infinite loops
      console.error('Database error while persisting error log:', error)
    }
  }

  getErrors(options: {
    level?: ErrorLog['level']
    limit?: number
    offset?: number
    tags?: string[]
    resolved?: boolean
    timeRange?: { start: Date; end: Date }
  } = {}): ErrorLog[] {
    let filtered = [...this.errors]

    if (options.level) {
      filtered = filtered.filter(error => error.level === options.level)
    }

    if (options.tags) {
      filtered = filtered.filter(error => 
        options.tags!.some(tag => error.tags.includes(tag))
      )
    }

    if (options.resolved !== undefined) {
      filtered = filtered.filter(error => error.resolved === options.resolved)
    }

    if (options.timeRange) {
      filtered = filtered.filter(error =>
        error.timestamp >= options.timeRange!.start &&
        error.timestamp <= options.timeRange!.end
      )
    }

    const start = options.offset || 0
    const end = start + (options.limit || 50)
    
    return filtered.slice(start, end)
  }

  getPatterns(): ErrorPattern[] {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.count - a.count)
  }

  getErrorStats(): {
    total: number
    byLevel: Record<ErrorLog['level'], number>
    byTag: Record<string, number>
    recentErrors: number
    patterns: number
  } {
    const recent24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const stats = {
      total: this.errors.length,
      byLevel: {
        error: this.errors.filter(e => e.level === 'error').length,
        warning: this.errors.filter(e => e.level === 'warning').length,
        info: this.errors.filter(e => e.level === 'info').length
      },
      byTag: {} as Record<string, number>,
      recentErrors: this.errors.filter(e => e.timestamp >= recent24h).length,
      patterns: this.patterns.size
    }

    // Count errors by tags
    this.errors.forEach(error => {
      error.tags.forEach(tag => {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1
      })
    })

    return stats
  }

  async resolveError(errorId: string): Promise<boolean> {
    const error = this.errors.find(e => e.id === errorId)
    if (error) {
      error.resolved = true
      
      // Update in database
      try {
        await prisma.errorLog.update({
          where: { id: errorId },
          data: { resolved: true }
        })
        return true
      } catch (dbError) {
        console.error('Failed to update error in database:', dbError)
        return false
      }
    }
    return false
  }

  // Convenience methods for common error types
  async logDatabaseError(error: Error, context?: Record<string, any>, userInfo?: any): Promise<string> {
    return this.logError('error', `Database error: ${error.message}`, error, 
      { ...context, errorType: 'database' }, userInfo)
  }

  async logAuthError(message: string, context?: Record<string, any>, userInfo?: any): Promise<string> {
    return this.logError('warning', `Authentication error: ${message}`, undefined,
      { ...context, errorType: 'auth' }, userInfo)
  }

  async logValidationError(message: string, context?: Record<string, any>, userInfo?: any): Promise<string> {
    return this.logError('warning', `Validation error: ${message}`, undefined,
      { ...context, errorType: 'validation' }, userInfo)
  }

  async logApiError(endpoint: string, error: Error, context?: Record<string, any>, userInfo?: any): Promise<string> {
    return this.logError('error', `API error at ${endpoint}: ${error.message}`, error,
      { ...context, endpoint, errorType: 'api' }, userInfo)
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker()

// Express/Next.js middleware for automatic error tracking
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  context?: Record<string, any>
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      const req = args[0] // Assumes first argument is request object
      const userInfo = {
        url: req?.url,
        userAgent: req?.headers?.get?.('user-agent') || req?.headers?.['user-agent'],
        sessionId: req?.headers?.get?.('x-session-id') || req?.headers?.['x-session-id']
      }

      await errorTracker.logError(
        'error',
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error : undefined,
        { ...context, handler: handler.name },
        userInfo
      )

      throw error // Re-throw to maintain normal error handling
    }
  }) as T
}