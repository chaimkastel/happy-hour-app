'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Star, 
  Clock, 
  Tag, 
  Heart, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  CreditCard,
  History,
  Award,
  Target,
  Users,
  Gift,
  ChevronRight,
  ArrowLeft,
  Grid,
  Menu,
  X
} from 'lucide-react';
import { 
  PremiumBottomNav, 
  PremiumHeader, 
  PremiumSideMenu 
} from '../../../components/PremiumComponents';
import { Button, Card, Badge, Avatar } from '../../../components/DesignSystem';

interface UserStats {
  totalRedemptions: number;
  totalSavings: number;
  streakDays: number;
  points: number;
  badges: string[];
}

export default function MobileAccountPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isClient, setIsClient] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Sample data
  const [stats] = useState<UserStats>({
    totalRedemptions: 12,
    totalSavings: 127,
    streakDays: 7,
    points: 450,
    badges: ['Deal Hunter', 'Local Explorer', 'Savings Master']
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'deals', label: 'My Deals', icon: Tag },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const bottomNavItems = [
    { id: 'explore', label: 'Explore', icon: <Grid className="w-6 h-6" />, isActive: false, onClick: () => window.location.href = '/mobile/explore' },
    { id: 'map', label: 'Map', icon: <MapPin className="w-6 h-6" />, isActive: false, onClick: () => {} },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-6 h-6" />, isActive: false, onClick: () => window.location.href = '/mobile/favorites' },
    { id: 'profile', label: 'Profile', icon: <Users className="w-6 h-6" />, isActive: true, onClick: () => {} },
  ];

  const sideMenuItems = [
    { id: 'account', label: 'My Account', icon: <Users className="w-5 h-5" />, onClick: () => {} },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" />, onClick: () => window.location.href = '/mobile/favorites' },
    { id: 'wallet', label: 'Wallet', icon: <CreditCard className="w-5 h-5" />, onClick: () => window.location.href = '/mobile/wallet' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, onClick: () => alert('Settings coming soon!') },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, onClick: () => alert('Notifications feature coming soon!') },
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 text-white">🍺</div>
          </div>
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Premium Header */}
      <PremiumHeader
        title="🍺 Happy Hour"
        subtitle="My Account"
        onMenuClick={() => setShowMobileMenu(true)}
        onNotificationClick={() => alert('Notifications feature coming soon!')}
      />

      {/* Back Button */}
      <div className="px-4 py-2">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 pb-6">
        <Card variant="elevated" className="p-6">
          <div className="flex items-center gap-4">
            <Avatar src={undefined} fallback="JD" size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
              <p className="text-gray-600">john@example.com</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Member since 2024</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card variant="elevated" className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalRedemptions}</div>
            <div className="text-sm text-gray-600">Deals Claimed</div>
          </Card>
          
          <Card variant="elevated" className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${stats.totalSavings}</div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </Card>
          
          <Card variant="elevated" className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.streakDays}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </Card>
          
          <Card variant="elevated" className="p-4 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Gift className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.points}</div>
            <div className="text-sm text-gray-600">Points</div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Streak & Rewards */}
              <Card variant="elevated" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Current Streak</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {stats.streakDays}
                    </div>
                    <div className="text-sm text-gray-600">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {stats.points}
                    </div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {stats.badges.length}
                    </div>
                    <div className="text-sm text-gray-600">Badges</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {stats.badges.map((badge, index) => (
                    <Badge key={index} variant="default" size="sm">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Claimed deal at Brooklyn Brew House</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Added Sunset Diner to favorites</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'deals' && (
            <motion.div
              key="deals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">My Claimed Deals</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Late Lunch Happy Hour</p>
                      <p className="text-xs text-gray-500">Crown Heights Trattoria • 30% off</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      View QR
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rewards & Badges</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl p-4 text-white">
                    <h4 className="text-lg font-bold mb-2">Current Points</h4>
                    <div className="text-3xl font-bold mb-2">{stats.points}</div>
                    <p className="text-orange-100 text-sm">Keep claiming deals to earn more points!</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 text-white">
                    <h4 className="text-lg font-bold mb-2">Streak Bonus</h4>
                    <div className="text-3xl font-bold mb-2">{stats.streakDays} days</div>
                    <p className="text-green-100 text-sm">You're on fire! 🔥</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New deal available near you!</p>
                      <p className="text-xs text-gray-500">Brooklyn Brew House has a 20% off special</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Profile Information</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Notification Preferences</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Location Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Bottom Navigation */}
      <PremiumBottomNav items={bottomNavItems} />

      {/* Premium Side Menu */}
      <PremiumSideMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        items={sideMenuItems}
        user={{
          name: "John Doe",
          email: "john@example.com",
          avatar: undefined
        }}
      />
    </div>
  );
}
