'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search } from 'lucide-react';
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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-black mb-6 hero-text-shadow">
              Happy Hour
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Restaurants flip the switch when they're quiet. You get instant deals nearby.
            </p>
            
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">1,200+</div>
                <div className="text-white/80">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50%</div>
                <div className="text-white/80">Average Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-white/80">Deal Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for deals, restaurants, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
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
                  ? 'bg-indigo-600 text-white'
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

      {/* Merchant Presentation Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              For Restaurants
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
              Turn quiet hours into revenue opportunities. Attract customers when you need them most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Analytics</h3>
              <p className="text-white/80">
                Track performance, understand customer patterns, and optimize your deals with real-time insights.
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Activation</h3>
              <p className="text-white/80">
                Create and activate deals in seconds. No complicated setup, just simple tools that work.
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Boost Revenue</h3>
              <p className="text-white/80">
                Fill empty tables during slow periods and turn quiet hours into profitable opportunities.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 transition-colors shadow-lg">
              Start Your Free Trial
            </button>
            <p className="text-white/80 mt-4">No setup fees • Cancel anytime</p>
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