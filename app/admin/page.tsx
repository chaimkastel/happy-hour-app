'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Users, 
  Building2, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Shield,
  Eye,
  Edit,
  X,
  Search,
  Filter,
  Download,
  RefreshCw,
  LogOut,
  BarChart3,
  User,
  Mail,
  Activity,
  Zap,
  Lock,
  Unlock,
  Play,
  Pause,
  Ban,
  Trash2,
  Plus,
  LineChart,
  PieChart,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  totalMerchants: number;
  totalDeals: number;
  totalRevenue: number;
  activeDeals: number;
  pendingMerchants: number;
  totalVouchers: number;
  averageRevenue: number;
  growthRate: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-access');
    }
  }, [status, router]);

  useEffect(() => {
    fetchData();
  }, [selectedTab, isDemoMode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const queries = [];
      
      if (selectedTab === 'merchants' || selectedTab === 'overview') {
        queries.push(fetch('/api/admin/merchants').then(res => res.json()));
      }
      
      if (selectedTab === 'users') {
        queries.push(fetch('/api/admin/users').then(res => res.json()));
      }
      
      if (selectedTab === 'deals') {
        queries.push(fetch('/api/admin/deals').then(res => res.json()));
      }

      queries.push(fetch('/api/admin/stats').then(res => res.json()));

      const results = await Promise.all(queries);

      if (results[0] && results[0].merchants) setMerchants(results[0].merchants || []);
      if (results[1] && results[1].users) setUsers(results[1].users || []);
      if (results[2] && results[2].deals) setDeals(results[2].deals || []);
      if (results.find(r => r.totalUsers !== undefined)) setStats(results.find(r => r.totalUsers !== undefined));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMerchant = async (merchantId: string) => {
    if (!confirm('Approve this merchant?')) return;

    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchData();
        alert('Merchant approved successfully!');
      }
    } catch (error) {
      alert('Failed to approve merchant');
    }
  };

  const handleRejectMerchant = async (merchantId: string, reason: string) => {
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        await fetchData();
        alert('Merchant rejected');
      }
    } catch (error) {
      alert('Failed to reject merchant');
    }
  };

  const handleSuspendMerchant = async (merchantId: string) => {
    if (!confirm('Suspend this merchant? They will not be able to access their account.')) return;

    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SUSPENDED' }),
      });
      if (res.ok) {
        await fetchData();
        alert('Merchant suspended');
      }
    } catch (error) {
      alert('Failed to suspend merchant');
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Delete this deal? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/deals/${dealId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchData();
        alert('Deal deleted');
      }
    } catch (error) {
      alert('Failed to delete deal');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <motion.div
          className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'merchants', label: 'Merchants', icon: Building2, badge: stats?.pendingMerchants },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'deals', label: 'Deals', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-purple-100 mt-1">Complete platform control center</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Demo Mode Toggle */}
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={cn(
                  'px-4 py-2 rounded-lg font-semibold text-sm transition-all',
                  isDemoMode 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
              >
                {isDemoMode ? <><Pause className="w-4 h-4 inline mr-2" /> Demo Mode ON</> : <><Play className="w-4 h-4 inline mr-2" /> Demo Mode OFF</>}
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Demo Mode Banner */}
          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500 text-white rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-6 h-6" />
              <div>
                <strong>DEMO MODE ACTIVE</strong>
                <p className="text-sm">Showing demo data for investor presentations</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDemoMode(false)}
                className="ml-auto text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue', trend: stats?.growthRate || 0 },
              { label: 'Merchants', value: stats?.totalMerchants || 0, icon: Building2, color: 'green', badge: stats?.pendingMerchants },
              { label: 'Active Deals', value: stats?.activeDeals || 0, icon: ShoppingCart, color: 'orange' },
              { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'purple', trend: 15.2 },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 relative"
                >
                  {stat.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {stat.badge}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">{stat.label}</p>
                      <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                      {stat.trend !== undefined && (
                        <div className="flex items-center gap-1 mt-1">
                          {stat.trend >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-300" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-300" />
                          )}
                          <span className="text-xs text-purple-100">{formatPercent(stat.trend)}</span>
                        </div>
                      )}
                    </div>
                    <Icon className="w-8 h-8 text-white opacity-80" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap relative',
                    selectedTab === tab.id
                      ? 'border-purple-600 text-purple-600 font-semibold bg-purple-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${selectedTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <OverviewTab stats={stats} merchants={merchants} loading={loading} isDemoMode={isDemoMode} />
            )}
            {selectedTab === 'merchants' && (
              <MerchantsTab merchants={merchants} onApprove={handleApproveMerchant} onReject={handleRejectMerchant} onSuspend={handleSuspendMerchant} loading={loading} searchTerm={searchTerm} />
            )}
            {selectedTab === 'users' && (
              <UsersTab users={users} loading={loading} searchTerm={searchTerm} />
            )}
            {selectedTab === 'deals' && (
              <DealsTab deals={deals} onDelete={handleDeleteDeal} loading={loading} searchTerm={searchTerm} />
            )}
            {selectedTab === 'analytics' && (
              <AnalyticsTab stats={stats} loading={loading} />
            )}
            {selectedTab === 'security' && (
              <SecurityTab session={session} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats, merchants, loading, isDemoMode }: any) {
  const pendingMerchants = merchants.filter((m: any) => m.status === 'PENDING').slice(0, 5);

  return (
    <div className="space-y-6">
      {isDemoMode && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-bold text-purple-900">Demo Mode Active</h3>
              <p className="text-purple-700">Showing demo data for investor presentations</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-900 mb-2">{stats?.pendingMerchants || 0}</div>
          <p className="text-sm text-yellow-700">Merchants awaiting approval</p>
          {pendingMerchants.length > 0 && (
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Review Pending
            </Button>
          )}
        </div>

        {/* System Health */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900 mb-2">100%</div>
          <p className="text-sm text-green-700">All systems operational</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Activity className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">System running normally</p>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New user registered</p>
              <p className="text-xs text-gray-500">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Building2 className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Merchant approved</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MerchantsTab({ merchants, onApprove, onReject, onSuspend, loading, searchTerm }: any) {
  const [filter, setFilter] = useState('ALL');

  const filteredMerchants = merchants
    .filter((m: any) => {
      if (filter === 'ALL') return true;
      return m.status === filter;
    })
    .filter((m: any) => {
      const search = searchTerm.toLowerCase();
      return m.businessName?.toLowerCase().includes(search) || 
             m.contactEmail?.toLowerCase().includes(search);
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {filteredMerchants.length} merchants
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading merchants...</div>
      ) : filteredMerchants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No merchants found</div>
      ) : (
        <div className="space-y-3">
          {filteredMerchants.map((merchant: any) => (
            <div key={merchant.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{merchant.businessName}</h4>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      merchant.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      merchant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      merchant.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {merchant.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{merchant.contactEmail}</p>
                  {merchant.address && (
                    <p className="text-sm text-gray-500 mt-1">{merchant.address}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {merchant.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onApprove(merchant.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) onReject(merchant.id, reason);
                        }}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {merchant.status === 'APPROVED' && (
                    <Button
                      size="sm"
                      onClick={() => onSuspend(merchant.id)}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      Suspend
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab({ users, loading, searchTerm }: any) {
  const filteredUsers = users.filter((u: any) => {
    const search = searchTerm.toLowerCase();
    return u.firstName?.toLowerCase().includes(search) || 
           u.lastName?.toLowerCase().includes(search) ||
           u.email?.toLowerCase().includes(search);
  });

  return (
    <div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500">Total Users: {filteredUsers.length}</h3>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
          {filteredUsers.map((user: any) => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'MERCHANT' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  )}>
                    {user.role}
                  </span>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Ban className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DealsTab({ deals, onDelete, loading, searchTerm }: any) {
  const filteredDeals = deals.filter((d: any) => {
    const search = searchTerm.toLowerCase();
    return d.title?.toLowerCase().includes(search) || 
           d.description?.toLowerCase().includes(search);
  });

  return (
    <div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading deals...</div>
      ) : filteredDeals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No deals found</div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500">Total Deals: {filteredDeals.length}</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Deal
            </Button>
          </div>
          {filteredDeals.map((deal: any) => (
            <div key={deal.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      deal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    )}>
                      {deal.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{deal.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{deal.percentOff}% off</span>
                    <span>{deal.redemptionCount || 0} redemptions</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(deal.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsTab({ stats, loading }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-green-600 text-sm font-semibold">+12.5%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Revenue Growth</h3>
          <p className="text-2xl font-bold text-gray-900">$45,230</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-green-600 text-sm font-semibold">+8.3%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">User Growth</h3>
          <p className="text-2xl font-bold text-gray-900">1,234</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <span className="text-green-600 text-sm font-semibold">+15.7%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Deal Activity</h3>
          <p className="text-2xl font-bold text-gray-900">89 active</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average deal value</span>
            <span className="font-semibold text-gray-900">$24.50</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Redemption rate</span>
            <span className="font-semibold text-gray-900">67%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Merchant satisfaction</span>
            <span className="font-semibold text-green-600">4.8/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityTab({ session }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">SSL/TLS Encryption</h4>
              <p className="text-sm text-gray-600">All connections are encrypted</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Database Backup</h4>
              <p className="text-sm text-gray-600">Automated daily backups</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Session</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email</span>
            <span className="font-semibold text-gray-900">{session?.user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Role</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
              {session?.user?.role || 'ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
