'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search, Star, TrendingUp, Zap, Heart } from 'lucide-react';
import DealCard from '../components/DealCard';
import MapWithClusters from '../components/MapWithClusters';
import SortFilterBar from '../components/SortFilterBar';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  startAt: string;
  endAt: string;
  maxRedemptions: number;
  redeemedCount: number;
  minSpend?: number;
  tags: string[];
  status: string;
  restaurant: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    photos: string[];
  };
  venue: {
    latitude: number;
    longitude: number;
    name: string;
  };
  distanceKm?: number;
  claimsLastHour?: number;
  isActive: boolean;
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    maxDistance: 10,
    minDiscount: 0,
    openNow: false
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        // Transform deals to include venue property for MapWithClusters
        const transformedDeals = (data.deals || []).map((deal: any) => ({
          ...deal,
          venue: {
            latitude: deal.restaurant?.latitude || 0,
            longitude: deal.restaurant?.longitude || 0,
            name: deal.restaurant?.name || 'Unknown'
          }
        }));
        setDeals(transformedDeals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDistance = !filters.maxDistance || (deal.distanceKm || 0) <= filters.maxDistance;
    const matchesDiscount = deal.percentOff >= filters.minDiscount;
    
    return matchesSearch && matchesDistance && matchesDiscount;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">🍕</span>
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-xl">🍔</span>
          </div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{animationDelay: '4s'}}>
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-xl">🍜</span>
          </div>
        </div>
        <div className="absolute top-60 right-40 animate-float" style={{animationDelay: '1s'}}>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-lg">☕</span>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="text-center text-white">
            {/* Main Title with Animation */}
            <div className="animate-slide-in-down">
              <h1 className="text-6xl md:text-8xl font-black mb-6 hero-text-shadow">
                Happy Hour
              </h1>
            </div>
            
            {/* Subtitle with Animation */}
            <div className="animate-slide-in-up" style={{animationDelay: '0.3s'}}>
              <p className="text-xl md:text-3xl mb-8 max-w-4xl mx-auto text-white/90 leading-relaxed">
                Restaurants flip the switch when they're quiet. You get instant deals nearby.
              </p>
            </div>
            
            {/* Animated Hero Stats */}
            <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="text-5xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Zap className="w-8 h-8 text-yellow-300" />
                    1,200+
                  </div>
                  <div className="text-white/80 text-lg">Active Deals</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="text-5xl font-bold mb-2 flex items-center justify-center gap-2">
                    <TrendingUp className="w-8 h-8 text-green-300" />
                    50%
                  </div>
                  <div className="text-white/80 text-lg">Average Savings</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="text-5xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Clock className="w-8 h-8 text-blue-300" />
                    24/7
                  </div>
                  <div className="text-white/80 text-lg">Deal Updates</div>
                </div>
              </div>
            </div>
            
            {/* Animated Search Bar */}
            <div className="animate-scale-in" style={{animationDelay: '0.9s'}}>
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search for deals, restaurants, or cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 text-xl bg-white/95 dark:bg-slate-800/95 border-2 border-white/30 rounded-3xl focus:border-white/60 focus:outline-none transition-all duration-300 shadow-2xl backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          {/* View Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <List className="w-5 h-5" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <MapPin className="w-5 h-5" />
              Map View
            </button>
          </div>
        </div>

        {/* Filters */}
        <SortFilterBar 
          filters={filters}
          onFiltersChange={setFilters}
          dealsCount={filteredDeals.length}
        />

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} d={deal} />
            ))}
          </div>
        ) : (
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
            <MapWithClusters deals={filteredDeals} />
          </div>
        )}

        {filteredDeals.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              No deals found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters to find more deals.
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Merchant Presentation Section */}
      <div className="relative bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-20">
            <div className="animate-slide-in-down">
              <h2 className="text-5xl md:text-6xl font-black mb-8 hero-text-shadow">
                For Restaurants
              </h2>
            </div>
            <div className="animate-slide-in-up" style={{animationDelay: '0.3s'}}>
              <p className="text-xl md:text-3xl max-w-4xl mx-auto text-white/90 leading-relaxed">
                Turn quiet hours into revenue opportunities. Attract customers when you need them most.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center text-white animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 hover:bg-white/30 transition-all duration-300 animate-float">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-3xl font-bold mb-6">Smart Analytics</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Track performance, understand customer patterns, and optimize your deals with real-time insights.
              </p>
            </div>
            
            <div className="text-center text-white animate-fade-in" style={{animationDelay: '0.8s'}}>
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 hover:bg-white/30 transition-all duration-300 animate-float" style={{animationDelay: '2s'}}>
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-3xl font-bold mb-6">Instant Activation</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Create and activate deals in seconds. No complicated setup, just simple tools that work.
              </p>
            </div>
            
            <div className="text-center text-white animate-fade-in" style={{animationDelay: '1s'}}>
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 hover:bg-white/30 transition-all duration-300 animate-float" style={{animationDelay: '4s'}}>
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-3xl font-bold mb-6">Boost Revenue</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Fill empty tables during slow periods and turn quiet hours into profitable opportunities.
              </p>
            </div>
          </div>

          <div className="text-center animate-scale-in" style={{animationDelay: '1.2s'}}>
            <button className="bg-white text-primary-600 px-12 py-6 rounded-3xl font-bold text-xl hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              Start Your Free Trial
            </button>
            <p className="text-white/80 mt-6 text-lg">No setup fees • Cancel anytime • 30-day money back guarantee</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Simple steps to start saving and earning with Happy Hour
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">1. Discover</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Browse nearby deals or search for specific restaurants and cuisines you love.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">2. Claim</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Tap to claim your deal and get a unique code to show at the restaurant.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">3. Enjoy</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Show your code at the restaurant and enjoy your meal with instant savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}