'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalMerchants: number;
    totalDeals: number;
    totalRedemptions: number;
    totalFavorites: number;
    recentUsers: number;
    recentRedemptions: number;
  };
  locationAnalytics: {
    userLocations: Record<string, { count: number; recent: number }>;
    topLocations: Array<{ location: string; count: number; recent: number }>;
  };
  redemptionAnalytics: {
    recentRedemptions: Array<{
      id: string;
      redeemedAt: string;
      user: { location: string | null };
      deal: {
        title: string;
        venue: { name: string; address: string };
      };
    }>;
    dealPerformance: Array<{
      id: string;
      title: string;
      venue: string;
      venueAddress: string;
      redemptions: number;
      favorites: number;
      status: string;
    }>;
  };
  merchantAnalytics: Array<{
    id: string;
    businessName: string;
    location: string | null;
    venueCount: number;
    totalDeals: number;
    totalRedemptions: number;
    kycStatus: string;
  }>;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Analytics Dashboard</h1>
              <p className="text-gray-600">Customer insights and location analytics</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-gray-700 px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalUsers}</p>
                <p className="text-xs text-green-600">+{analytics.overview.recentUsers} today</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Merchants</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalMerchants}</p>
                <p className="text-xs text-gray-500">Active businesses</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalDeals}</p>
                <p className="text-xs text-gray-500">Live offers</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalRedemptions}</p>
                <p className="text-xs text-green-600">+{analytics.overview.recentRedemptions} today</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Locations */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Customer Locations</h2>
            <div className="space-y-3">
              {analytics.locationAnalytics.topLocations.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{location.location}</p>
                      <p className="text-sm text-gray-600">{location.recent} new this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{location.count}</p>
                    <p className="text-xs text-gray-500">customers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Redemptions */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎫 Recent Redemptions</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analytics.redemptionAnalytics.recentRedemptions.map((redemption) => (
                <div key={redemption.id} className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{redemption.deal.title}</p>
                      <p className="text-sm text-gray-600">{redemption.deal.venue.name}</p>
                      <p className="text-xs text-gray-500">
                        {redemption.user.location || 'Location not set'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(redemption.redeemedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deal Performance */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Deal Performance</h2>
            <div className="space-y-3">
              {analytics.redemptionAnalytics.dealPerformance.map((deal) => (
                <div key={deal.id} className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{deal.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deal.status === 'LIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{deal.venue}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-red-600">🎫 {deal.redemptions} redeemed</span>
                    <span className="text-yellow-600">⭐ {deal.favorites} favorited</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merchant Analytics */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏪 Merchant Performance</h2>
            <div className="space-y-3">
              {analytics.merchantAnalytics.map((merchant) => (
                <div key={merchant.id} className="p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{merchant.businessName}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      merchant.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {merchant.kycStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{merchant.location || 'Location not set'}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-600">🏢 {merchant.venueCount} venues</span>
                    <span className="text-orange-600">🎯 {merchant.totalDeals} deals</span>
                    <span className="text-green-600">🎫 {merchant.totalRedemptions} redeemed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
