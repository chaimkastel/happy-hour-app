'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function MobileExplorePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-white font-bold text-lg">Happy Hour</h1>
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

      {/* Mobile Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="px-4 pb-4">
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex-shrink-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-200">
            <MapPin className="w-4 h-4 inline mr-1" />
            Near Me
          </button>
          <button className="flex-shrink-0 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
            <Clock className="w-4 h-4 inline mr-1" />
            Open Now
          </button>
          <button className="flex-shrink-0 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
            <Star className="w-4 h-4 inline mr-1" />
            Top Rated
          </button>
          <button className="flex-shrink-0 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
            💰 Best Deals
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Discover Deals</h2>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Deals List */}
      <div className="px-4 pb-20">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {deals.map((deal, index) => (
              <div 
                key={deal.id} 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-3">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{deal.title}</h3>
                  <p className="text-gray-300 text-xs mb-2">{deal.venue.name}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
                      {deal.percentOff}% OFF
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-400" />
                    <span>{deal.rating}</span>
                  </div>
                  <button className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {deals.map((deal, index) => (
              <div 
                key={deal.id} 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{deal.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">{deal.venue.name}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
                        {deal.percentOff}% OFF
                      </span>
                      <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs border border-white/20">
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
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                      <span>{deal.distance}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-green-400" />
                      <span>{deal.isOpen ? 'Open' : 'Closed'}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    <span className="font-medium">{deal.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
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
      )}
    </div>
  );
}
