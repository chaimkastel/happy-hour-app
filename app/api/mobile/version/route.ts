import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: '1.0.0',
    minVersion: '1.0.0',
    latestVersion: '1.0.0',
    updateRequired: false,
    features: {
      deals: true,
      favorites: true,
      wallet: true,
      notifications: true,
      location: true,
      payments: true,
    },
    endpoints: {
      deals: '/api/mobile/deals',
      restaurants: '/api/mobile/restaurants',
      user: '/api/mobile/user',
      wallet: '/api/mobile/wallet',
      favorites: '/api/mobile/favorites',
      notifications: '/api/mobile/notifications',
    },
    supportedPlatforms: ['ios', 'android'],
    lastUpdated: new Date().toISOString(),
  });
}
