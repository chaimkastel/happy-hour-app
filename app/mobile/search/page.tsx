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
  ArrowRight,
  X,
  TrendingUp,
  Award,
  Settings
} from 'lucide-react';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';

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

export default function MobileSearchPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    fetchDeals();
    // Load recent searches from localStorage
    const saved = localStorage.getItem('hh:recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
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

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowMobileMenu(false);
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/deal/${dealId}/view`);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Save to recent searches
      const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('hh:recentSearches', JSON.stringify(newRecent));
      
      // Navigate to explore with search query
      router.push(`/mobile/explore?q=${encodeURIComponent(query)}`);
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (!searchQuery.trim()) return false;
    return deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           deal.venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           deal.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 flex items-center justify-center md:hidden">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 relative overflow-hidden md:hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Mobile Header */}
      <MobileHeader
        title="Search"
        subtitle="Find amazing deals"
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
      />

      {/* Search Section */}
      <div className="px-4 py-4 relative z-10">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines, deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="w-full pl-12 pr-12 py-4 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/20 transition-all duration-200 shadow-lg text-base"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="mb-4">
            <h3 className="text-white/80 text-sm font-medium mb-2">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSearchQuery(search);
                    handleSearch(search);
                  }}
                  className="bg-white/15 backdrop-blur-xl text-white px-3 py-2 rounded-full text-sm border border-white/30 hover:bg-white/25 transition-all duration-200"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-4">
            <h3 className="text-white/80 text-sm font-medium mb-2">
              {filteredDeals.length} {filteredDeals.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </h3>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="px-4 pb-24 relative z-10">
        {searchQuery && filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No results found</h3>
            <p className="text-white/70 text-sm">Try different search terms or check your spelling</p>
          </div>
        ) : searchQuery ? (
          <div className="space-y-4">
            {filteredDeals.map((deal, index) => (
              <div 
                key={deal.id} 
                onClick={() => handleDealClick(deal.id)}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-xl active:scale-95 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{deal.title}</h3>
                    <p className="text-white/80 text-sm mb-2">{deal.venue.name}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
                        {deal.percentOff}% OFF
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs border border-white/30">
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
                <div className="flex items-center justify-between text-sm text-white/70">
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
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Start searching</h3>
            <p className="text-white/70 text-sm">Enter a restaurant name, cuisine type, or deal description</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />

      {/* Mobile Menu */}
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
                  type="button"
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
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Search</h3>
                    <p className="text-white/70 text-sm">Find the best deals</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 space-y-3">
                <button 
                  type="button"
                  onClick={() => handleNavigation('/mobile')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <span className="font-medium">Explore Deals</span>
                  </div>
                </button>
                <button 
                  type="button"
                  onClick={() => handleNavigation('/mobile/favorites')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-3" />
                    <span className="font-medium">Favorites</span>
                  </div>
                </button>
                <button 
                  type="button"
                  onClick={() => handleNavigation('/wallet')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <span className="font-medium">Wallet</span>
                  </div>
                </button>
                <button 
                  type="button"
                  onClick={() => handleNavigation('/explore')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="font-medium">Map View</span>
                  </div>
                </button>
                <button 
                  type="button"
                  onClick={() => handleNavigation('/merchant')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-3" />
                    <span className="font-medium">For Restaurants</span>
                  </div>
                </button>
                <button 
                  type="button"
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
                  type="button"
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
