'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Prevent static generation
export const runtime = 'nodejs';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Clock,
  DollarSign,
  QrCode,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { OnboardingChecklist } from '@/components/merchant/OnboardingChecklist';
import { useSession } from 'next-auth/react';

interface Merchant {
  id: string;
  companyName: string;
  contactEmail: string;
  approved: boolean;
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE';
  venues: Venue[];
}

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating?: number;
  photos: string[];
  deals: Deal[];
}

interface Deal {
  id: string;
  title: string;
  description: string;
  type: 'HAPPY_HOUR' | 'INSTANT';
  percentOff?: number;
  price?: number;
  startsAt: string;
  endsAt: string;
  status: string;
  maxRedemptions: number;
  redeemedCount: number;
}

interface Voucher {
    id: string;
  code: string;
  status: 'ISSUED' | 'REDEEMED' | 'CANCELLED' | 'EXPIRED';
  issuedAt: string;
  redeemedAt?: string;
  deal: Deal;
  venue: Venue;
}

export default function MerchantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [recentVouchers, setRecentVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle loading and authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    router.push('/merchant/login' as any);
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
    try {
      setLoading(true);
        
        // Fetch merchant data
        const merchantResponse = await fetch('/api/merchant/dashboard');
        if (!merchantResponse.ok) {
          throw new Error('Failed to fetch merchant data');
        }
        const merchantData = await merchantResponse.json();
        setMerchant(merchantData);

        // Fetch recent vouchers
        const vouchersResponse = await fetch('/api/merchant/vouchers/recent');
        if (vouchersResponse.ok) {
          const vouchersData = await vouchersResponse.json();
          setRecentVouchers(vouchersData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Merchant Found</h2>
          <p className="text-gray-600 mb-4">Please contact support to set up your merchant account.</p>
        </div>
      </div>
    );
  }

  const totalVenues = merchant.venues.length;
  const totalDeals = merchant.venues.reduce((sum, venue) => sum + venue.deals.length, 0);
  const activeDeals = merchant.venues.reduce((sum, venue) => 
    sum + venue.deals.filter(deal => deal.status === 'ACTIVE').length, 0
  );
  const totalRedemptions = merchant.venues.reduce((sum, venue) => 
    sum + venue.deals.reduce((dealSum, deal) => dealSum + deal.redeemedCount, 0), 0
  );

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAST_DUE': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      case 'INCOMPLETE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {merchant.companyName}!
              </h1>
              <p className="text-gray-600">Manage your venues, deals, and track performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getSubscriptionStatusColor(merchant.subscriptionStatus)}>
                {merchant.subscriptionStatus}
              </Badge>
              <Button
                onClick={() => router.push('/merchant/venues/new' as any)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
              </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Venues</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVenues}</p>
              </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
              </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Deals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeDeals > 0 ? activeDeals : 'Start Creating'}
                  </p>
                  {activeDeals === 0 && (
                    <p className="text-xs text-gray-500 mt-1">Create your first deal</p>
                  )}
              </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <QrCode className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalRedemptions > 0 ? totalRedemptions : '0'}
                  </p>
                  {totalRedemptions === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No redemptions yet</p>
                  )}
                </div>
                  </div>
                </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Deals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalDeals > 0 ? totalDeals : '0'}
                  </p>
                  {totalDeals === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No deals created yet</p>
                  )}
                </div>
                </div>
            </div>
          </Card>
          </div>

        {/* Onboarding Checklist */}
        <div className="mb-8">
          <OnboardingChecklist
            steps={[
              {
                id: 'profile',
                title: 'Complete your profile',
                description: 'Add your business information and contact details',
                completed: !!(merchant.companyName && merchant.contactEmail),
                required: true,
                actionUrl: '/merchant/profile',
                actionLabel: 'Complete Profile'
              },
              {
                id: 'venue',
                title: 'Add your first venue',
                description: 'Create a venue location where you can offer deals',
                completed: merchant.venues.length > 0,
                required: true,
                actionUrl: '/merchant/venues/new',
                actionLabel: 'Add Venue'
              },
              {
                id: 'stripe',
                title: 'Connect Stripe payment',
                description: 'Set up payment processing to receive payments',
                completed: merchant.subscriptionStatus === 'ACTIVE',
                required: true,
                actionUrl: '/merchant/settings/billing',
                actionLabel: 'Connect Stripe'
              },
              {
                id: 'first-deal',
                title: 'Create your first deal',
                description: 'Add a deal to start attracting customers',
                completed: totalDeals > 0,
                required: false,
                actionUrl: '/merchant/deals/new',
                actionLabel: 'Create Deal'
              }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Vouchers */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Vouchers</h3>
                <Button
                  variant="outline"
                  onClick={() => router.push('/merchant/vouchers' as any)}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentVouchers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No vouchers yet</p>
                ) : (
                  recentVouchers.map((voucher) => (
                    <div key={voucher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {voucher.status === 'REDEEMED' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : voucher.status === 'EXPIRED' ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                      </div>
                      <div>
                          <p className="text-sm font-medium text-gray-900">
                            {voucher.deal.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {voucher.venue.name} • {voucher.code}
                          </p>
                    </div>
                      </div>
                      <Badge variant="secondary">
                        {voucher.status}
                      </Badge>
                    </div>
                  ))
              )}
            </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/merchant/venues' as any)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Manage Venues
                </Button>
                <Button
                  onClick={() => router.push('/merchant/deals' as any)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Deals
                </Button>
                <Button
                  onClick={() => router.push('/merchant/vouchers/validate' as any)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Validate Vouchers
                </Button>
                <Button
                  onClick={() => router.push('/merchant/subscription' as any)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}