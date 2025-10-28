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
  Mail
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-access');
    }
  }, [status, router]);

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (selectedTab === 'merchants' || selectedTab === 'overview') {
        const res = await fetch('/api/admin/merchants');
        if (res.ok) {
          const data = await res.json();
          setMerchants(data.merchants || []);
        }
      }
      
      if (selectedTab === 'users') {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      }
      
      if (selectedTab === 'deals') {
        const res = await fetch('/api/admin/deals');
        if (res.ok) {
          const data = await res.json();
          setDeals(data.deals || []);
        }
      }

      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
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
      }
    } catch (error) {
      alert('Failed to reject merchant');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'merchants', label: 'Merchants', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'deals', label: 'Deals', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-purple-100 mt-1">Manage OrderHappyHour platform</p>
            </div>
            <div className="flex items-center gap-4">
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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
              { label: 'Merchants', value: stats?.totalMerchants || 0, icon: Building2, color: 'green' },
              { label: 'Active Deals', value: stats?.activeDeals || 0, icon: ShoppingCart, color: 'orange' },
              { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'purple' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">{stat.label}</p>
                      <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
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
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap',
                    selectedTab === tab.id
                      ? 'border-purple-600 text-purple-600 font-semibold bg-purple-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <OverviewTab stats={stats} merchants={merchants} loading={loading} />
            )}
            {selectedTab === 'merchants' && (
              <MerchantsTab merchants={merchants} onApprove={handleApproveMerchant} onReject={handleRejectMerchant} loading={loading} />
            )}
            {selectedTab === 'users' && (
              <UsersTab users={users} loading={loading} />
            )}
            {selectedTab === 'deals' && (
              <DealsTab deals={deals} loading={loading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats, merchants, loading }: { stats: any, merchants: any[], loading: boolean }) {
  const pendingMerchants = merchants.filter(m => m.status === 'PENDING').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-900 mb-2">{stats?.pendingMerchants || 0}</div>
          <p className="text-sm text-yellow-700">Merchants awaiting approval</p>
        </div>

        {/* Active Deals */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Deals</h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900 mb-2">{stats?.activeDeals || 0}</div>
          <p className="text-sm text-green-700">Currently available deals</p>
        </div>
      </div>

      {/* Recent Pending Merchants */}
      {pendingMerchants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Pending Merchants</h3>
          <div className="space-y-3">
            {pendingMerchants.map((merchant) => (
              <div key={merchant.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{merchant.businessName}</h4>
                    <p className="text-sm text-gray-600">{merchant.contactEmail}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    PENDING
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MerchantsTab({ merchants, onApprove, onReject, loading }: any) {
  const [filter, setFilter] = useState('ALL');

  const filteredMerchants = merchants.filter((m: any) => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
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

      {/* Merchants List */}
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
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{merchant.businessName}</h4>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      merchant.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      merchant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    )}>
                      {merchant.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{merchant.contactEmail}</p>
                  {merchant.address && (
                    <p className="text-sm text-gray-500 mt-1">{merchant.address}</p>
                  )}
                </div>
                {merchant.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApprove(merchant.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab({ users, loading }: any) {
  return (
    <div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        <div className="space-y-3">
          {users.map((user: any) => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DealsTab({ deals, loading }: any) {
  return (
    <div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading deals...</div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No deals found</div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal: any) => (
            <div key={deal.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                  <p className="text-sm text-gray-600">{deal.description}</p>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  deal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                )}>
                  {deal.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
