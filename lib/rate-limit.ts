import { NextRequest } from 'next/server';

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest,
  options: {
    limit: number;
    windowMs: number;
    keyGenerator?: (req: NextRequest) => string;
  }
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const { limit, windowMs, keyGenerator } = options;
  
  // Generate key for rate limiting
  const key = keyGenerator 
    ? keyGenerator(request)
    : request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up expired entries
  for (const [k, v] of rateLimitMap.entries()) {
    if (v.resetTime < now) {
      rateLimitMap.delete(k);
    }
  }
  
  // Get or create rate limit entry
  let entry = rateLimitMap.get(key);
  if (!entry || entry.resetTime < now) {
    entry = { count: 0, resetTime: now + windowMs };
    rateLimitMap.set(key, entry);
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }
  
  // Increment counter
  entry.count++;
  
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetTime: entry.resetTime
  };
}

// Common rate limit configurations
export const rateLimitConfigs = {
  // API routes
  api: {
    limit: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyGenerator: (req: NextRequest) => `api:${req.ip || 'unknown'}`
  },
  
  // Address autocomplete (more restrictive)
  autocomplete: {
    limit: 20,
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (req: NextRequest) => `autocomplete:${req.ip || 'unknown'}`
  },
  
  // Authentication (very restrictive)
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyGenerator: (req: NextRequest) => `auth:${req.ip || 'unknown'}`
  }
};

// Create a rate limiter function (for middleware compatibility)
export function createRateLimiter(config: {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
}) {
  return (request: NextRequest) => {
    return rateLimit(request, {
      limit: config.maxRequests,
      windowMs: config.windowMs,
      keyGenerator: config.keyGenerator
    });
  };
}