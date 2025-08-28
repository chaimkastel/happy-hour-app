'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search, Star, TrendingUp, Zap, Heart, ArrowRight, Play, Shield, Award, Globe, Smartphone, CreditCard, Timer, CheckCircle, Sparkles, X, ChevronDown, Loader2, Flame, Gift, Target, Rocket, Crown, Diamond } from 'lucide-react';
import DealCard from '../../components/DealCard';
import MapWithClusters from '../../components/MapWithClusters';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  cuisine: string;
  venue: {
    latitude: number;
    longitude: number;
    name: string;
  };
  image?: string;
  expiresAt?: string;
  isHot?: boolean;
  isEndingSoon?: boolean;
  isStaffPick?: boolean;
}

interface Filters {
  cuisine: string;
  distance: number;
  discount: number;
  sort: 'nearby' | 'discount' | 'expiring';
}

const CUISINE_OPTIONS = [
  'All Cuisines', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'American', 'Mediterranean', 'French', 'Korean', 'Vietnamese'
];

const DISTANCE_OPTIONS = [
  { value: 1, label: '1 mile' },
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 25, label: '25 miles' }
];

const DISCOUNT_OPTIONS = [
  { value: 0, label: 'Any discount' },
  { value: 20, label: '20%+' },
  { value: 30, label: '30%+' },
  { value: 50, label: '50%+' },
  { value: 70, label: '70%+' }
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    cuisine: '',
    distance: 10,
    discount: 0,
    sort: 'nearby'
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        // The API returns { deals: [...] }, so we need to access data.deals
        const dealsData = data.deals || data;
        // Transform the data to include venue information and badges
        const transformedDeals = dealsData.map((deal: any, index: number) => ({
          ...deal,
          discount: deal.percentOff || deal.discount || 0,
          cuisine: deal.venue?.businessType || deal.cuisine || 'Restaurant',
          venue: {
            latitude: deal.venue?.latitude || 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: deal.venue?.longitude || -74.0060 + (Math.random() - 0.5) * 0.1,
            name: deal.venue?.name || 'Restaurant'
          },
          image: `https://picsum.photos/400/300?random=${index}`,
          expiresAt: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          isHot: Math.random() > 0.7,
          isEndingSoon: Math.random() > 0.8,
          isStaffPick: Math.random() > 0.9
        }));

        if (reset || pageNum === 1) {
          setDeals(transformedDeals);
        } else {
          setDeals(prev => [...prev, ...transformedDeals]);
        }
        
        setHasMore(transformedDeals.length === 20); // Assuming 20 deals per page
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchDeals(page + 1);
    }
  }, [loadingMore, hasMore, page]);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCuisine = !filters.cuisine || deal.cuisine.toLowerCase() === filters.cuisine.toLowerCase();
    const matchesDiscount = deal.discount >= filters.discount;
    
    return matchesSearch && matchesCuisine && matchesDiscount;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'discount':
        return b.discount - a.discount;
      case 'expiring':
        return new Date(a.expiresAt || 0).getTime() - new Date(b.expiresAt || 0).getTime();
      default:
        return 0; // For 'nearby', we'd need user location
    }
  });

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      distance: 10,
      discount: 0,
      sort: 'nearby'
    });
    setSearchQuery('');
  };

  const activeFiltersCount = [filters.cuisine, filters.discount > 0, searchQuery].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Amazing Deals...</h2>
          <p className="text-white/80">Finding the best offers near you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Exciting Header */}
      <div className="relative bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-3 mb-4">
              <Flame className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-bold">LIVE DEALS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              🔥 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Discover</span> Amazing Deals
            </h1>
            <p className="text-xl text-white/80">
              Find the best restaurant deals near you with our interactive map and smart filters
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Enhanced Search Bar */}
            <div className="flex-1 max-w-3xl">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search deals, restaurants, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-32 py-6 text-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-3xl focus:border-yellow-400 focus:outline-none transition-all duration-300 text-white placeholder-white/60 shadow-2xl"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  🔍 Search
                </button>
              </div>
            </div>

            {/* Enhanced Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Filter className="w-6 h-6" />
              Smart Filters
              {activeFiltersCount > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">{activeFiltersCount}</span>
              )}
            </button>

            {/* Enhanced View Toggle */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2 flex gap-2 shadow-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <MapPin className="w-5 h-5" />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="relative bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-white font-semibold mb-3">Cuisine Type</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none"
                >
                  {CUISINE_OPTIONS.map(cuisine => (
                    <option key={cuisine} value={cuisine === 'All Cuisines' ? '' : cuisine} className="bg-slate-800">
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-white font-semibold mb-3">Distance</label>
                <select
                  value={filters.distance}
                  onChange={(e) => setFilters(prev => ({ ...prev, distance: Number(e.target.value) }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none"
                >
                  {DISTANCE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Filter */}
              <div>
                <label className="block text-white font-semibold mb-3">Minimum Discount</label>
                <select
                  value={filters.discount}
                  onChange={(e) => setFilters(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none"
                >
                  {DISCOUNT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-white font-semibold mb-3">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as any }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="nearby" className="bg-slate-800">Closest to You</option>
                  <option value="discount" className="bg-slate-800">Biggest Savings</option>
                  <option value="expiring" className="bg-slate-800">Ending Soon</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-end mt-6">
              <button
                onClick={clearFilters}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {filteredDeals.length} Amazing Deals Found
                </h2>
                <p className="text-white/80">
                  {activeFiltersCount > 0 ? 'Filtered results' : 'All available deals in your area'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {Math.round(filteredDeals.reduce((acc, deal) => acc + deal.discount, 0) / filteredDeals.length) || 0}%
                </div>
                <div className="text-white/80 text-sm">Average Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.map((deal, index) => (
              <div 
                key={deal.id}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 hover:scale-105 hover:bg-white/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Restaurant Image */}
                <div className="relative h-56 bg-gradient-to-br from-yellow-400/20 to-orange-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30"></div>
                  
                  {/* Hot Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Flame className="w-4 h-4 animate-pulse" />
                      {deal.discount}% OFF
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:text-red-400 transition-colors p-3 rounded-full shadow-lg hover:bg-white/30">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Restaurant Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                      {deal.venue?.name || 'Amazing Restaurant'}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {deal.cuisine} • {Math.floor(Math.random() * 5) + 1}⭐
                    </p>
                  </div>
                </div>

                {/* Deal Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80 text-sm">
                        {Math.floor(Math.random() * 30) + 10} min away
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Timer className="w-4 h-4" />
                      {Math.floor(Math.random() * 120) + 30} min left
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-6 line-clamp-2">
                    {deal.description || "Amazing deal on delicious food!"}
                  </p>
                  
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                    🚀 Claim This Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[700px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            <MapWithClusters deals={filteredDeals} />
          </div>
        )}

        {/* Load More Button */}
        {hasMore && viewMode === 'grid' && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 rounded-3xl font-bold text-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Loading More Deals...
                </>
              ) : (
                <>
                  <Gift className="w-6 h-6" />
                  Load More Amazing Deals
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🍔</div>
            <h3 className="text-3xl font-bold text-white mb-6">
              No deals found in your area
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Don't worry! Try expanding your search radius or adjusting your filters to discover amazing deals nearby.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              🔄 Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}