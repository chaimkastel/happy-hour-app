'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Building2, CreditCard, BarChart3, Settings, Shield, Eye, EyeOff, Plus, Edit, Trash2, Search, Filter, Download, Upload, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, MapPin, Star, Heart, MessageSquare, Power, Lock, Unlock, Globe, Database, Server, Activity, Zap, AlertCircle, Ban, UserCheck, UserX, Pause, Play, RefreshCw, Bell, BellOff, FileText, ThumbsUp, ThumbsDown, Mail, Phone, Calendar, X } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'MERCHANT' | 'ADMIN';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  dealsCount?: number;
  venuesCount?: number;
}

interface Merchant {
  id: string;
  email: string;
  businessName: string;
  contactName: string;
  phone?: string;
  address?: string;
  subscription: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  isActive: boolean;
  createdAt: string;
  dealsCount: number;
  venuesCount: number;
  totalRevenue?: number;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  status: 'DRAFT' | 'LIVE' | 'PAUSED' | 'EXPIRED';
  startAt: string;
  endAt: string;
  maxRedemptions: number;
  redeemedCount: number;
  venue: {
    name: string;
    businessType: string;
  };
  merchant: {
    businessName: string;
    email: string;
  };
}

interface MerchantApplication {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  businessType: string;
  description: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  documents?: {
    businessLicense?: string;
    taxId?: string;
    insurance?: string;
  };
  notes?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'merchants' | 'deals' | 'dealReview' | 'settings' | 'safety' | 'analytics' | 'applications' | 'monitoring' | 'health'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pendingDeals, setPendingDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [merchantApplications, setMerchantApplications] = useState<MerchantApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<MerchantApplication | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '', adminPassword: '' });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Website Safety Controls
  const [websiteStatus, setWebsiteStatus] = useState<'online' | 'maintenance' | 'emergency'>('online');
  const [maintenanceMessage, setMaintenanceMessage] = useState('We are currently performing scheduled maintenance. We will be back online shortly.');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [userRegistrationEnabled, setUserRegistrationEnabled] = useState(true);
  const [merchantOnboardingEnabled, setMerchantOnboardingEnabled] = useState(true);
  const [dealCreationEnabled, setDealCreationEnabled] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState<string[]>([]);
  const [securityLevel, setSecurityLevel] = useState<'normal' | 'high' | 'maximum'>('normal');
  
  // Analytics
  const [systemMetrics, setSystemMetrics] = useState({
    activeUsers: 1247,
    serverLoad: 23,
    responseTime: 145,
    errorRate: 0.2,
    uptime: 99.9
  });

  // Check admin authentication
  useEffect(() => {
    const checkAdminAuth = () => {
      // Only run on client side
      if (typeof window !== 'undefined') {
        const isAuthenticated = localStorage.getItem('admin-authenticated') === 'true';
        setIsAdminAuthenticated(isAuthenticated);
        setAuthLoading(false);
        
        if (!isAuthenticated) {
          // Redirect to admin access page
          router.push('/admin-access');
        }
      }
    };

    checkAdminAuth();
  }, []);

  // Fetch real data from APIs
  useEffect(() => {
    fetchUsers();
    fetchMerchants();
    fetchDeals();
    fetchApplications();
    fetchNotifications();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadNotifications(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMerchants = async () => {
    try {
      const response = await fetch('/api/admin/merchants');
      if (response.ok) {
        const data = await response.json();
        setMerchants(data.merchants);
      }
    } catch (error) {
      console.error('Error fetching merchants:', error);
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      if (response.ok) {
        const data = await response.json();
        setMerchantApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Fetch pending deals when dealReview tab is active
  useEffect(() => {
    if (activeTab === 'dealReview') {
      fetchPendingDeals();
    } else if (activeTab === 'health') {
      fetchHealthData();
    } else if (activeTab === 'analytics') {
      fetchAnalyticsData();
    } else if (activeTab === 'monitoring') {
      fetchMonitoringData();
    }
  }, [activeTab]);

  // Auto-refresh for monitoring tabs
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (activeTab === 'health') {
        fetchHealthData();
      } else if (activeTab === 'monitoring') {
        fetchMonitoringData();
      } else if (activeTab === 'analytics') {
        fetchAnalyticsData();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [activeTab, autoRefresh]);

  const stats = {
    totalUsers: users.length,
    totalMerchants: merchants.length,
    totalDeals: deals.length,
    activeDeals: deals.filter(d => d.status === 'LIVE').length,
    totalRevenue: merchants.reduce((sum, m) => sum + (m.totalRevenue || 0), 0),
    avgDealsPerMerchant: merchants.length > 0 ? Math.round(merchants.reduce((sum, m) => sum + m.dealsCount, 0) / merchants.length) : 0
  };

  const handleCreateUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        await fetchUsers(); // Refresh users list
        setShowCreateModal(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          isActive: !user.isActive
        })
      });

      if (response.ok) {
        await fetchUsers(); // Refresh users list
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users?userId=${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message);
          await fetchUsers(); // Refresh users list
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user');
      }
    }
  };

  // Safety Control Functions
  const handleWebsiteStatusChange = async (status: 'online' | 'maintenance' | 'emergency') => {
    setLoading(true);
    try {
      // API call to update website status
      console.log('Updating website status to:', status);
      setWebsiteStatus(status);
      
      if (status === 'emergency') {
        setEmergencyMode(true);
        setSystemAlerts(prev => [...prev, `Emergency mode activated at ${new Date().toLocaleString()}`]);
      } else if (status === 'maintenance') {
        setSystemAlerts(prev => [...prev, `Maintenance mode activated at ${new Date().toLocaleString()}`]);
      } else {
        setEmergencyMode(false);
        setSystemAlerts(prev => [...prev, `Website restored to online at ${new Date().toLocaleString()}`]);
      }
    } catch (error) {
      console.error('Error updating website status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityLevelChange = async (level: 'normal' | 'high' | 'maximum') => {
    setLoading(true);
    try {
      console.log('Updating security level to:', level);
      setSecurityLevel(level);
      setSystemAlerts(prev => [...prev, `Security level changed to ${level.toUpperCase()} at ${new Date().toLocaleString()}`]);
    } catch (error) {
      console.error('Error updating security level:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (feature: string, enabled: boolean) => {
    setLoading(true);
    try {
      console.log(`Toggling ${feature} to:`, enabled);
      switch (feature) {
        case 'userRegistration':
          setUserRegistrationEnabled(enabled);
          break;
        case 'merchantOnboarding':
          setMerchantOnboardingEnabled(enabled);
          break;
        case 'dealCreation':
          setDealCreationEnabled(enabled);
          break;
      }
      setSystemAlerts(prev => [...prev, `${feature} ${enabled ? 'enabled' : 'disabled'} at ${new Date().toLocaleString()}`]);
    } catch (error) {
      console.error(`Error toggling ${feature}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const clearSystemAlerts = () => {
    setSystemAlerts([]);
  };

  // Deal Review Functions
  const fetchPendingDeals = async () => {
    try {
      const response = await fetch('/api/admin/deals?status=PENDING_APPROVAL');
      if (response.ok) {
        const data = await response.json();
        setPendingDeals(data.deals);
      }
    } catch (error) {
      console.error('Error fetching pending deals:', error);
    }
  };

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/admin/health');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch('/api/admin/monitoring');
      if (response.ok) {
        const data = await response.json();
        setMonitoringData(data);
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  const handleDealApproval = async (dealId: string, status: 'LIVE' | 'REJECTED', adminNotes?: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/deals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, status, adminNotes })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh pending deals
        await fetchPendingDeals();
        setSelectedDeal(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      alert('An error occurred while updating the deal');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationApproval = async (applicationId: string, status: 'APPROVED' | 'REJECTED', adminNotes?: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status, adminNotes })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh applications
        await fetchApplications();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('An error occurred while updating the application');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (!selectedUser) return;

    try {
      setLoading(true);
      const response = await fetch('/api/admin/passwords', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: passwordData.newPassword,
          adminPassword: passwordData.adminPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setShowPasswordModal(false);
        setPasswordData({ newPassword: '', confirmPassword: '', adminPassword: '' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing the password');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.user);
        setShowUserDetailsModal(true);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('An error occurred while fetching user details');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-slate-600 dark:text-slate-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Admin Access Required</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You need to log in with admin credentials to access this dashboard.
          </p>
          <button
            onClick={() => router.push('/admin-access')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage users, merchants, and platform settings</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                        <button
                          onClick={() => {
                            // Mark all as read
                            fetch('/api/admin/notifications', { method: 'PUT', body: JSON.stringify({ read: true }) });
                            setUnreadNotifications(0);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => {
                              // Mark as read
                              fetch('/api/admin/notifications', { 
                                method: 'PUT', 
                                body: JSON.stringify({ id: notification.id, read: true }) 
                              });
                              setUnreadNotifications(Math.max(0, unreadNotifications - 1));
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.priority === 'urgent' ? 'bg-red-500' :
                                notification.priority === 'high' ? 'bg-orange-500' :
                                notification.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900 dark:text-white text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4" />
                Admin Access
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('admin-authenticated');
                  router.push('/admin-access');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'users'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Users className="w-5 h-5" />
                Users ({stats.totalUsers})
              </button>
              <button
                onClick={() => setActiveTab('merchants')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'merchants'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Building2 className="w-5 h-5" />
                Merchants ({stats.totalMerchants})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'applications'
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <FileText className="w-5 h-5" />
                Applications ({merchantApplications.filter(app => app.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'deals'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Deals ({stats.totalDeals})
              </button>
                      <button
          onClick={() => setActiveTab('dealReview')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'dealReview'
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-5 h-5" />
          Deal Review
        </button>
        
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'monitoring'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Activity className="w-5 h-5" />
          Real-time Monitoring
        </button>
        
        <button
          onClick={() => setActiveTab('health')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'health'
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Server className="w-5 h-5" />
          System Health
        </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'safety'
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Shield className="w-5 h-5" />
                Safety Controls
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Activity className="w-5 h-5" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Merchants</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalMerchants}</p>
                      </div>
                      <Building2 className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Deals</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeDeals}</p>
                      </div>
                      <CreditCard className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-white">New merchant registered: Jane's Italian Bistro</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-white">Deal created: Happy Hour Special</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-900 dark:text-white">User signed up: john@example.com</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Users Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">User Management</h2>
                    <p className="text-slate-600 dark:text-slate-400">Manage user accounts and permissions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add User
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contributions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {users
                          .filter(user => 
                            searchQuery === '' || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (user.merchant?.businessName && user.merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
                          )
                          .map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" onClick={() => handleViewUserDetails(user.id)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {user.merchant?.businessName || user.email.split('@')[0]}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                                {user.phone && (
                                  <div className="text-xs text-slate-400">{user.phone}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                user.role === 'MERCHANT' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                              {user.merchant?.kycStatus && (
                                <div className="mt-1">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.merchant.kycStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    user.merchant.kycStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {user.merchant.kycStatus}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                              <div className="space-y-1">
                                <div>Deals: {user.dealsCount || 0}</div>
                                <div>Venues: {user.venuesCount || 0}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setShowUserDetailsModal(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setShowPasswordModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Change Password"
                                >
                                  <Lock className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                  }}
                                  className="text-yellow-600 hover:text-yellow-900"
                                  title="Edit User"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleUserStatus(user.id);
                                  }}
                                  className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                  title={user.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.id);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'merchants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Merchant Management</h2>
                    <p className="text-slate-600 dark:text-slate-400">Manage merchant accounts and subscriptions</p>
                  </div>
                </div>

                {/* Merchants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {merchants.map((merchant) => (
                    <div key={merchant.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{merchant.businessName}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{merchant.contactName}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          merchant.subscription === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                          merchant.subscription === 'PREMIUM' ? 'bg-blue-100 text-blue-800' :
                          merchant.subscription === 'BASIC' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {merchant.subscription}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {merchant.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CreditCard className="w-4 h-4" />
                          {merchant.dealsCount} active deals
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Building2 className="w-4 h-4" />
                          {merchant.venuesCount} venues
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <DollarSign className="w-4 h-4" />
                          ${merchant.totalRevenue?.toLocaleString()} revenue
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                          View Details
                        </button>
                        <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Merchant Applications</h2>
                    <p className="text-slate-600 dark:text-slate-400">Review and approve new merchant applications</p>
                  </div>
                  <button
                    onClick={fetchApplications}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Refresh
                  </button>
                </div>

                {/* Applications Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {merchantApplications.map((application) => (
                    <div key={application.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{application.businessName}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{application.contactName}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="w-4 h-4" />
                          {application.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="w-4 h-4" />
                          {application.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {application.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Building2 className="w-4 h-4" />
                          {application.businessType}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          Applied: {new Date(application.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {application.description}
                      </p>

                      {application.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApplicationApproval(application.id, 'APPROVED')}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApplicationApproval(application.id, 'REJECTED')}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {merchantApplications.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Applications</h3>
                    <p className="text-slate-600 dark:text-slate-400">No merchant applications to review at this time.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Deal Management</h2>
                    <p className="text-slate-600 dark:text-slate-400">Monitor and manage all platform deals</p>
                  </div>
                </div>

                {/* Deals Table */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Merchant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Redemptions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {deals.map((deal) => (
                          <tr key={deal.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{deal.title}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{deal.percentOff}% off</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{deal.merchant.businessName}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{deal.venue.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                deal.status === 'LIVE' ? 'bg-green-100 text-green-800' :
                                deal.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                                deal.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {deal.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                              {deal.redeemedCount} / {deal.maxRedemptions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-yellow-600 hover:text-yellow-900">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Safety Controls</h2>
                  <p className="text-slate-600 dark:text-slate-400">Emergency controls and website safety management</p>
                </div>

                {/* Website Status Control */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-3 h-3 rounded-full ${
                      websiteStatus === 'online' ? 'bg-green-500' :
                      websiteStatus === 'maintenance' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Website Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      websiteStatus === 'online' ? 'bg-green-100 text-green-800' :
                      websiteStatus === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {websiteStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                      onClick={() => handleWebsiteStatusChange('online')}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        websiteStatus === 'online'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-900 dark:text-white">Online</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Normal operation</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleWebsiteStatusChange('maintenance')}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        websiteStatus === 'maintenance'
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-yellow-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-900 dark:text-white">Maintenance</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Scheduled maintenance</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleWebsiteStatusChange('emergency')}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        websiteStatus === 'emergency'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-900 dark:text-white">Emergency</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Emergency shutdown</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {websiteStatus === 'maintenance' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Maintenance Message
                      </label>
                      <textarea
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter maintenance message..."
                      />
                    </div>
                  )}
                </div>

                {/* Security Level Control */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Security Level</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleSecurityLevelChange('normal')}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        securityLevel === 'normal'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="font-semibold text-slate-900 dark:text-white">Normal</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Standard security</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSecurityLevelChange('high')}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        securityLevel === 'high'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-center">
                        <Lock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                        <div className="font-semibold text-slate-900 dark:text-white">High</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Enhanced security</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSecurityLevelChange('maximum')}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        securityLevel === 'maximum'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                      }`}
                    >
                      <div className="text-center">
                        <Ban className="w-8 h-8 mx-auto mb-2 text-red-500" />
                        <div className="font-semibold text-slate-900 dark:text-white">Maximum</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Lockdown mode</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Feature Controls</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">User Registration</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow new users to register</p>
                      </div>
                      <button
                        onClick={() => handleToggleFeature('userRegistration', !userRegistrationEnabled)}
                        disabled={loading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          userRegistrationEnabled ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            userRegistrationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">Merchant Onboarding</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow new merchants to join</p>
                      </div>
                      <button
                        onClick={() => handleToggleFeature('merchantOnboarding', !merchantOnboardingEnabled)}
                        disabled={loading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          merchantOnboardingEnabled ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            merchantOnboardingEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">Deal Creation</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow merchants to create deals</p>
                      </div>
                      <button
                        onClick={() => handleToggleFeature('dealCreation', !dealCreationEnabled)}
                        disabled={loading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          dealCreationEnabled ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            dealCreationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Alerts</h3>
                    <button
                      onClick={clearSystemAlerts}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {systemAlerts.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No system alerts</p>
                    ) : (
                      systemAlerts.map((alert, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-700 dark:text-slate-300">{alert}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">System Analytics</h2>
                    <p className="text-slate-600 dark:text-slate-400">Real-time system performance and metrics</p>
                  </div>
                  <button
                    onClick={() => {
                      fetchAnalyticsData();
                      fetchHealthData();
                      fetchMonitoringData();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Refresh
                  </button>
                </div>

                {/* System Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{systemMetrics.activeUsers.toLocaleString()}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Server Load</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{systemMetrics.serverLoad}%</p>
                      </div>
                      <Server className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Response Time</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{systemMetrics.responseTime}ms</p>
                      </div>
                      <Zap className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{systemMetrics.uptime}%</p>
                      </div>
                      <Activity className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Overview</h3>
                  <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400">Performance chart would be displayed here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Platform Settings</h2>
                  <p className="text-slate-600 dark:text-slate-400">Configure platform-wide settings and preferences</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">Platform Maintenance Mode</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enable maintenance mode to temporarily disable the platform</p>
                      </div>
                      <button className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg text-sm">
                        Disabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">New User Registration</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow new users to register on the platform</p>
                      </div>
                      <button className="bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm">
                        Enabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">Merchant Onboarding</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow new merchants to join the platform</p>
                      </div>
                      <button className="bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm">
                        Enabled
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateUser({
                email: formData.get('email') as string,
                name: formData.get('name') as string,
                role: formData.get('role') as 'USER' | 'MERCHANT' | 'ADMIN'
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  name="role"
                  required
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="USER">User</option>
                  <option value="MERCHANT">Merchant</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Change Password for {selectedUser.email}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Password</label>
                <input
                  type="password"
                  value={passwordData.adminPassword}
                  onChange={(e) => setPasswordData({...passwordData, adminPassword: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your admin password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ newPassword: '', confirmPassword: '', adminPassword: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && userDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                User Details: {userDetails.email}
              </h3>
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {userDetails.email}</div>
                    <div><span className="font-medium">Phone:</span> {userDetails.phone || 'Not provided'}</div>
                    <div><span className="font-medium">Role:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        userDetails.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        userDetails.role === 'MERCHANT' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {userDetails.role}
                      </span>
                    </div>
                    <div><span className="font-medium">Joined:</span> {new Date(userDetails.createdAt).toLocaleDateString()}</div>
                    <div><span className="font-medium">Last Updated:</span> {new Date(userDetails.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Merchant Information */}
                {userDetails.merchant && (
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Business Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Business Name:</span> {userDetails.merchant.businessName}</div>
                      <div><span className="font-medium">KYC Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          userDetails.merchant.kycStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          userDetails.merchant.kycStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {userDetails.merchant.kycStatus}
                        </span>
                      </div>
                      <div><span className="font-medium">Subscription:</span> {userDetails.merchant.subscription}</div>
                    </div>
                  </div>
                )}

                {/* Contributions */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Contributions</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{userDetails.contributions.totalDeals}</div>
                      <div className="text-slate-600 dark:text-slate-400">Total Deals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{userDetails.contributions.activeDeals}</div>
                      <div className="text-slate-600 dark:text-slate-400">Active Deals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{userDetails.contributions.totalRedemptions}</div>
                      <div className="text-slate-600 dark:text-slate-400">Redemptions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{userDetails.contributions.venuesCount}</div>
                      <div className="text-slate-600 dark:text-slate-400">Venues</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Recent Activity</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userDetails.recentActivity.length > 0 ? (
                      userDetails.recentActivity.map((activity: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-2 bg-white dark:bg-slate-600 rounded">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'deal_created' ? 'bg-blue-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {activity.description}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                            {activity.details && (
                              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                {activity.details.venueName && `Venue: ${activity.details.venueName}`}
                                {activity.details.percentOff && ` • ${activity.details.percentOff}% off`}
                                {activity.details.redeemerEmail && ` • Redeemed by: ${activity.details.redeemerEmail}`}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-500 dark:text-slate-400 py-4">
                        No recent activity
                      </div>
                    )}
                  </div>
                </div>

                {/* Venues */}
                {userDetails.merchant?.venues && userDetails.merchant.venues.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Venues</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {userDetails.merchant.venues.map((venue: any) => (
                        <div key={venue.id} className="p-3 bg-white dark:bg-slate-600 rounded">
                          <div className="font-medium text-slate-900 dark:text-white">{venue.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{venue.address}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {venue.dealsCount} deals • Rating: {venue.rating || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">System Health</h2>
              <p className="text-slate-600 dark:text-slate-400">Database and system health monitoring</p>
            </div>
            <button
              onClick={fetchHealthData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Check Health
            </button>
          </div>

          {healthData ? (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className={`p-6 rounded-lg border-2 ${
                healthData.overall?.status === 'healthy' 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
              }`}>
                <div className="flex items-center">
                  {healthData.overall?.status === 'healthy' ? (
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {healthData.overall?.status === 'healthy' ? 'System Healthy' : 'System Issues Detected'}
                    </h3>
                    <p className="text-sm opacity-75">{healthData.overall?.message}</p>
                  </div>
                </div>
              </div>

              {/* Database Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold mb-4">Database Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        healthData.database?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {healthData.database?.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span>{healthData.database?.responseTime}ms</span>
                    </div>
                    {healthData.database?.error && (
                      <div className="text-red-600 text-sm">
                        Error: {healthData.database.error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold mb-4">Database Stats</h3>
                  {healthData.database?.stats ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span>{healthData.database.stats.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Merchants:</span>
                        <span>{healthData.database.stats.merchants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Venues:</span>
                        <span>{healthData.database.stats.venues}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deals:</span>
                        <span>{healthData.database.stats.deals}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading health data...</p>
            </div>
          )}
        </div>
      )}

      {/* Real-time Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Real-time Monitoring</h2>
              <p className="text-slate-600 dark:text-slate-400">Live system performance and endpoint monitoring</p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Auto-refresh</span>
              </label>
              <button
                onClick={fetchMonitoringData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {monitoringData ? (
            <div className="space-y-6">
              {/* Overall Health */}
              <div className={`p-6 rounded-lg border-2 ${
                monitoringData.overallHealth === 'healthy' 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                  : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
              }`}>
                <div className="flex items-center">
                  {monitoringData.overallHealth === 'healthy' ? (
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {monitoringData.overallHealth === 'healthy' ? 'All Systems Operational' : 'System Degraded'}
                    </h3>
                    <p className="text-sm opacity-75">
                      {monitoringData.summary?.healthyTests} of {monitoringData.summary?.totalTests} tests passing
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="grid grid-cols-1 gap-4">
                <h3 className="text-lg font-semibold">Endpoint Tests</h3>
                {monitoringData.tests?.map((test: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    test.status === 'healthy' 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {test.status === 'healthy' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                        )}
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          {test.error && (
                            <p className="text-sm text-red-600">{test.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {test.responseTime}ms
                        </div>
                        <div className="text-xs text-gray-500">
                          {test.critical ? 'Critical' : 'Standard'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading monitoring data...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
