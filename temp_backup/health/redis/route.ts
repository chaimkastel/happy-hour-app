import { NextRequest, NextResponse } from 'next/server'
import { checkRedisHealth, cacheManager, rateLimiter, sessionManager } from '@/lib/redis'

export async function GET(req: NextRequest) {
  try {
    // Check Redis health
    const health = await checkRedisHealth()
    
    // Test cache operations
    const testKey = 'health:test'
    const testValue = { timestamp: Date.now(), test: true }
    
    await cacheManager.set(testKey, testValue, 60)
    const retrieved = await cacheManager.get<{ timestamp: number; test: boolean }>(testKey)
    const cacheWorking = retrieved && retrieved.test === true
    
    // Test rate limiting
    const rateLimitTest = await rateLimiter.checkLimit('health:test', 10, 60)
    
    // Test session management
    const sessionTestKey = 'health:session:test'
    const sessionTestValue = { userId: 'test', data: 'test' }
    await sessionManager.setSession(sessionTestKey, sessionTestValue, 60)
    const sessionRetrieved = await sessionManager.getSession<{ userId: string; data: string }>(sessionTestKey)
    const sessionWorking = sessionRetrieved && sessionRetrieved.userId === 'test'
    
    // Clean up test data
    await cacheManager.del(testKey)
    await sessionManager.deleteSession(sessionTestKey)
    
    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      redis: {
        connection: health,
        cache: {
          status: cacheWorking ? 'working' : 'failed',
          message: cacheWorking ? 'Cache operations successful' : 'Cache operations failed'
        },
        rateLimit: {
          status: rateLimitTest.allowed ? 'working' : 'failed',
          message: rateLimitTest.allowed ? 'Rate limiting working' : 'Rate limiting failed',
          remaining: rateLimitTest.remaining,
          resetTime: rateLimitTest.resetTime
        },
        session: {
          status: sessionWorking ? 'working' : 'failed',
          message: sessionWorking ? 'Session management working' : 'Session management failed'
        }
      },
      summary: {
        overall: health.status === 'healthy' && cacheWorking && rateLimitTest.allowed && sessionWorking ? 'healthy' : 'degraded',
        services: {
          connection: health.status,
          cache: cacheWorking ? 'healthy' : 'unhealthy',
          rateLimit: rateLimitTest.allowed ? 'healthy' : 'unhealthy',
          session: sessionWorking ? 'healthy' : 'unhealthy'
        }
      }
    }
    
    return NextResponse.json(response, {
      status: response.summary.overall === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Redis health check error:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      redis: {
        connection: { status: 'unhealthy', message: 'Health check failed' },
        cache: { status: 'failed', message: 'Cache health check failed' },
        rateLimit: { status: 'failed', message: 'Rate limit health check failed' },
        session: { status: 'failed', message: 'Session health check failed' }
      },
      summary: {
        overall: 'unhealthy',
        services: {
          connection: 'unhealthy',
          cache: 'unhealthy',
          rateLimit: 'unhealthy',
          session: 'unhealthy'
        }
      }
    }, { status: 503 })
  }
}
