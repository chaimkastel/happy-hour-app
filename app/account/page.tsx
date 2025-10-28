'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, Edit3, Camera, Star, TrendingUp, Clock, Mail, Phone, Save, Heart, Wallet, MapPin, ChevronRight, Award, Zap, Gift } from 'lucide-react';
import Image from 'next/image';
import BottomNav from '@/components/navigation/BottomNav';

interface AccountStats {
  totalSaved: number;
  dealsUsed: number;
  points: number;
  activeDeals: number;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [stats, setStats] = useState<AccountStats>({
    totalSaved: 0,
    dealsUsed: 0,
    points: 0,
    activeDeals: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (session?.user) {
      const user = session.user as any;
      setEditData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [session, status, router]);

  // Fetch user stats
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserStats();
    }
  }, [session]);

  const fetchUserStats = async () => {
    try {
      // Fetch vouchers to calculate stats
      const response = await fetch('/api/wallet/vouchers');
      if (response.ok) {
        const data = await response.json();
        const vouchers = data.vouchers || [];
        
        const redeemedCount = vouchers.filter((v: any) => v.status === 'REDEEMED').length;
        const activeCount = vouchers.filter((v: any) => v.status === 'ISSUED').length;
        
        // Estimate total saved (could be improved with actual discount calculations)
        const estimatedSaved = redeemedCount * 25; // $25 average per deal
        const points = redeemedCount * 50; // 50 points per deal
        
        setStats({
          totalSaved: estimatedSaved,
          dealsUsed: redeemedCount,
          points: points,
          activeDeals: activeCount,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const [firstName, ...lastNameParts] = editData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const response = await fetch('/api/account/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone: editData.phone }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setIsEditing(false);
          window.location.reload();
        }, 1000);
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleNavigate = (path: string) => {
    router.push(path as any);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 flex items-center justify-center pb-20">
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
          <p className="text-slate-600">Loading account...</p>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;
  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-100"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Account</h1>
          <p className="text-slate-600">Manage your profile and preferences</p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-slate-200"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                {displayName[0].toUpperCase()}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200"
              >
                <Camera className="w-4 h-4 text-slate-700" />
              </motion.button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        <>
                          ✓ Saved
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{displayName}</h2>
                  <p className="text-slate-600 flex items-center gap-2 mb-4">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-green-600 font-medium">Total Saved</div>
                <div className="text-2xl font-bold text-green-700">${stats.totalSaved.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-blue-600 font-medium">Deals Used</div>
                <div className="text-2xl font-bold text-blue-700">{stats.dealsUsed}</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-orange-600 font-medium">Points</div>
                <div className="text-2xl font-bold text-orange-700">{stats.points}</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-pink-600 font-medium">Active Deals</div>
                <div className="text-2xl font-bold text-pink-700">{stats.activeDeals}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-slate-200"
        >
          <h3 className="font-semibold text-slate-900 mb-4 text-lg">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/favorites')}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl hover:shadow-md transition-all border border-pink-100"
            >
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">My Favorites</span>
            </button>
            <button
              onClick={() => router.push('/wallet')}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all border border-blue-100"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">My Wallet</span>
            </button>
            <button
              onClick={() => router.push('/explore')}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-all border border-orange-100"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Find Deals</span>
            </button>
            <button
              onClick={() => router.push('/merchant/signup')}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl hover:shadow-md transition-all border border-purple-100"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900">List Business</span>
            </button>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-slate-200"
        >
          <h3 className="font-semibold text-slate-900 mb-4 text-lg">Settings</h3>
          <div className="space-y-2">
            {[
              { icon: Bell, label: 'Notifications', desc: 'Manage notification preferences', path: '/help' },
              { icon: Shield, label: 'Privacy & Security', desc: 'Control your privacy settings', path: '/privacy' },
              { icon: CreditCard, label: 'Payment Methods', desc: 'Manage payment options', path: '/wallet' },
              { icon: Settings, label: 'App Settings', desc: 'Customize your experience', path: '/help' },
              { icon: HelpCircle, label: 'Help & Support', desc: 'Get help and contact support', path: '/help' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  onClick={() => router.push(item.path as any)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer w-full text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-sm text-slate-600">{item.desc}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors mx-auto"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
