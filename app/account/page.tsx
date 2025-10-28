'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, Edit3, Camera, Star, TrendingUp, Clock, Mail, Phone, Save } from 'lucide-react';
import Image from 'next/image';
import BottomNav from '@/components/navigation/BottomNav';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
  });

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

  const handleSave = async () => {
    try {
      const [firstName, ...lastNameParts] = editData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const response = await fetch('/api/account/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone: editData.phone }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
    setIsEditing(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
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
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold"
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
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 border border-slate-200 text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">$156.99</div>
            <div className="text-xs text-slate-500">Total Saved</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 border border-slate-200 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 mb-1">47</div>
            <div className="text-xs text-slate-500">Deals Used</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 border border-slate-200 text-center"
          >
            <div className="text-2xl font-bold text-orange-600 mb-1">1,250</div>
            <div className="text-xs text-slate-500">Points</div>
          </motion.div>
        </div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200"
        >
          <h3 className="font-semibold text-slate-900 mb-4 text-lg">Settings</h3>
          <div className="space-y-3">
            {[
              { icon: Bell, label: 'Notifications', desc: 'Manage notification preferences' },
              { icon: Shield, label: 'Privacy & Security', desc: 'Control your privacy settings' },
              { icon: CreditCard, label: 'Payment Methods', desc: 'Manage payment options' },
              { icon: Settings, label: 'App Settings', desc: 'Customize your experience' },
              { icon: HelpCircle, label: 'Help & Support', desc: 'Get help and contact support' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-sm text-slate-600">{item.desc}</div>
                  </div>
                </motion.div>
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
