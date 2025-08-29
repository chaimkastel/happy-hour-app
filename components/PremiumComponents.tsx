'use client';

import React from 'react';
import { Search, MapPin, Clock, Star, Heart, Filter, Grid, List } from 'lucide-react';

// Premium Search Bar Component
export function PremiumSearchBar() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
      <input
        type="text"
        placeholder="Search restaurants, cuisines, or deals..."
        className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:border-yellow-400 focus:outline-none transition-all duration-300 text-white placeholder-white/60 shadow-2xl"
      />
      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
        🔍 Search
      </button>
    </div>
  );
}

// Quick Action Component
export function QuickAction({ icon: Icon, label, onClick, className = "" }: {
  icon: any;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${className}`}
    >
      <Icon className="w-8 h-8 text-white mb-2" />
      <span className="text-white text-sm font-medium">{label}</span>
    </button>
  );
}

// Premium Deal Card Component
export function PremiumDealCard({ 
  deal, 
  onFavorite, 
  onClick 
}: { 
  deal: any; 
  onFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
}) {
  return (
    <div 
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
      onClick={() => onClick?.(deal.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">{deal.title}</h3>
          <p className="text-white/80 text-sm mb-3">{deal.venue?.name || 'Restaurant'}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
              {deal.discount || deal.percentOff}% OFF
            </span>
            <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs border border-white/20">
              {deal.cuisine || 'Food'}
            </span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(deal.id);
          }}
          className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200"
        >
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-blue-400" />
            <span>{deal.distance ? `${deal.distance} mi` : '0.5 mi'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-green-400" />
            <span>{deal.isOpen ? 'Open' : 'Closed'}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1 text-yellow-400" />
          <span className="font-medium">{deal.rating || '4.8'}</span>
        </div>
      </div>
    </div>
  );
}

// Premium Bottom Navigation Component
export function PremiumBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        <button className="flex flex-col items-center py-2 px-3 text-yellow-400 transform hover:scale-110 transition-all duration-200">
          <Grid className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Explore</span>
        </button>
        <button className="flex flex-col items-center py-2 px-3 text-gray-300 hover:text-white transform hover:scale-110 transition-all duration-200">
          <MapPin className="w-6 h-6 mb-1" />
          <span className="text-xs">Map</span>
        </button>
        <button className="flex flex-col items-center py-2 px-3 text-gray-300 hover:text-white transform hover:scale-110 transition-all duration-200">
          <Heart className="w-6 h-6 mb-1" />
          <span className="text-xs">Favorites</span>
        </button>
        <button className="flex flex-col items-center py-2 px-3 text-gray-300 hover:text-white transform hover:scale-110 transition-all duration-200">
          <Star className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}

// Premium Header Component
export function PremiumHeader() {
  return (
    <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🍺</span>
            </div>
            <h1 className="text-white font-bold text-lg">Happy Hour</h1>
          </div>
          <button className="p-2 rounded-lg bg-white/10 text-white">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Premium Side Menu Component
export function PremiumSideMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute top-0 right-0 w-80 h-full bg-white/10 backdrop-blur-md border-l border-white/20 animate-in slide-in-from-right duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-xl font-bold">Menu</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
              <Star className="w-5 h-5 inline mr-3" />
              My Account
            </button>
            <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
              <Heart className="w-5 h-5 inline mr-3" />
              Favorites
            </button>
            <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
              <MapPin className="w-5 h-5 inline mr-3" />
              Wallet
            </button>
            <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 transform hover:scale-105">
              <Clock className="w-5 h-5 inline mr-3" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}