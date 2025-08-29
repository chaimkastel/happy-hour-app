'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Filter, 
  Grid, 
  List,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  venue: {
    name: string;
    address: string;
  };
  cuisine: string;
  distance: string;
  rating: number;
  isOpen: boolean;
}

export default function MobilePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-orange-500 via-red-500 to-purple-600">
        {/* Hero Background Image - Simple approach */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/images/hero-food-deals.png)',
            zIndex: 1
          }}
        ></div>
        
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 backdrop-blur-[1px]" style={{ zIndex: 2 }}></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4 shadow-lg"></div>
            <p className="text-white/90 font-medium drop-shadow-lg">Loading amazing deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-orange-500 via-red-500 to-purple-600">
      {/* Hero Background Image - Simple approach */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/hero-food-deals.png)',
          zIndex: 1
        }}
      ></div>
      
      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 backdrop-blur-[1px]" style={{ zIndex: 2 }}></div>
      
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/15 backdrop-blur-xl border-b border-white/30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">🍺</span>
              </div>
              <h1 className="text-white font-bold text-lg drop-shadow-lg">HappyHour</h1>
            </div>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 py-4 relative z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/20 transition-all duration-200 shadow-lg"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="px-4 pb-4 relative z-10">
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex-shrink-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-200">
            <MapPin className="w-4 h-4 inline mr-1" />
            Near Me
          </button>
          <button className="flex-shrink-0 bg-white/15 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/25 transition-all duration-200 shadow-lg">
            <Clock className="w-4 h-4 inline mr-1" />
            Open Now
          </button>
          <button className="flex-shrink-0 bg-white/15 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/25 transition-all duration-200 shadow-lg">
            <Star className="w-4 h-4 inline mr-1" />
            Top Rated
          </button>
          <button className="flex-shrink-0 bg-white/15 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/25 transition-all duration-200 shadow-lg">
            💰 Best Deals
          </button>
        </div>
      </div>

      {/* Mobile Deals List */}
      <div className="px-4 pb-20 relative z-10">
        <div className="space-y-4">
          {deals.map((deal, index) => (
            <div 
              key={deal.id} 
              className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Deal Image */}
              <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center&auto=format&q=80)`
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {deal.percentOff}% OFF
                  </span>
                </div>
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm">{deal.title}</h3>
                  <p className="text-gray-200 text-sm mb-2 font-medium">{deal.venue.name}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30">
                      {deal.cuisine}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <button className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-300" />
                    <span className="font-medium">{deal.distance}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-green-300" />
                    <span className="font-medium">{deal.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-300" />
                  <span className="font-bold">{deal.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/15 backdrop-blur-xl border-t border-white/30 safe-area-pb z-50">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center py-2 px-3 text-yellow-400 transform hover:scale-110 transition-all duration-200">
            <Grid className="w-6 h-6 mb-1 drop-shadow-sm" />
            <span className="text-xs font-bold">Explore</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-200 hover:text-white transform hover:scale-110 transition-all duration-200">
            <MapPin className="w-6 h-6 mb-1 drop-shadow-sm" />
            <span className="text-xs font-medium">Map</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-200 hover:text-white transform hover:scale-110 transition-all duration-200">
            <Heart className="w-6 h-6 mb-1 drop-shadow-sm" />
            <span className="text-xs font-medium">Favorites</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-200 hover:text-white transform hover:scale-110 transition-all duration-200">
            <Star className="w-6 h-6 mb-1 drop-shadow-sm" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute top-0 right-0 w-80 h-full bg-white/15 backdrop-blur-xl border-l border-white/30 animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white text-xl font-bold drop-shadow-lg">Menu</h2>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg">
                  <Star className="w-5 h-5 inline mr-3" />
                  My Account
                </button>
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg">
                  <Heart className="w-5 h-5 inline mr-3" />
                  Favorites
                </button>
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg">
                  <MapPin className="w-5 h-5 inline mr-3" />
                  Wallet
                </button>
                <button className="w-full text-left text-white py-3 px-4 rounded-lg bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg">
                  <Clock className="w-5 h-5 inline mr-3" />
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