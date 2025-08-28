import { NextRequest, NextResponse } from 'next/server'
import { cacheManager } from './redis'

interface CachedResponse {
  body: string
  status: number
  headers: Record<string, string>
  timestamp: number
}

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  key?: string // Custom cache key
  tags?: string[] // Cache tags for invalidation
  condition?: (req: NextRequest) => boolean // When to cache
}

export function withCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: CacheOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const {
      ttl = 300, // 5 minutes default
      key,
      tags = [],
      condition = () => req.method === 'GET' // Only cache GET requests by default
    } = options

    // Check if we should cache this request
    if (!condition(req)) {
      return await handler(req)
    }

    // Generate cache key
    const cacheKey = key || `api:${req.url}:${req.method}`
    
    try {
      // Try to get from cache first
      const cachedResponse = await cacheManager.get<CachedResponse>(cacheKey)
      
      if (cachedResponse) {
        console.log(`📦 Cache hit for: ${cacheKey}`)
        return new NextResponse(cachedResponse.body, {
          status: cachedResponse.status,
          headers: cachedResponse.headers,
        })
      }

      // Cache miss, execute handler
      console.log(`❌ Cache miss for: ${cacheKey}`)
      const response = await handler(req)
      
      // Clone response to cache it
      const responseClone = response.clone()
      const responseBody = await responseClone.text()
      
      // Cache the response
      const cacheData: CachedResponse = {
        body: responseBody,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: Date.now()
      }
      
      await cacheManager.set(cacheKey, cacheData, ttl)
      
      // Add cache tags if specified
      if (tags.length > 0) {
        const tagKey = `tags:${cacheKey}`
        await cacheManager.set(tagKey, tags, ttl)
      }
      
      return response
    } catch (error) {
      console.error('Cache middleware error:', error)
      // If caching fails, just execute the handler
      return await handler(req)
    }
  }
}

// Cache invalidation utilities
export async function invalidateCacheByTag(tag: string): Promise<void> {
  try {
    // This is a simplified implementation
    // In production, you might want to use Redis sets for tag management
    console.log(`🗑️ Invalidating cache for tag: ${tag}`)
  } catch (error) {
    console.error('Cache invalidation error:', error)
  }
}

export async function invalidateCacheByPattern(pattern: string): Promise<void> {
  try {
    await cacheManager.delPattern(pattern)
    console.log(`🗑️ Invalidated cache pattern: ${pattern}`)
  } catch (error) {
    console.error('Cache pattern invalidation error:', error)
  }
}

// Specific cache invalidation functions for your app
export async function invalidateDealsCache(): Promise<void> {
  await invalidateCacheByPattern('api:*/deals*')
  await invalidateCacheByPattern('api:*/venues*')
}

export async function invalidateVenueCache(venueId: string): Promise<void> {
  await invalidateCacheByPattern(`api:*/venues/${venueId}*`)
  await invalidateCacheByPattern(`api:*/deals*`)
}

export async function invalidateUserCache(userId: string): Promise<void> {
  await invalidateCacheByPattern(`api:*/users/${userId}*`)
  await invalidateCacheByPattern(`api:*/owner*`)
}

// Cache warming utilities
export async function warmDealsCache(): Promise<void> {
  try {
    console.log('🔥 Warming deals cache...')
    // You can implement cache warming logic here
    // For example, pre-fetch popular deals and cache them
  } catch (error) {
    console.error('Cache warming error:', error)
  }
}

// Cache health check
export async function getCacheStats(): Promise<{
  status: 'healthy' | 'unhealthy'
  message: string
  timestamp: number
}> {
  try {
    const testKey = 'health:check'
    const testValue = { test: true, timestamp: Date.now() }
    
    await cacheManager.set(testKey, testValue, 60)
    const retrieved = await cacheManager.get<{ test: boolean; timestamp: number }>(testKey)
    
    if (retrieved && retrieved.test === true) {
      return {
        status: 'healthy',
        message: 'Cache is working normally',
        timestamp: Date.now()
      }
    } else {
      return {
        status: 'unhealthy',
        message: 'Cache read/write test failed',
        timestamp: Date.now()
      }
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Cache health check failed: ${error}`,
      timestamp: Date.now()
    }
  }
}
