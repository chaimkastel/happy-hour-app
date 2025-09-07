'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/lib/auth-guard';
import { 
  CreditCard, 
  Tag, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  DollarSign,
  Building2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  startAt: string;
  endAt: string;
  maxRedemptions: number;
  redeemedCount: number;
  minSpend?: number;
  inPersonOnly: boolean;
  tags: string[];
  status: string;
  venue: {
    id: string;
    name: string;
    address: string;
    rating: number;
    latitude: number;
    longitude: number;
    photos: string[];
  };
}

interface Redemption {
  id: string;
  dealId: string;
  code: string;
  expiresAt: string;
  status: 'CLAIMED' | 'USED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  deal: Deal;
}

interface WalletStats {
  totalDeals: number;
  activeDeals: number;
  usedDeals: number;
  expiredDeals: number;
  totalSavings: number;
}

export default function WalletPage() {
  const router = useRouter();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalDeals: 0,
    activeDeals: 0,
    usedDeals: 0,
    expiredDeals: 0,
    totalSavings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'used' | 'expired'>('all');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/wallet/redemptions');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch wallet data');
      }

      const data = await response.json();
      const fetchedRedemptions = data.redemptions || [];
      
      // Update expired deals
      const now = new Date();
      const updatedRedemptions = await Promise.all(
        fetchedRedemptions.map(async (redemption: Redemption) => {
          if (redemption.status === 'CLAIMED') {
            const isExpired = new Date(redemption.expiresAt) < now;
            if (isExpired) {
              // Update status to expired
              try {
                await fetch('/api/wallet/redeem', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ redemptionId: redemption.id })
                });
              } catch (err) {
                console.error('Error updating expired deal:', err);
              }
              return { ...redemption, status: 'EXPIRED' as const };
            }
          }
          return redemption;
        })
      );
      
      setRedemptions(updatedRedemptions);
      
      // Calculate stats
      const totalDeals = updatedRedemptions.length;
      const activeDeals = updatedRedemptions.filter(r => r.status === 'CLAIMED').length;
      const usedDeals = updatedRedemptions.filter(r => r.status === 'USED').length;
      const expiredDeals = updatedRedemptions.filter(r => r.status === 'EXPIRED').length;
      
      // Calculate total savings (simplified)
      const totalSavings = updatedRedemptions.reduce((sum: number, r: Redemption) => {
        if (r.status === 'USED') {
          return sum + (r.deal.minSpend || 20) * (r.deal.percentOff / 100);
        }
        return sum;
      }, 0);

      setStats({
        totalDeals,
        activeDeals,
        usedDeals,
        expiredDeals,
        totalSavings
      });
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to load wallet data. Please try again.');
      setRedemptions([]);
      setStats({
        totalDeals: 0,
        activeDeals: 0,
        usedDeals: 0,
        expiredDeals: 0,
        totalSavings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemDeal = async (redemptionId: string) => {
    try {
      const response = await fetch('/api/wallet/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redemptionId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to redeem deal');
      }

      // Refresh wallet data
      await fetchWalletData();
    } catch (err) {
      console.error('Error redeeming deal:', err);
      alert(err instanceof Error ? err.message : 'Failed to redeem deal. Please try again.');
    }
  };

  const getTimeRemaining = (expiresAt: string): { hours: number; minutes: number } => {
    const now = new Date();
    const end = new Date(expiresAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return { hours: 0, minutes: 0 };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLAIMED': return 'bg-green-100 text-green-800';
      case 'USED': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CLAIMED': return <CheckCircle className="w-4 h-4" />;
      case 'USED': return <CheckCircle className="w-4 h-4" />;
      case 'EXPIRED': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredRedemptions = redemptions.filter(redemption => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return redemption.status === 'CLAIMED';
    return redemption.status === activeTab.toUpperCase();
  });

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchWalletData}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
              <p className="text-gray-600">Manage your deals and track your savings</p>
            </div>
            <button
              onClick={fetchWalletData}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Tag className="h-8 w-8 text-amber-600" />
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Total Deals</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalDeals}</dd>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Active Deals</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeDeals}</dd>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Used Deals</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.usedDeals}</dd>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-amber-600" />
                <div className="ml-5">
                  <dt className="text-sm font-medium text-gray-500">Total Savings</dt>
                  <dd className="text-lg font-medium text-gray-900">${stats.totalSavings.toFixed(2)}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'all', label: 'All Deals', count: stats.totalDeals },
                  { id: 'active', label: 'Active', count: stats.activeDeals },
                  { id: 'used', label: 'Used', count: stats.usedDeals },
                  { id: 'expired', label: 'Expired', count: stats.expiredDeals }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Deals List */}
          {filteredRedemptions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals in your wallet</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' 
                  ? "You haven't redeemed any deals yet. Visit Explore to claim your first deal and start saving!"
                  : `No ${activeTab} deals found.`
                }
              </p>
              {activeTab === 'all' && (
                <div className="space-y-4">
                  <Link 
                    href="/explore"
                    className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Find Your First Deal
                  </Link>
                  <div className="text-sm text-gray-500">
                    <p>💡 <strong>Tip:</strong> Look for deals marked with "Claim Deal" buttons</p>
                    <p>🎯 Filter by "Near Me" to find deals close to you</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRedemptions.map((redemption) => {
                const timeRemaining = getTimeRemaining(redemption.expiresAt);
                const isExpired = new Date(redemption.expiresAt) < new Date();
                
                return (
                  <div key={redemption.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Deal Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                            {getStatusIcon(redemption.status)}
                            <span className="ml-1">{redemption.status}</span>
                          </span>
                          {redemption.status === 'CLAIMED' && !isExpired && (
                            <span className="text-xs text-gray-500">
                              {timeRemaining.hours}h {timeRemaining.minutes}m left
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">{redemption.deal.percentOff}%</div>
                          <div className="text-sm text-gray-500">OFF</div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{redemption.deal.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{redemption.deal.description}</p>
                      
                      {/* Tags */}
                      {redemption.deal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {redemption.deal.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Venue Info */}
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{redemption.deal.venue.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{redemption.deal.venue.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-gray-600">{redemption.deal.venue.rating.toFixed(1)}</span>
                        </div>
                        {redemption.deal.minSpend && (
                          <div className="text-gray-500">
                            Min spend: ${redemption.deal.minSpend}
                          </div>
                        )}
                      </div>

                      {/* Redemption Details */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Claimed: {new Date(redemption.createdAt).toLocaleDateString()}</span>
                          </div>
                          {redemption.status === 'USED' && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Used: {new Date(redemption.updatedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {redemption.status === 'CLAIMED' && !isExpired && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleRedeemDeal(redemption.id)}
                            className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center"
                          >
                            <Tag className="w-4 h-4 mr-2" />
                            Use Deal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}