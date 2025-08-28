'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, CreditCard, BarChart3, Settings, Shield, Eye, EyeOff, Plus, Edit, Trash2, Search, Filter, Download, Upload, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, MapPin, Star, Heart, MessageSquare, Power, Lock, Unlock, Globe, Database, Server, Activity, Zap, AlertCircle, Ban, UserCheck, UserX, Pause, Play, RefreshCw, Bell, BellOff, FileText, ThumbsUp, ThumbsDown, Mail, Phone, Calendar, Bug } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import MonitoringDashboard from '@/components/MonitoringDashboard';

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

interface ErrorLog {
  id: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
  tags: string[];
  context?: Record<string, any>;
  userId?: string;
  url?: string;
  stack?: string;
}

interface ErrorPattern {
  pattern: string;
  count: number;
  lastOccurrence: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'merchants' | 'deals' | 'dealReview' | 'settings' | 'safety' | 'analytics' | 'applications' | 'monitoring' | 'health' | 'errors'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pendingDeals, setPendingDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [errorData, setErrorData] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [merchantApplications, setMerchantApplications] = useState<MerchantApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<MerchantApplication | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
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
          window.location.href = '/admin-access';
        }
      }
    };

    checkAdminAuth();
  }, []);

  // Mock data for demonstration
  useEffect(() => {
    setUsers([
      {
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'USER',
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20',
        isActive: true,
        dealsCount: 0
      },
      {
        id: '2',
        email: 'jane@restaurant.com',
        name: 'Jane Smith',
        role: 'MERCHANT',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-19',
        isActive: true,
        dealsCount: 5,
        venuesCount: 2
      }
    ]);

    setMerchants([
      {
        id: '1',
        email: 'jane@restaurant.com',
        businessName: 'Jane\'s Italian Bistro',
        contactName: 'Jane Smith',
        phone: '+1-555-0123',
        address: '123 Main St, New York, NY',
        subscription: 'PREMIUM',
        isActive: true,
        createdAt: '2024-01-10',
        dealsCount: 5,
        venuesCount: 2,
        totalRevenue: 2500
      },
      {
        id: '2',
        email: 'mike@pizza.com',
        businessName: 'Mike\'s Pizza Palace',
        contactName: 'Mike Johnson',
        phone: '+1-555-0456',
        address: '456 Oak Ave, New York, NY',
        subscription: 'BASIC',
        isActive: true,
        createdAt: '2024-01-12',
        dealsCount: 3,
        venuesCount: 1,
        totalRevenue: 1200
      }
    ]);

    setDeals([
      {
        id: '1',
        title: 'Happy Hour Special',
        description: '50% off all drinks during happy hour',
        percentOff: 50,
        status: 'LIVE',
        startAt: '2024-01-20T17:00:00Z',
        endAt: '2024-01-20T19:00:00Z',
        maxRedemptions: 100,
        redeemedCount: 23,
        venue: {
          name: 'Jane\'s Italian Bistro',
          businessType: 'Italian'
        },
        merchant: {
          businessName: 'Jane\'s Italian Bistro',
          email: 'jane@restaurant.com'
        }
      }
    ]);

    setMerchantApplications([
      {
        id: '1',
        businessName: 'Golden Dragon Restaurant',
        contactName: 'David Chen',
        email: 'david@goldendragon.com',
        phone: '+1-555-0123',
        address: '123 Main St, Chinatown, NY 10013',
        businessType: 'Chinese Restaurant',
        description: 'Authentic Chinese cuisine with over 20 years of experience. We specialize in traditional dishes and modern fusion.',
        submittedAt: '2024-01-20T10:30:00Z',
        status: 'PENDING',
        documents: {
          businessLicense: 'BL-2024-001',
          taxId: 'TAX-123456789',
          insurance: 'INS-2024-001'
        }
      },
      {
        id: '2',
        businessName: 'Bella Vista Cafe',
        contactName: 'Maria Rodriguez',
        email: 'maria@bellavista.com',
        phone: '+1-555-0456',
        address: '456 Oak Ave, Little Italy, NY 10012',
        businessType: 'Italian Cafe',
        description: 'Cozy Italian cafe serving fresh pasta, pizza, and authentic Italian coffee. Family-owned for 15 years.',
        submittedAt: '2024-01-19T14:20:00Z',
        status: 'PENDING',
        documents: {
          businessLicense: 'BL-2024-002',
          taxId: 'TAX-987654321',
          insurance: 'INS-2024-002'
        }
      },
      {
        id: '3',
        businessName: 'Spice Garden Indian',
        contactName: 'Raj Patel',
        email: 'raj@spicegarden.com',
        phone: '+1-555-0789',
        address: '789 Broadway, Midtown, NY 10001',
        businessType: 'Indian Restaurant',
        description: 'Traditional Indian cuisine with vegetarian and non-vegetarian options. Award-winning chef with 25 years experience.',
        submittedAt: '2024-01-18T09:15:00Z',
        status: 'PENDING',
        documents: {
          businessLicense: 'BL-2024-003',
          taxId: 'TAX-456789123',
          insurance: 'INS-2024-003'
        }
      }
    ]);
  }, []);

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
    } else if (activeTab === 'errors') {
      fetchErrorData();
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
      } else if (activeTab === 'errors') {
        fetchErrorData();
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
      // API call to create user
      console.log('Creating user:', userData);
      // Add to local state
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email || '',
        name: userData.name || '',
        role: userData.role || 'USER',
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setUsers([...users, newUser]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
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
      const response = await fetch('/api/admin/monitoring?includeMetrics=true&includeAlerts=true');
      if (response.ok) {
        const data = await response.json();
        setMonitoringData(data);
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  const fetchErrorData = async () => {
    try {
      const response = await fetch('/api/admin/errors?timeRange=24h&limit=50');
      if (response.ok) {
        const data = await response.json();
        setErrorData(data);
      }
    } catch (error) {
      console.error('Error fetching error data:', error);
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
            onClick={() => window.location.href = '/admin-access'}
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
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Shield className="w-4 h-4" />
                Admin Access
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('admin-authenticated');
                  window.location.href = '/admin-access';
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
          onClick={() => setActiveTab('errors')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'errors'
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Bug className="w-5 h-5" />
          Error Tracking
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Login</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
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
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                              {user.lastLogin || 'Never'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedUser(user)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                >
                                  {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
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

      {/* Comprehensive Monitoring Tab */}
      {(activeTab === 'monitoring' || activeTab === 'health') && (
        <MonitoringDashboard />
      )}

      {/* Error Tracking Tab */}
      {activeTab === 'errors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Error Tracking</h2>
              <p className="text-slate-600 dark:text-slate-400">Monitor and analyze application errors</p>
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
                onClick={fetchErrorData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {errorData ? (
            <div className="space-y-6">
              {/* Error Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Errors</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{errorData.stats?.total || 0}</p>
                    </div>
                    <Bug className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Critical Errors</p>
                      <p className="text-2xl font-bold text-red-600">{errorData.stats?.byLevel?.error || 0}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Warnings</p>
                      <p className="text-2xl font-bold text-yellow-600">{errorData.stats?.byLevel?.warning || 0}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent (24h)</p>
                      <p className="text-2xl font-bold text-blue-600">{errorData.stats?.recentErrors || 0}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Error Patterns */}
              {errorData.patterns && errorData.patterns.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Error Patterns</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Recurring error patterns detected</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {errorData.patterns.slice(0, 5).map((pattern: ErrorPattern, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{pattern.pattern}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Last seen: {new Date(pattern.lastOccurrence).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{pattern.count} occurrences</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pattern.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Errors */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Errors</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Latest error occurrences</p>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {errorData.errors && errorData.errors.length > 0 ? (
                    errorData.errors.slice(0, 10).map((error: ErrorLog) => (
                      <div key={error.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                error.level === 'error' ? 'bg-red-100 text-red-800' :
                                error.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {error.level.toUpperCase()}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(error.timestamp).toLocaleString()}
                              </span>
                              {error.resolved && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  Resolved
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                              {error.message}
                            </h4>
                            {error.url && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                URL: {error.url}
                              </p>
                            )}
                            {error.tags && error.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {error.tags.map((tag, tagIndex) => (
                                  <span key={tagIndex} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {!error.resolved && (
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/admin/errors', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action: 'resolve_error', errorId: error.id })
                                  });
                                  if (response.ok) {
                                    fetchErrorData(); // Refresh data
                                  }
                                } catch (err) {
                                  console.error('Failed to resolve error:', err);
                                }
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                      No errors found
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading error data...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
