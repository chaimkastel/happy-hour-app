import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string // Function to generate rate limit key
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (in production, use Redis or similar)
const store: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 5 * 60 * 1000)

export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimit(req: NextRequest) {
    const key = config.keyGenerator ? config.keyGenerator(req) : req.ip || 'unknown'
    const now = Date.now()
    
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      }
      return { success: true, remaining: config.maxRequests - 1 }
    }
    
    if (store[key].count >= config.maxRequests) {
      return { 
        success: false, 
        remaining: 0,
        resetTime: store[key].resetTime,
        error: 'Rate limit exceeded'
      }
    }
    
    store[key].count++
    return { 
      success: true, 
      remaining: config.maxRequests - store[key].count 
    }
  }
}

// Pre-configured rate limiters
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
  keyGenerator: (req) => `auth:${req.ip || 'unknown'}`
})

export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req) => `api:${req.ip || 'unknown'}`
})

export const bulkOperationRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 bulk operations per minute
  keyGenerator: (req) => `bulk:${req.ip || 'unknown'}`
})
