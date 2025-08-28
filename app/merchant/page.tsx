'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Eye, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Building2, 
  MapPin, 
  Star, 
  Tag,
  BarChart3,
  Settings,
  QrCode,
  Target,
  Zap,
  Calendar,
  AlertCircle,
  Receipt
} from 'lucide-react';
import Link from 'next/link';

interface Venue {
  id: string;
  name: string;
  address: string;
  businessType: string[];
  priceTier: string;
  rating: number;
  isVerified: boolean;
  createdAt: string;
}

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

interface MerchantStats {
  totalVenues: number;
  activeDeals: number;
  totalRedemptions: number;
  revenueGenerated: number;
  averageRating: number;
  dealsThisMonth: number;
  pendingVerification: number;
}

export default function MerchantDashboard() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<MerchantStats>({
    totalVenues: 0,
    activeDeals: 0,
    totalRedemptions: 0,
    revenueGenerated: 0,
    averageRating: 0,
    dealsThisMonth: 0,
    pendingVerification: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'venues' | 'deals' | 'analytics' | 'redemptions' | 'redeem'>('overview');

  useEffect(() => {
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    try {
      setLoading(true);
      // Fetch merchant's venues
      const venuesResponse = await fetch('/api/merchant/venues');
      if (venuesResponse.ok) {
        const venuesData = await venuesResponse.json();
        setVenues(venuesData.venues || []);
      }

      // Fetch merchant's deals
      const dealsResponse = await fetch('/api/merchant/deals');
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json();
        setDeals(dealsData.deals || []);
      }

      // Calculate merchant-specific stats
      const activeDeals = deals.filter(deal => deal.status === 'LIVE').length;
      const totalRedemptions = deals.reduce((sum, deal) => sum + deal.redeemedCount, 0);
      const averageRating = venues.length > 0 ? venues.reduce((sum, venue) => sum + venue.rating, 0) / venues.length : 0;
      const pendingVerification = venues.filter(venue => !venue.isVerified).length;
      
      setStats({
        totalVenues: venues.length,
        activeDeals,
        totalRedemptions,
        revenueGenerated: totalRedemptions * 25, // Mock calculation
        averageRating: Math.round(averageRating * 10) / 10,
        dealsThisMonth: deals.filter(deal => {
          const dealDate = new Date(deal.createdAt);
          const now = new Date();
          return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
        }).length,
        pendingVerification: pendingVerification
      });
    } catch (error) {
      console.error('Error fetching merchant data:', error);
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
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
              <h1 className="text-3xl font-bold text-gray-900">My Business Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your venues, deals, and track your business performance</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/merchant/venues"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </Link>
              <Link 
                href="/merchant/deals"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Deal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'venues', label: 'My Venues', icon: Building2 },
              { id: 'deals', label: 'My Deals', icon: Tag },
              { id: 'redemptions', label: 'Redemptions', icon: Receipt },
              { id: 'redeem', label: 'Redeem Deals', icon: QrCode },
              { id: 'analytics', label: 'Performance', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Venues</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalVenues}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Tag className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Deals</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.activeDeals}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalRedemptions}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Revenue Generated</dt>
                      <dd className="text-lg font-medium text-gray-900">${stats.revenueGenerated}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts & Notifications */}
            {stats.pendingVerification > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Venue Verification Required
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>You have {stats.pendingVerification} venue(s) pending verification. Verified venues get better visibility and customer trust.</p>
                    </div>
                    <div className="mt-4">
                      <Link 
                        href="/merchant/venues"
                        className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                      >
                        Review venues →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    href="/merchant/venues"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Building2 className="h-6 w-6 text-indigo-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Manage Venues</div>
                      <div className="text-sm text-gray-500">Add, edit, or update your venues</div>
                    </div>
                  </Link>

                  <Link 
                    href="/merchant/deals"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Tag className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Create Deals</div>
                      <div className="text-sm text-gray-500">Set up new promotions and offers</div>
                    </div>
                  </Link>

                  <Link 
                    href="/merchant/settings"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Settings className="h-6 w-6 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Business Settings</div>
                      <div className="text-sm text-gray-500">Configure your preferences</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {deals.slice(0, 5).map((deal) => (
                    <div key={deal.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          deal.status === 'LIVE' ? 'bg-green-400' : 
                          deal.status === 'PAUSED' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {deal.title} - {deal.venue.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {deal.redeemedCount} redemptions • {deal.percentOff}% off
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'venues' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Venues</h2>
              <Link 
                href="/merchant/venues"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div key={venue.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{venue.name}</h3>
                    {venue.isVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {venue.address}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      {venue.businessType.join(', ')}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {venue.rating}
                      </div>
                      <span className="text-sm text-gray-500 capitalize">{venue.priceTier.toLowerCase()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Link 
                      href={`/merchant/venues/${venue.id}`}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <Link 
                      href={`/merchant/venues/${venue.id}`}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Deals</h2>
              <Link 
                href="/merchant/deals"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Deal
              </Link>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {deals.map((deal) => {
                  const timeRemaining = getTimeRemaining(deal.endAt);
                  return (
                    <li key={deal.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {deal.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                                {deal.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {deal.percentOff}% off
                              </span>
                            </div>
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-600">{deal.description}</p>
                          
                          <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {deal.venue.name}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {deal.redeemedCount}/{deal.maxRedemptions}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {timeRemaining.hours}h {timeRemaining.minutes}m left
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex items-center space-x-2">
                          <Link 
                            href={`/merchant/deals/${deal.id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                          <Link 
                            href={`/redeem/${deal.id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            QR
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'redemptions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Redemptions</h2>
              <Link
                href="/merchant/redemptions"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Receipt className="w-4 h-4 mr-2" />
                View All Redemptions
              </Link>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-6 py-4">
                <div className="text-center">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Customer Redemptions</h3>
                  <p className="text-gray-600 mb-4">Scan QR codes and track customer redemptions</p>
                  <Link
                    href="/merchant/redemptions"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Go to Redemptions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'redeem' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Redeem Deals</h2>
              <Link
                href="/merchant/redeem"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Open QR Scanner
              </Link>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-6 py-4">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">QR Code Scanner</h3>
                  <p className="text-gray-600 mb-4">Scan customer QR codes to redeem deals in real-time</p>
                  <Link
                    href="/merchant/redeem"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Start Scanning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Performance</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <span className="text-lg font-semibold text-gray-900">{stats.averageRating}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Deals This Month</span>
                    <span className="text-lg font-semibold text-gray-900">{stats.dealsThisMonth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="text-lg font-semibold text-gray-900">${stats.revenueGenerated}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="w-4 h-4 mr-2 text-blue-500" />
                    {stats.activeDeals} active deals driving traffic
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    {stats.totalRedemptions} customers engaged this month
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    Revenue up from last month
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Detailed analytics coming soon</p>
                <p className="text-sm">Track your business performance, customer behavior, and revenue trends</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
