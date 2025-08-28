import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter } from './rate-limit'
import { validateInput } from './validation'

export interface MiddlewareConfig {
  rateLimit?: {
    windowMs: number
    maxRequests: number
    keyGenerator?: (req: NextRequest) => string
  }
  validation?: {
    schema: any // Changed from z.ZodSchema<any> to any
    validateBody?: boolean
    validateQuery?: boolean
  }
  requireAuth?: boolean
}

export function withMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: MiddlewareConfig = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Rate limiting
      if (config.rateLimit) {
        const rateLimiter = createRateLimiter(config.rateLimit)
        const rateLimitResult = rateLimiter(req)
        
        if (!rateLimitResult.success) {
          return NextResponse.json(
            { 
              error: 'Rate limit exceeded',
              resetTime: rateLimitResult.resetTime 
            }, 
            { status: 429 }
          )
        }
        
        // Add rate limit headers
        const response = await handler(req)
        response.headers.set('X-RateLimit-Limit', config.rateLimit.maxRequests.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
        if (rateLimitResult.resetTime) {
          response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
        }
        return response
      }

      // Input validation
      if (config.validation) {
        if (config.validation.validateBody && req.method !== 'GET') {
          try {
            const body = await req.json()
            const validation = validateInput(config.validation.schema, body)
            if (!validation.success) {
              return NextResponse.json(
                { error: 'Validation failed', details: validation.errors }, 
                { status: 400 }
              )
            }
          } catch (error) {
            return NextResponse.json(
              { error: 'Invalid JSON body' }, 
              { status: 400 }
            )
          }
        }

        if (config.validation.validateQuery) {
          const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries())
          const validation = validateInput(config.validation.schema, queryParams)
          if (!validation.success) {
            return NextResponse.json(
              { error: 'Invalid query parameters', details: validation.errors }, 
              { status: 400 }
            )
          }
        }
      }

      // Call the original handler
      return await handler(req)
    } catch (error) {
      console.error('Middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' }, 
        { status: 500 }
      )
    }
  }
}

// Pre-configured middleware for common use cases
export const withAuthAndRateLimit = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withMiddleware(handler, {
    rateLimit: { windowMs: 60 * 1000, maxRequests: 100 },
    requireAuth: true
  })

export const withBulkOperationLimit = (handler: (req: NextRequest) => Promise<NextResponse>) =>
  withMiddleware(handler, {
    rateLimit: { windowMs: 60 * 1000, maxRequests: 10 },
    requireAuth: true
  })

export const withStrictValidation = <T>(
  handler: (req: NextRequest) => Promise<NextResponse>,
  schema: any
) =>
  withMiddleware(handler, {
    validation: { schema, validateBody: true },
    requireAuth: true
  })
