import { NextRequest, NextResponse } from 'next/server'
import { withMiddleware, MiddlewareConfig } from './middleware'
import { errorTracker } from './error-tracking'
import { healthChecker } from './monitoring'

// Enhanced middleware that integrates monitoring and error tracking
export function withMonitoring<T extends (req: NextRequest) => Promise<NextResponse>>(
  handler: T,
  config: MiddlewareConfig & {
    trackErrors?: boolean
    trackPerformance?: boolean
    alertOnSlowRequests?: boolean
    slowRequestThreshold?: number
  } = {}
): T {
  return withMiddleware(async (req: NextRequest) => {
    const startTime = Date.now()
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Add request tracking headers
      const headers = new Headers()
      headers.set('X-Request-ID', requestId)
      
      // Call the original handler with monitoring
      const response = await handler(req)
      
      // Track performance if enabled
      if (config.trackPerformance !== false) {
        const responseTime = Date.now() - startTime
        
        // Alert on slow requests
        if (config.alertOnSlowRequests && responseTime > (config.slowRequestThreshold || 5000)) {
          healthChecker.generateAlert(
            'warning',
            'Slow Request Detected',
            `Request to ${req.nextUrl.pathname} took ${responseTime}ms`,
            { 
              url: req.nextUrl.pathname,
              method: req.method,
              responseTime,
              requestId 
            }
          )
        }
      }
      
      return response
      
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      // Track error if enabled
      if (config.trackErrors !== false) {
        await errorTracker.logApiError(
          req.nextUrl.pathname,
          error instanceof Error ? error : new Error(String(error)),
          {
            method: req.method,
            responseTime,
            requestId,
            query: Object.fromEntries(req.nextUrl.searchParams.entries())
          },
          {
            url: req.nextUrl.href,
            userAgent: req.headers.get('user-agent') || undefined,
            sessionId: req.headers.get('x-session-id') || undefined
          }
        )
      }
      
      // Re-throw error to maintain normal error handling
      throw error
    }
  }, config) as T
}

// Convenience functions for common middleware patterns
export const withStrictMonitoring = <T extends (req: NextRequest) => Promise<NextResponse>>(handler: T) =>
  withMonitoring(handler, {
    rateLimit: { requests: 100, windowMs: 60000 },
    trackErrors: true,
    trackPerformance: true,
    alertOnSlowRequests: true,
    slowRequestThreshold: 3000
  })

export const withBasicMonitoring = <T extends (req: NextRequest) => Promise<NextResponse>>(handler: T) =>
  withMonitoring(handler, {
    trackErrors: true,
    trackPerformance: true,
    alertOnSlowRequests: false
  })

export const withErrorTrackingOnly = <T extends (req: NextRequest) => Promise<NextResponse>>(handler: T) =>
  withMonitoring(handler, {
    trackErrors: true,
    trackPerformance: false,
    alertOnSlowRequests: false
  })

// Database operation monitoring
export async function withDatabaseMonitoring<T>(
  operation: () => Promise<T>,
  operationName: string,
  context?: Record<string, any>
): Promise<T> {
  const startTime = Date.now()
  
  try {
    const result = await operation()
    const duration = Date.now() - startTime
    
    // Alert on slow database operations
    if (duration > 2000) {
      healthChecker.generateAlert(
        'warning',
        'Slow Database Operation',
        `${operationName} took ${duration}ms`,
        { operation: operationName, duration, context }
      )
    }
    
    return result
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    await errorTracker.logDatabaseError(
      error instanceof Error ? error : new Error(String(error)),
      { 
        operation: operationName,
        duration,
        ...context
      }
    )
    
    throw error
  }
}

// Business logic monitoring
export async function withBusinessLogicMonitoring<T>(
  operation: () => Promise<T>,
  businessOperation: string,
  validationRules?: (() => Promise<void>)[],
  context?: Record<string, any>
): Promise<T> {
  const startTime = Date.now()
  
  try {
    // Run pre-validation rules
    if (validationRules) {
      for (const rule of validationRules) {
        await rule()
      }
    }
    
    const result = await operation()
    const duration = Date.now() - startTime
    
    // Log successful business operations for audit
    console.log(`✅ ${businessOperation} completed in ${duration}ms`)
    
    return result
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    await errorTracker.logError(
      'error',
      `Business logic error in ${businessOperation}: ${error instanceof Error ? error.message : String(error)}`,
      error instanceof Error ? error : undefined,
      {
        businessOperation,
        duration,
        ...context
      }
    )
    
    throw error
  }
}

// Authentication monitoring
export async function withAuthMonitoring<T>(
  authOperation: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  try {
    return await authOperation()
  } catch (error) {
    await errorTracker.logAuthError(
      error instanceof Error ? error.message : String(error),
      context
    )
    throw error
  }
}

// Payment processing monitoring
export async function withPaymentMonitoring<T>(
  paymentOperation: () => Promise<T>,
  amount: number,
  currency: string,
  context?: Record<string, any>
): Promise<T> {
  const startTime = Date.now()
  
  try {
    const result = await paymentOperation()
    const duration = Date.now() - startTime
    
    // Log successful payment for audit
    console.log(`💳 Payment processed: ${amount} ${currency} in ${duration}ms`)
    
    return result
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    await errorTracker.logError(
      'error',
      `Payment processing error: ${error instanceof Error ? error.message : String(error)}`,
      error instanceof Error ? error : undefined,
      {
        amount,
        currency,
        duration,
        errorType: 'payment',
        ...context
      }
    )
    
    // Generate critical alert for payment failures
    healthChecker.generateAlert(
      'critical',
      'Payment Processing Failure',
      `Payment of ${amount} ${currency} failed: ${error instanceof Error ? error.message : String(error)}`,
      { amount, currency, context }
    )
    
    throw error
  }
}