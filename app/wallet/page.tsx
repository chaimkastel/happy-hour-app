'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Tag, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Building2
} from 'lucide-react';
import Link from 'next/link';

interface Redemption {
  id: string;
  deal: {
    id: string;
    title: string;
    description: string;
    percentOff: number;
    startAt: string;
    endAt: string;
    minSpend?: number;
    tags: string[];
    venue: {
      id: string;
      name: string;
      address: string;
      rating: number;
    };
  };
  redeemedAt: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  usedAt?: string;
}

interface WalletStats {
  totalDeals: number;
  activeDeals: number;
  usedDeals: number;
  expiredDeals: number;
  totalSavings: number;
  favoriteVenues: number;
}

export default function WalletPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalDeals: 0,
    activeDeals: 0,
    usedDeals: 0,
    expiredDeals: 0,
    totalSavings: 0,
    favoriteVenues: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'used' | 'expired'>('all');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Get claimed deals from localStorage
      const claimedDeals = JSON.parse(localStorage.getItem('hh:wallet') || '[]');
      
      // Check for expired deals and update status
      const now = new Date().getTime();
      const updatedDeals = claimedDeals.map((deal: any) => {
        const expiresAt = new Date(deal.expiresAt).getTime();
        if (now > expiresAt) {
          return { ...deal, status: 'EXPIRED' };
        }
        return { ...deal, status: 'ACTIVE' };
      });
      
      // Update localStorage with updated statuses
      localStorage.setItem('hh:wallet', JSON.stringify(updatedDeals));
      
      // Fetch user's redemptions from API as well
      const response = await fetch('/api/wallet/redemptions');
      let apiRedemptions: Redemption[] = [];
      if (response.ok) {
        const data = await response.json();
        apiRedemptions = data.redemptions || [];
      }
      
      // Combine localStorage deals with API redemptions
      const allDeals = [...updatedDeals, ...apiRedemptions];
      setRedemptions(allDeals);
      
      // Calculate stats
      const totalDeals = allDeals.length;
      const activeDeals = allDeals.filter((r: any) => r.status === 'ACTIVE').length;
      const usedDeals = allDeals.filter((r: any) => r.status === 'USED').length;
      const expiredDeals = allDeals.filter((r: any) => r.status === 'EXPIRED').length;
      
      // Calculate total savings (simplified)
      const totalSavings = allDeals.reduce((sum: number, r: any) => {
        if (r.status === 'USED') {
          return sum + (r.deal?.minSpend || 20) * (r.deal?.percentOff / 100);
        }
        return sum;
      }, 0);

      setStats({
        totalDeals,
        activeDeals,
        usedDeals,
        expiredDeals,
        totalSavings,
        favoriteVenues: 0 // TODO: Implement favorites
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setRedemptions([]);
      setStats({
        totalDeals: 0,
        activeDeals: 0,
        usedDeals: 0,
        expiredDeals: 0,
        totalSavings: 0,
        favoriteVenues: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (endTime: string): { hours: number; minutes: number } => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return { hours: 0, minutes: 0 };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'USED': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />;
      case 'USED': return <CheckCircle className="w-4 h-4" />;
      case 'EXPIRED': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredRedemptions = redemptions.filter(redemption => {
    if (activeTab === 'all') return true;
    return redemption.status === activeTab.toUpperCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
              <p className="text-gray-600 mt-1">Manage your deals and track your savings</p>
            </div>
            <Link 
              href="/deals"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Tag className="w-4 h-4 mr-2" />
              Find More Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-indigo-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Deals</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalDeals}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Active Deals</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.activeDeals}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Used Deals</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.usedDeals}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Savings</dt>
                <dd className="text-lg font-medium text-gray-900">${stats.totalSavings.toFixed(2)}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
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
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
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
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals in your wallet</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all' 
                ? "You haven't redeemed any deals yet. Start exploring to find great offers!"
                : `No ${activeTab} deals found.`
              }
            </p>
            {activeTab === 'all' && (
              <Link 
                href="/deals"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Tag className="w-4 h-4 mr-2" />
                Find Your First Deal
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRedemptions.map((redemption) => {
              const timeRemaining = getTimeRemaining(redemption.deal.endAt);
              const isExpired = new Date(redemption.deal.endAt) < new Date();
              
              return (
                <div key={redemption.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Deal Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                          {getStatusIcon(redemption.status)}
                          <span className="ml-1">{redemption.status}</span>
                        </span>
                        {redemption.status === 'ACTIVE' && !isExpired && (
                          <span className="text-xs text-gray-500">
                            {timeRemaining.hours}h {timeRemaining.minutes}m left
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{redemption.deal.percentOff}%</div>
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
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-600">{redemption.deal.venue.rating}</span>
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
                          <span>Redeemed: {new Date(redemption.redeemedAt).toLocaleDateString()}</span>
                        </div>
                        {redemption.usedAt && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Used: {new Date(redemption.usedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {redemption.status === 'ACTIVE' && !isExpired && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link 
                          href={`/redeem/${redemption.deal.id}`}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          Use Deal
                        </Link>
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
  );
}
