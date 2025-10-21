'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  Settings,
  Shield,
  Eye,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  totalMerchants: number;
  totalVenues: number;
  totalDeals: number;
  totalVouchers: number;
  totalRevenue: number;
  activeDeals: number;
  pendingApprovals: number;
  systemHealth: string;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  status: string;
}

interface Venue {
  id: string;
    name: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  merchant: {
    user: {
      firstName: string;
      lastName: string;
    email: string;
  };
  };
  deals: Array<{
  id: string;
    title: string;
    isActive: boolean;
  }>;
  _count: {
    deals: number;
    vouchers: number;
  };
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
    setLoading(true);
      const [statsRes, activityRes, venuesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/activity'),
        fetch('/api/admin/venues?status=all&limit=10')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivity(activityData);
      }

      if (venuesRes.ok) {
        const venuesData = await venuesRes.json();
        setVenues(venuesData.venues);
        }
      } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVenueAction = async (venueId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/venues', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueId, action }),
      });

      if (response.ok) {
        await fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-warning-600 bg-warning-100';
      case 'approved':
        return 'text-success-600 bg-success-100';
      case 'completed':
        return 'text-neutral-600 bg-neutral-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

    return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-purple-100">Manage your Happy Hour platform</p>
            </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Shield className="w-6 h-6" />
            </Button>
                      </div>
                    </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {loading ? '...' : stats?.totalUsers.toLocaleString() || 0}
                        </div>
              <div className="text-purple-100 text-sm">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {loading ? '...' : stats?.totalVenues || 0}
                              </div>
              <div className="text-purple-100 text-sm">Restaurants</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {loading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
                            </div>
              <div className="text-purple-100 text-sm">Total Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {loading ? '...' : stats?.activeDeals || 0}
                          </div>
              <div className="text-purple-100 text-sm">Active Deals</div>
            </CardContent>
          </Card>
                    </div>
              </div>
              
      {/* Tabs */}
      <div className="px-4 -mt-4">
        <Card>
          <div className="flex border-b border-neutral-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'restaurants', label: 'Restaurants' },
              { id: 'users', label: 'Users' },
              { id: 'approvals', label: 'Approvals' },
              { id: 'analytics', label: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap',
                  selectedTab === tab.id
                    ? 'text-purple-500 border-b-2 border-purple-500'
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                {tab.label}
              </button>
            ))}
            </div>
        </Card>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
          System Health
          </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchData}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {loading ? '...' : (stats?.systemHealth || 'excellent').charAt(0).toUpperCase() + (stats?.systemHealth || 'excellent').slice(1)}
                      </div>
                    <div className="text-sm text-neutral-600">
                      All systems operational
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
              </CardContent>
            </Card>

                {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {loading ? (
                    <div className="p-4 text-center text-neutral-500">
                      Loading activity...
                  </div>
                  ) : activity.length === 0 ? (
                    <div className="p-4 text-center text-neutral-500">
                      No recent activity
                        </div>
                  ) : (
                    activity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border-b border-neutral-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            getStatusColor(activity.status)
                          )}>
                            {getStatusIcon(activity.status)}
                  </div>
                              <div>
                            <div className="font-medium text-neutral-900">
                              {activity.message}
                                </div>
                            <div className="text-sm text-neutral-500">
                              {activity.time}
                              </div>
                                </div>
                              </div>
                        <div className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          getStatusColor(activity.status)
                        )}>
                          {activity.status}
                              </div>
                      </motion.div>
                    ))
                  )}
                  </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Restaurants Tab */}
        {selectedTab === 'restaurants' && (
          <motion.div
            key="restaurants"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Restaurants</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={fetchData} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
                </div>
                      </div>
                      
            {loading ? (
              <div className="text-center py-8 text-neutral-500">
                Loading restaurants...
                        </div>
            ) : venues.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No restaurants found
                        </div>
            ) : (
              venues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                              <div>
                            <h3 className="font-semibold text-neutral-900">
                              {venue.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-neutral-600">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {venue.merchant.user.firstName} {venue.merchant.user.lastName}
                              </span>
                              <span className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {venue._count.deals} deals
                              </span>
                              <span className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {venue._count.vouchers} vouchers
                              </span>
                              </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                venue.isApproved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {venue.isApproved ? 'Approved' : 'Pending'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                venue.isActive 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {venue.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                        </div>
                      </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVenueAction(venue.id, venue.isApproved ? 'reject' : 'approve')}
                          >
                            {venue.isApproved ? 'Reject' : 'Approve'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVenueAction(venue.id, venue.isActive ? 'suspend' : 'activate')}
                          >
                            {venue.isActive ? 'Suspend' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Approvals Tab */}
        {selectedTab === 'approvals' && (
          <motion.div
            key="approvals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
                    <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pending Approvals</h2>
              <div className="text-sm text-neutral-600">
                {loading ? '...' : stats?.pendingApprovals || 0} items pending
                      </div>
                    </div>

            {loading ? (
              <div className="text-center py-8 text-neutral-500">
                Loading approvals...
                      </div>
            ) : venues.filter(v => !v.isApproved).length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No pending approvals
                    </div>
            ) : (
              venues.filter(v => !v.isApproved).map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                          <h3 className="font-semibold text-neutral-900">
                            {venue.name}
            </h3>
                          <p className="text-sm text-neutral-600">
                            Restaurant Application
                          </p>
                          <p className="text-xs text-neutral-500">
                            Merchant: {venue.merchant.user.firstName} {venue.merchant.user.lastName} ({venue.merchant.user.email})
                          </p>
                          <p className="text-xs text-neutral-500">
                            Submitted: {new Date(venue.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                              Pending Approval
                      </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {venue._count.deals} deals
                        </span>
                      </div>
                    </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVenueAction(venue.id, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVenueAction(venue.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                    </div>
                    </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Other tabs would have similar structure */}
        {selectedTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4">User Management</h2>
            <p className="text-neutral-600">Manage platform users and their accounts</p>
          </motion.div>
        )}

        {selectedTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4">Platform Analytics</h2>
            <p className="text-neutral-600">View detailed analytics and insights</p>
          </motion.div>
        )}
                  </div>
    </div>
  );
}