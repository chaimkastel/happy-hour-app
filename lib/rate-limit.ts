import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: NextRequest) => string;
}

export async function limit(key: string, max: number, windowSec: number) {
  try {
    const now = Date.now();
    const windowStart = now - (windowSec * 1000);
    
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline();
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // Count current requests
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    
    // Set expiration
    pipeline.expire(key, windowSec);
    
    const results = await pipeline.exec();
    const currentCount = results[1] as number;
    
    if (currentCount >= max) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((now - windowStart) / 1000)
      };
    }
    
    return {
      allowed: true,
      remaining: max - currentCount - 1,
      retryAfter: undefined
    };
  } catch (error) {
    // Fallback to allowing the request if Redis is unavailable
    console.error('Rate limit error:', error);
    return {
      allowed: true,
      remaining: max - 1,
      retryAfter: undefined
    };
  }
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator = defaultKeyGenerator } = options;

  return async (req: NextRequest) => {
    const key = `rate_limit:${keyGenerator(req)}`;
    const windowSec = Math.ceil(windowMs / 1000);
    
    const result = await limit(key, maxRequests, windowSec);
    
    return {
      success: result.allowed,
      remaining: result.remaining,
      resetTime: result.retryAfter ? Date.now() + (result.retryAfter * 1000) : undefined
    };
  };
}

function defaultKeyGenerator(req: NextRequest): string {
  // Use IP address as default key
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
  return ip;
}

export function createRateLimitResponse(remaining: number, resetTime: number) {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({ 
      error: 'Too many requests', 
      remaining, 
      resetTime: new Date(resetTime).toISOString() 
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

export function rateLimited(retryAfter = 60) {
  return new Response(
    JSON.stringify({ ok: false, code: "RATE_LIMITED" }), 
    { 
      status: 429, 
      headers: { "Retry-After": String(retryAfter) }
    }
  );
}

// Rate limit configurations
export const rateLimitConfigs = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  search: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  redeem: { windowMs: 15 * 60 * 1000, maxRequests: 2 }, // 2 redemptions per 15 minutes
};

// Create rate limiter function for middleware
export function createRateLimiter(options: RateLimitOptions) {
  return rateLimit(options);
}

// User-specific rate limiter
export function userRateLimit(options: RateLimitOptions) {
  return rateLimit({
    ...options,
    keyGenerator: (req: NextRequest) => {
      const userId = req.headers.get('x-user-id');
      if (userId) {
        return `user:${userId}`;
      }
      return defaultKeyGenerator(req);
    }
  });
}