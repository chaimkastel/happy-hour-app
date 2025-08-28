'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';

export default function MobileAccountPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-x-hidden">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🔥</span>
              </div>
              <h1 className="text-white font-bold text-lg">My Account</h1>
            </div>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
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
          <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300">
            Edit Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
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
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center justify-between hover:bg-white/20 transition-all duration-300"
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
        <div className="mt-6">
          <h3 className="text-white font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Claimed 50% OFF at Pizza Palace</span>
                <span className="text-white/60 text-sm">2 hours ago</span>
              </div>
              <p className="text-white/70 text-sm">Saved $12.50</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Added Sushi Spot to Favorites</span>
                <span className="text-white/60 text-sm">1 day ago</span>
              </div>
              <p className="text-white/70 text-sm">Now following this restaurant</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Wrote a review for Burger Joint</span>
                <span className="text-white/60 text-sm">3 days ago</span>
              </div>
              <p className="text-white/70 text-sm">5 stars - "Amazing burgers!"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center py-2 px-3 text-gray-300 hover:text-white transform hover:scale-110 transition-all duration-200">
            <MapPin className="w-6 h-6 mb-1" />
            <span className="text-xs">Explore</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-300 hover:text-white transform hover:scale-110 transition-all duration-200">
            <Heart className="w-6 h-6 mb-1" />
            <span className="text-xs">Favorites</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-300 hover:text-white transform hover:scale-110 transition-all duration-200">
            <CreditCard className="w-6 h-6 mb-1" />
            <span className="text-xs">Wallet</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-yellow-400 transform hover:scale-110 transition-all duration-200">
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute top-0 right-0 w-80 h-full bg-white/10 backdrop-blur-md border-l border-white/20 animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white text-xl font-bold">Menu</h2>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
                  <User className="w-5 h-5 inline mr-3" />
                  My Account
                </button>
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
                  <Heart className="w-5 h-5 inline mr-3" />
                  Favorites
                </button>
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
                  <CreditCard className="w-5 h-5 inline mr-3" />
                  Wallet
                </button>
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
                  <Settings className="w-5 h-5 inline mr-3" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
