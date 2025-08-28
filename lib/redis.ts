import Redis from 'ioredis';

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  redis.on('close', () => {
    console.log('🔌 Redis connection closed');
  });
}

export { redis };

export async function checkRedisHealth(): Promise<boolean> {
  if (!redis) {
    console.log('⚠️ Redis not configured (REDIS_URL not set)');
    return false;
  }

  try {
    await redis.ping();
    console.log('✅ Redis health check passed');
    return true;
  } catch (error) {
    console.error('❌ Redis health check failed:', error);
    return false;
  }
}

export async function getRedisInfo(): Promise<any> {
  if (!redis) {
    return { error: 'Redis not configured' };
  }

  try {
    const info = await redis.info();
    return { status: 'connected', info };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
