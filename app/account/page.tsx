'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, Edit3, Camera, Star, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const stats = [
  { label: 'Total Saved', value: '$156.99', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Deals Used', value: '47', icon: Star, color: 'text-blue-600' },
  { label: 'Points Earned', value: '1,250', icon: Clock, color: 'text-orange-600' },
];

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Personal Information', description: 'Update your profile details' },
      { icon: Bell, label: 'Notifications', description: 'Manage notification preferences' },
      { icon: Shield, label: 'Privacy & Security', description: 'Control your privacy settings' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: CreditCard, label: 'Payment Methods', description: 'Manage your payment options' },
      { icon: Settings, label: 'App Settings', description: 'Customize your app experience' },
      { icon: HelpCircle, label: 'Help & Support', description: 'Get help and contact support' },
    ],
  },
];

const recentActivity = [
  {
    id: '1',
    action: 'Used deal at Bottega Louie',
    time: '2 hours ago',
    amount: '$15.50 saved',
    type: 'saved',
  },
  {
    id: '2',
    action: 'Earned reward points',
    time: '1 day ago',
    amount: '+50 points',
    type: 'earned',
  },
  {
    id: '3',
    action: 'Added new favorite',
    time: '2 days ago',
    amount: 'Sushi Nakazawa',
    type: 'favorite',
  },
  {
    id: '4',
    action: 'Redeemed gift card',
    time: '3 days ago',
    amount: '$10.00',
    type: 'redeemed',
  },
];

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
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  // Update edit data when session loads
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setEditData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [session]);

  const handleSave = async () => {
    try {
      const [firstName, ...lastNameParts] = editData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const response = await fetch('/api/account/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: editData.phone,
          email: editData.email,
        }),
      });

      if (response.ok) {
        // Reload session to get updated data
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Failed to save: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (session?.user) {
      const user = session.user as any;
      setEditData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  const user = session.user as any;
  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
                        alt={displayName}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <Input
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <Input
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <Input
                            value={editData.phone}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{displayName}</h2>
                        <p className="text-gray-600 mb-1">{user.email}</p>
                        <p className="text-gray-600 mb-4">{user.phone || 'No phone number'}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Member since {memberSince}</span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
                            {user.role} Member
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="mt-4 flex items-center space-x-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Membership Progress */}
                  <div className="w-full md:w-64">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Membership Progress</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Next Reward</span>
                            <span className="font-semibold">250 pts</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }} />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Keep saving to unlock more rewards!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <Card key={stat.label} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Settings Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {settingsSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + sectionIndex * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.label}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                      <span className={`font-semibold ${
                        activity.type === 'saved' ? 'text-green-600' :
                        activity.type === 'earned' ? 'text-blue-600' :
                        activity.type === 'redeemed' ? 'text-orange-600' :
                        'text-gray-600'
                      }`}>
                        {activity.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 px-8 py-3"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}