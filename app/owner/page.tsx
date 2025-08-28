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
  CheckCircle,
  Shield,
  Activity,
  Globe,
  Database
} from 'lucide-react';
import Link from 'next/link';

interface PlatformStats {
  totalMerchants: number;
  totalVenues: number;
  totalDeals: number;
  totalRedemptions: number;
  totalRevenue: number;
  activeDeals: number;
  pendingVerifications: number;
  platformHealth: 'healthy' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  type: 'merchant_signup' | 'deal_created' | 'redemption' | 'venue_verified' | 'payment_processed';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'critical';
  redis: 'healthy' | 'warning' | 'critical';
  api: 'healthy' | 'warning' | 'critical';
  uptime: number;
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    totalMerchants: 0,
    totalVenues: 0,
    totalDeals: 0,
    totalRedemptions: 0,
    totalRevenue: 0,
    activeDeals: 0,
    pendingVerifications: 0,
    platformHealth: 'healthy'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    redis: 'healthy',
    api: 'healthy',
    uptime: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'merchants' | 'platform' | 'analytics'>('overview');

  useEffect(() => {
    fetchOwnerData();
    fetchSystemHealth();
    
    // Refresh system health every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      // Fetch platform statistics
      const statsResponse = await fetch('/api/owner/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/owner/activity');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.activities || []);
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      // Check Redis health
      const redisResponse = await fetch('/api/health/redis');
      const redisHealth = redisResponse.ok ? 'healthy' : 'critical';

      // Check database health (simplified)
      const dbHealth = 'healthy'; // In real app, would check DB connection

      // Check API health
      const apiHealth = 'healthy'; // In real app, would check various endpoints

      setSystemHealth({
        database: dbHealth,
        redis: redisHealth,
        api: apiHealth,
        uptime: Date.now() // Simplified - would be actual uptime
      });
    } catch (error) {
      console.error('Error checking system health:', error);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'merchant_signup': return <Users className="w-4 h-4" />;
      case 'deal_created': return <Tag className="w-4 h-4" />;
      case 'redemption': return <CheckCircle className="w-4 h-4" />;
      case 'venue_verified': return <Shield className="w-4 h-4" />;
      case 'payment_processed': return <DollarSign className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
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
              <h1 className="text-3xl font-bold text-gray-900">Platform Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor platform health, manage merchants, and track performance</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/owner/merchants"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manage Merchants
              </Link>
              <Link 
                href="/owner/settings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Settings className="w-4 h-4 mr-2" />
                Platform Settings
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
              { id: 'merchants', label: 'Merchants', icon: Users },
              { id: 'platform', label: 'Platform', icon: Shield },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
            {/* Platform Health Alert */}
            {stats.platformHealth !== 'healthy' && (
              <div className={`bg-${stats.platformHealth === 'critical' ? 'red' : 'yellow'}-50 border border-${stats.platformHealth === 'critical' ? 'red' : 'yellow'}-200 rounded-lg p-4`}>
                <div className="flex">
                  <AlertCircle className={`h-5 w-5 text-${stats.platformHealth === 'critical' ? 'red' : 'yellow'}-400`} />
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium text-${stats.platformHealth === 'critical' ? 'red' : 'yellow'}-800`}>
                      Platform Health Alert
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>Platform is experiencing {stats.platformHealth === 'critical' ? 'critical' : 'warning'} issues. Please review system status.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Merchants</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalMerchants}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Venues</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalVenues}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Tag className="h-8 w-8 text-blue-600" />
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
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Platform Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">${stats.totalRevenue}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Health</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-3">
                    <Database className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Database</div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(systemHealth.database)}`}>
                        {getHealthIcon(systemHealth.database)}
                        <span className="ml-1 capitalize">{systemHealth.database}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Activity className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Redis Cache</div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(systemHealth.redis)}`}>
                        {getHealthIcon(systemHealth.redis)}
                        <span className="ml-1 capitalize">{systemHealth.redis}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">API</div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(systemHealth.api)}`}>
                        {getHealthIcon(systemHealth.api)}
                        <span className="ml-1 capitalize">{systemHealth.api}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Uptime</div>
                      <div className="text-sm text-gray-500">
                        {Math.floor(systemHealth.uptime / (1000 * 60 * 60))}h {Math.floor((systemHealth.uptime % (1000 * 60 * 60)) / (1000 * 60))}m
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Platform Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === 'success' ? 'bg-green-100 text-green-800' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    href="/owner/merchants"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Users className="h-6 w-6 text-indigo-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Manage Merchants</div>
                      <div className="text-sm text-gray-500">Review applications, verify businesses</div>
                    </div>
                  </Link>

                  <Link 
                    href="/owner/analytics"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Platform Analytics</div>
                      <div className="text-sm text-gray-500">View detailed performance metrics</div>
                    </div>
                  </Link>

                  <Link 
                    href="/owner/settings"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <Settings className="h-6 w-6 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Platform Settings</div>
                      <div className="text-sm text-gray-500">Configure system preferences</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'merchants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Merchant Management</h2>
              <Link 
                href="/owner/merchants"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Merchants
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Merchant management interface coming soon</p>
                <p className="text-sm">Review applications, verify businesses, and manage platform users</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'platform' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Platform Health & Monitoring</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Advanced platform monitoring coming soon</p>
                <p className="text-sm">Real-time alerts, performance metrics, and system diagnostics</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Comprehensive analytics dashboard coming soon</p>
                <p className="text-sm">Track platform growth, merchant performance, and revenue trends</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
