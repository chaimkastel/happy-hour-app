import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock Redis health check
    // In a real app, you would check actual Redis connection
    const redisHealth = {
      status: 'connected',
      latency: Math.floor(Math.random() * 10) + 1, // Mock latency 1-10ms
      memory: {
        used: Math.floor(Math.random() * 100) + 50, // Mock memory usage 50-150MB
        peak: Math.floor(Math.random() * 200) + 100 // Mock peak memory 100-300MB
      },
      uptime: Math.floor(Math.random() * 86400) + 3600, // Mock uptime 1-25 hours
      lastBackup: new Date(Date.now() - Math.random() * 86400000).toISOString() // Mock last backup within 24h
    };

    return NextResponse.json({ redis: redisHealth });
  } catch (error) {
    console.error('Error checking Redis health:', error);
    return NextResponse.json({ 
      redis: {
        status: 'disconnected',
        error: 'Failed to connect to Redis'
      }
    }, { status: 500 });
  }
}
