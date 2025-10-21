import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRedisHealth } from '@/lib/redis';

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy' as 'healthy' | 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown' as 'connected' | 'disconnected' | 'unknown',
      redis: 'unknown' as 'connected' | 'disconnected' | 'unknown',
    },
    responseTime: 0,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    config: {
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'set' : 'not set',
      REDIS_URL: process.env.REDIS_URL ? 'set' : 'not set',
    },
  };

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'connected';
  } catch (error) {
    console.error('Database health check failed:', error);
    health.services.database = 'disconnected';
    health.status = 'unhealthy';
  }

  try {
    // Test Redis connection
    const redisHealthy = await checkRedisHealth();
    health.services.redis = redisHealthy ? 'connected' : 'disconnected';
  } catch (error) {
    console.error('Redis health check failed:', error);
    health.services.redis = 'disconnected';
    // Redis failure doesn't make the entire service unhealthy
  }

  health.responseTime = Date.now() - startTime;

  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(health, { status: statusCode });
}