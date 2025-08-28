import Redis from 'ioredis'

// Redis connection configuration - only connect if REDIS_URL is provided
let redis: Redis | null = null

const redisUrl = process.env.KV_URL || process.env.REDIS_URL;
if (redisUrl) {
  redis = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
  })

  // Redis connection event handlers
  redis.on('connect', () => {
    console.log('✅ Redis connected successfully')
  })

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err)
  })

  redis.on('close', () => {
    console.log('🔌 Redis connection closed')
  })
}

// Cache utilities
export class CacheManager {
  private static instance: CacheManager
  private redis: Redis | null

  private constructor() {
    this.redis = redis
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  // Set cache with TTL
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    if (!this.redis) return
    try {
      const serializedValue = JSON.stringify(value)
      await this.redis.setex(key, ttl, serializedValue)
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  // Get cache value
  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // Delete cache key
  async del(key: string): Promise<void> {
    if (!this.redis) return
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  // Delete multiple cache keys by pattern
  async delPattern(pattern: string): Promise<void> {
    if (!this.redis) return
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache pattern delete error:', error)
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.redis) return false
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  // Set cache if not exists
  async setnx(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    if (!this.redis) return false
    try {
      const serializedValue = JSON.stringify(value)
      const result = await this.redis.set(key, serializedValue, 'EX', ttl, 'NX')
      return result === 'OK'
    } catch (error) {
      console.error('Cache setnx error:', error)
      return false
    }
  }

  // Increment counter
  async incr(key: string): Promise<number> {
    if (!this.redis) return 0
    try {
      return await this.redis.incr(key)
    } catch (error) {
      console.error('Cache incr error:', error)
      return 0
    }
  }

  // Get counter value
  async getCount(key: string): Promise<number> {
    if (!this.redis) return 0
    try {
      const value = await this.redis.get(key)
      return value ? parseInt(value) : 0
    } catch (error) {
      console.error('Cache getCount error:', error)
      return 0
    }
  }
}

// Rate limiting utilities
export class RateLimiter {
  private static instance: RateLimiter
  private cache: CacheManager

  private constructor() {
    this.cache = CacheManager.getInstance()
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  // Check rate limit for a key
  async checkLimit(key: string, limit: number, window: number): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
  }> {
    const now = Math.floor(Date.now() / 1000)
    const windowKey = `${key}:${Math.floor(now / window)}`
    
    const current = await this.cache.getCount(windowKey)
    const remaining = Math.max(0, limit - current)
    const resetTime = (Math.floor(now / window) + 1) * window

    if (current >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime
      }
    }

    // Increment counter
    await this.cache.incr(windowKey)
    
    // Set expiry for the window
    if (current === 0) {
      await this.cache.set(windowKey, 1, window)
    }

    return {
      allowed: true,
      remaining: remaining - 1,
      resetTime
    }
  }

  // Reset rate limit for a key
  async resetLimit(key: string): Promise<void> {
    const now = Math.floor(Date.now() / 1000)
    const windowKey = `${key}:${Math.floor(now / 60)}` // Assuming 1-minute windows
    await this.cache.del(windowKey)
  }
}

// Session storage utilities
export class SessionManager {
  private static instance: SessionManager
  private cache: CacheManager

  private constructor() {
    this.cache = CacheManager.getInstance()
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  // Store session data
  async setSession(sessionId: string, data: any, ttl: number = 86400): Promise<void> {
    const key = `session:${sessionId}`
    await this.cache.set(key, data, ttl)
  }

  // Get session data
  async getSession<T>(sessionId: string): Promise<T | null> {
    const key = `session:${sessionId}`
    return await this.cache.get<T>(key)
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`
    await this.cache.del(key)
  }

  // Update session TTL
  async extendSession(sessionId: string, ttl: number = 86400): Promise<void> {
    const key = `session:${sessionId}`
    const data = await this.cache.get(key)
    if (data) {
      await this.cache.set(key, data, ttl)
    }
  }
}

// Health check utility
export async function checkRedisHealth(): Promise<{
  status: 'healthy' | 'unhealthy' | 'not_configured'
  message: string
  latency?: number
}> {
  if (!redis) {
    return {
      status: 'not_configured',
      message: 'Redis not configured - no KV_URL or REDIS_URL provided'
    }
  }

  try {
    const start = Date.now()
    await redis.ping()
    const latency = Date.now() - start
    
    return {
      status: 'healthy',
      message: 'Redis is responding normally',
      latency
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Redis health check failed: ${error}`
    }
  }
}

// Export Redis instance for direct use
export { redis }

// Export utility classes
export const cacheManager = CacheManager.getInstance()
export const rateLimiter = RateLimiter.getInstance()
export const sessionManager = SessionManager.getInstance()
