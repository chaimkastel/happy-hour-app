'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  Star, 
  Clock, 
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
  ArrowRight,
  Menu,
  X,
  Grid
} from 'lucide-react';

export default function MobileAccountPage() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowMobileMenu(false);
  };

  const stats = [
    { label: 'Deals Claimed', value: '47', icon: Trophy, color: 'text-yellow-400' },
    { label: 'Money Saved', value: '$127', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Favorite Spots', value: '12', icon: Heart, color: 'text-red-400' },
    { label: 'Reviews Written', value: '8', icon: Star, color: 'text-blue-400' }
  ];

  const menuItems = [
    { label: 'My Profile', icon: User, href: '/account' },
    { label: 'Favorites', icon: Heart, href: '/favorites' },
    { label: 'Wallet', icon: CreditCard, href: '/wallet' },
    { label: 'Order History', icon: History, href: '/history' },
    { label: 'Notifications', icon: Bell, href: '/notifications' },
    { label: 'Settings', icon: Settings, href: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🍺</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl drop-shadow-lg">My Account</h1>
                <p className="text-white/70 text-xs">Manage your profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6 relative z-10">
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">John Doe</h2>
              <p className="text-white/70 text-sm">john@example.com</p>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-white/80 text-sm">Premium Member</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => handleNavigation('/account')}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Edit Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                  <span className="text-white font-bold text-lg">{stat.value}</span>
                </div>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.href)}
                className="w-full bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <Icon className="w-6 h-6 text-white" />
                  <span className="text-white font-medium">{item.label}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-white/60" />
              </button>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-6 pb-24">
          <h3 className="text-white font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Claimed 50% OFF at Pizza Palace</span>
                <span className="text-white/60 text-sm">2 hours ago</span>
              </div>
              <p className="text-white/70 text-sm">Saved $12.50</p>
            </div>
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Added Sushi Spot to Favorites</span>
                <span className="text-white/60 text-sm">1 day ago</span>
              </div>
              <p className="text-white/70 text-sm">Now following this restaurant</p>
            </div>
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Wrote a review for Burger Joint</span>
                <span className="text-white/60 text-sm">3 days ago</span>
              </div>
              <p className="text-white/70 text-sm">5 stars - "Amazing burgers!"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 safe-area-pb z-50">
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={() => handleNavigation('/mobile')}
            className="flex flex-col items-center py-2 px-3 text-white/70 hover:text-white transform hover:scale-110 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Explore</span>
          </button>
          <button 
            onClick={() => handleNavigation('/mobile/favorites')}
            className="flex flex-col items-center py-2 px-3 text-white/70 hover:text-white transform hover:scale-110 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Favorites</span>
          </button>
          <button 
            onClick={() => handleNavigation('/wallet')}
            className="flex flex-col items-center py-2 px-3 text-white/70 hover:text-white transform hover:scale-110 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Wallet</span>
          </button>
          <button 
            onClick={() => handleNavigation('/mobile/account')}
            className="flex flex-col items-center py-2 px-3 text-yellow-400 transform hover:scale-110 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center mb-1">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Profile</span>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute top-0 right-0 w-80 h-full bg-white/15 backdrop-blur-xl border-l border-white/30 animate-in slide-in-from-right duration-300">
            <div className="p-6 h-full flex flex-col">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-white text-xl font-bold drop-shadow-lg">Menu</h2>
                  <p className="text-white/70 text-sm">Navigate & manage</p>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Welcome!</h3>
                    <p className="text-white/70 text-sm">Sign in to save favorites</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 space-y-3">
                <button 
                  onClick={() => handleNavigation('/mobile/account')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <span className="font-medium">My Account</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/mobile/favorites')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-3" />
                    <span className="font-medium">Favorites</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/wallet')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span className="font-medium">Wallet</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/explore')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="font-medium">Map View</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/merchant')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-3" />
                    <span className="font-medium">For Restaurants</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/settings')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-3" />
                    <span className="font-medium">Settings</span>
                  </div>
                </button>
              </div>

              {/* Menu Footer */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
