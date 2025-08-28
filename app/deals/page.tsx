'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search, Star, TrendingUp, Zap, Heart, ArrowRight, Play, Shield, Award, Globe, Smartphone, CreditCard, Timer, CheckCircle, Sparkles, X, ChevronDown, Loader2 } from 'lucide-react';
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
        // Transform the data to include venue information and badges
        const transformedDeals = data.map((deal: any, index: number) => ({
          ...deal,
          venue: {
            latitude: deal.restaurant?.latitude || 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: deal.restaurant?.longitude || -74.0060 + (Math.random() - 0.5) * 0.1,
            name: deal.restaurant?.name || 'Restaurant'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search deals, restaurants, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                />
              </div>
            </div>

            {/* View Toggle & Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-primary-600 text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Cuisine Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Cuisine
                  </label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {CUISINE_OPTIONS.map(cuisine => (
                      <option key={cuisine} value={cuisine === 'All Cuisines' ? '' : cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Distance Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Distance
                  </label>
                  <select
                    value={filters.distance}
                    onChange={(e) => setFilters(prev => ({ ...prev, distance: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {DISTANCE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Min Discount
                  </label>
                  <select
                    value={filters.discount}
                    onChange={(e) => setFilters(prev => ({ ...prev, discount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {DISCOUNT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="nearby">Closest</option>
                    <option value="discount">Biggest Savings</option>
                    <option value="expiring">Expiring Soon</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {filteredDeals.length} deals found
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery && `Searching for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal, index) => (
                <div 
                  key={deal.id} 
                  className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-600 transform hover:-translate-y-1"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {/* Deal Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {deal.isHot && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          🔥 Hot Right Now
                        </span>
                      )}
                      {deal.isEndingSoon && (
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          ⏰ Ending Soon
                        </span>
                      )}
                      {deal.isStaffPick && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          ⭐ Staff Pick
                        </span>
                      )}
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {deal.discount}% OFF
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full shadow-lg">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Deal Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 transition-colors">
                          {deal.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                          {deal.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full text-xs">
                          {deal.cuisine}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        {deal.venue?.name || 'Nearby'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <Clock className="w-4 h-4" />
                        Expires in {Math.floor(Math.random() * 120) + 30} min
                      </div>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors transform hover:scale-105">
                        Claim Deal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading more deals...
                    </>
                  ) : (
                    'Load More Deals'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <MapWithClusters deals={filteredDeals} />
          </div>
        )}

        {/* Empty State */}
        {filteredDeals.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍔</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              No deals here right now
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Try expanding your search or adjusting your filters to find more amazing deals.
            </p>
            <button
              onClick={clearFilters}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
