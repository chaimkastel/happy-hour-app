'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Eye, Tag, Clock, Users, Building2, QrCode, AlertCircle, CheckCircle, Pause, Play, TrendingUp, BarChart3, Filter, Search, Calendar, DollarSign, X } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  status: string;
  startAt: string;
  endAt: string;
  maxRedemptions: number;
  redeemedCount: number;
  minSpend?: number;
  tags: string[];
  venue: { id: string; name: string };
  createdAt: string;
}

interface DealStats {
  totalDeals: number;
  liveDeals: number;
  pausedDeals: number;
  draftDeals: number;
  expiredDeals: number;
  totalRedemptions: number;
  averageRedemptionRate: number;
  revenueGenerated: number;
}

export default function MerchantDealsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'paused' | 'draft' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'ending' | 'redemptions' | 'percent'>('created');
  const [stats, setStats] = useState<DealStats>({
    totalDeals: 0,
    liveDeals: 0,
    pausedDeals: 0,
    draftDeals: 0,
    expiredDeals: 0,
    totalRedemptions: 0,
    averageRedemptionRate: 0,
    revenueGenerated: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    fetchDeals();
  }, [session, status, router]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/merchant/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/merchant/deals/${dealId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeals(prev => prev.filter(deal => deal.id !== dealId));
      } else {
        alert('Error deleting deal');
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Error deleting deal');
    }
  };

  const toggleDealStatus = async (dealId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'LIVE' ? 'PAUSED' : 'LIVE';
    
    try {
      const response = await fetch(`/api/merchant/deals/${dealId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setDeals(prev => prev.map(deal => 
          deal.id === dealId ? { ...deal, status: newStatus } : deal
        ));
      } else {
        alert('Error updating deal status');
      }
    } catch (error) {
      console.error('Error updating deal status:', error);
      alert('Error updating deal status');
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
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LIVE': return <CheckCircle className="w-4 h-4" />;
      case 'PAUSED': return <Pause className="w-4 h-4" />;
      case 'EXPIRED': return <AlertCircle className="w-4 h-4" />;
      case 'DRAFT': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (filter === 'all') return true;
    if (filter === 'expired') return new Date(deal.endAt) < new Date();
    return deal.status === filter.toUpperCase();
  });

  const getDealStats = () => {
    const total = deals.length;
    const live = deals.filter(d => d.status === 'LIVE').length;
    const paused = deals.filter(d => d.status === 'PAUSED').length;
    const draft = deals.filter(d => d.status === 'DRAFT').length;
    const expired = deals.filter(d => new Date(d.endAt) < new Date()).length;
    const totalRedemptions = deals.reduce((sum, d) => sum + d.redeemedCount, 0);

    return { total, live, paused, draft, expired, totalRedemptions };
  };

  const calculatedStats = getDealStats();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access the merchant dashboard</h1>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">My Deals</h1>
              <p className="text-gray-600 mt-1">Manage your promotions and track customer engagement</p>
            </div>
            <Link 
              href="/merchant/deals/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Deal
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-indigo-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Deals</dt>
                <dd className="text-lg font-medium text-gray-900">{calculatedStats.total}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Live</dt>
                <dd className="text-lg font-medium text-gray-900">{calculatedStats.live}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Pause className="h-8 w-8 text-yellow-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Paused</dt>
                <dd className="text-lg font-medium text-gray-900">{calculatedStats.paused}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-gray-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Draft</dt>
                <dd className="text-lg font-medium text-gray-900">{calculatedStats.draft}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Redemptions</dt>
                <dd className="text-lg font-medium text-gray-900">{calculatedStats.totalRedemptions}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', label: 'All Deals', count: calculatedStats.total },
                { id: 'live', label: 'Live', count: calculatedStats.live },
                { id: 'paused', label: 'Paused', count: calculatedStats.paused },
                { id: 'draft', label: 'Draft', count: calculatedStats.draft },
                { id: 'expired', label: 'Expired', count: calculatedStats.expired }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    filter === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    filter === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Deals List */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You haven't created any deals yet. Get started by creating your first promotion!"
                : `No ${filter} deals found.`
              }
            </p>
            {filter === 'all' && (
              <Link 
                href="/merchant/deals/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Deal
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredDeals.map((deal) => {
                const timeRemaining = getTimeRemaining(deal.endAt);
                const isExpired = new Date(deal.endAt) < new Date();
                
                return (
                  <li key={deal.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <p className="text-lg font-medium text-gray-900">{deal.title}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                              {getStatusIcon(deal.status)}
                              <span className="ml-1">{deal.status}</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">{deal.percentOff}%</div>
                            <div className="text-sm text-gray-500">OFF</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{deal.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2" />
                            {deal.venue.name}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {deal.redeemedCount}/{deal.maxRedemptions}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {isExpired ? 'Expired' : `${timeRemaining.hours}h ${timeRemaining.minutes}m left`}
                          </div>
                          {deal.minSpend && (
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-2" />
                              Min ${deal.minSpend}
                            </div>
                          )}
                        </div>
                      </div>
                      
                                              <div className="ml-6 flex items-center space-x-2">
                          <button
                            onClick={() => toggleDealStatus(deal.id, deal.status)}
                            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                              deal.status === 'LIVE'
                                ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                                : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                            }`}
                          >
                            {deal.status === 'LIVE' ? (
                              <>
                                <Pause className="w-4 h-4 mr-1" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-1" />
                                Activate
                              </>
                            )}
                          </button>
                          <Link 
                            href={`/merchant/deals/${deal.id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                          <Link 
                            href={`/deal/${deal.id}/view`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            QR
                          </Link>
                          <button
                            onClick={() => deleteDeal(deal.id)}
                            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
