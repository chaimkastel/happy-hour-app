'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, Clock, Calendar, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { OnboardingChecklist } from '@/components/merchant/OnboardingChecklist';

export default function MerchantDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [merchantStatus, setMerchantStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/merchant/signin');
      return;
    }

    fetchMerchantStatus();
  }, [status, router]);

  const fetchMerchantStatus = async () => {
    try {
      const response = await fetch('/api/merchant/status');
      if (response.ok) {
        const data = await response.json();
        setMerchantStatus(data.status);

        if (data.status === 'PENDING') {
          router.push('/merchant/pending' as any);
        } else if (data.status === 'REJECTED') {
          router.push('/merchant/pending?rejected=true' as any);
        }
      }
    } catch (error) {
      console.error('Error fetching merchant status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const stats = {
    activeDeals: 0,
    totalViews: 0,
    totalRedemptions: 0,
    revenue: '$0.00',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! 👋</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Approved
              </span>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                Settings
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-semibold text-gray-600">Active Deals</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeDeals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-600">Total Views</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-600">Redemptions</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRedemptions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-600">Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.revenue}</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/merchant/deals/new' as any)}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all text-left"
            >
              <Plus className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Create Deal</h3>
                <p className="text-sm opacity-90">Add a new happy hour deal</p>
              </div>
            </button>

            <button 
              onClick={() => router.push('/merchant/boost' as any)}
              className="flex items-center gap-4 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all text-left border border-blue-200"
            >
              <Bell className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Instant Boost</h3>
                <p className="text-sm opacity-90">Start an instant deal now</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Onboarding Checklist */}
        <OnboardingChecklist merchantId="1" initialCompleted={[]} />

        {/* Getting Started */}
        {stats.activeDeals === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-xl p-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
                <p className="text-gray-700 mb-4">
                  You haven't created any deals yet. Create your first happy hour deal to start attracting diners during off-peak hours!
                </p>
                <button 
                  onClick={() => router.push('/merchant/deals/new' as any)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
                >
                  Create Your First Deal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
