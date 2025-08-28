'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { MapPin, Clock, Users, Filter, Grid, List, Search, Star, TrendingUp, Zap, Heart, ArrowRight, Play, Shield, Award, Globe, Smartphone, CreditCard, Timer, CheckCircle, Sparkles, X, ChevronDown, Loader2, Flame, Gift, Target, Rocket, Crown, Diamond, Brain, Lightbulb, Sparkle, Wand2, SlidersHorizontal } from 'lucide-react';
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
  score?: number;
  rating?: number;
  redeemedCount?: number;
}

interface AIResponse {
  deals: Deal[];
  insights: string[];
  suggestions: string[];
  total: number;
  query: string;
}

interface Filters {
  cuisine: string;
  maxDistance: number;
  minDiscount: number;
  openNow: boolean;
  sortBy: string;
}

export default function ExplorePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    cuisine: '',
    maxDistance: 10,
    minDiscount: 0,
    openNow: false,
    sortBy: 'relevance'
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Popular search suggestions
  const popularSearches = [
    'Happy Hour Specials',
    'Pizza Deals',
    'Sushi Near Me',
    'Italian Restaurants',
    'Lunch Deals',
    'Dinner Specials',
    'Mexican Food',
    'Chinese Takeout',
    'Brunch Spots',
    'Coffee Shops'
  ];

  // Cuisine options
  const cuisineOptions = [
    'All Cuisines', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 
    'Thai', 'American', 'Mediterranean', 'French', 'Korean', 'Vietnamese'
  ];

  // Load initial deals
  useEffect(() => {
    fetchInitialDeals();
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const fetchInitialDeals = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        const dealsData = data.deals || data;
        const transformedDeals = dealsData.map((deal: any) => ({
          ...deal,
          discount: deal.percentOff || deal.discount || 0,
          cuisine: deal.venue?.businessType || deal.cuisine || 'Restaurant',
          venue: {
            latitude: deal.venue?.latitude || 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: deal.venue?.longitude || -74.0060 + (Math.random() - 0.5) * 0.1,
            name: deal.venue?.name || 'Restaurant'
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

  // AI-powered search
  const performAISearch = async (query: string) => {
    if (!query.trim()) {
      fetchInitialDeals();
      setAiResponse(null);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          userPreferences: {
            location: 'current',
            preferredCuisines: filters.cuisine ? [filters.cuisine] : [],
            maxDistance: filters.maxDistance
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data);
        setDeals(data.deals);
        
        // Add to recent searches
        setRecentSearches(prev => {
          const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
          localStorage.setItem('recentSearches', JSON.stringify(newSearches));
          return newSearches;
        });
      }
    } catch (error) {
      console.error('AI Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    performAISearch(query);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const applyFilters = () => {
    // Apply filters to current deals
    let filteredDeals = [...deals];
    
    if (filters.cuisine && filters.cuisine !== 'All Cuisines') {
      filteredDeals = filteredDeals.filter(deal => 
        deal.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }
    
    if (filters.minDiscount > 0) {
      filteredDeals = filteredDeals.filter(deal => deal.discount >= filters.minDiscount);
    }
    
    // Sort deals
    switch (filters.sortBy) {
      case 'discount':
        filteredDeals.sort((a, b) => b.discount - a.discount);
        break;
      case 'rating':
        filteredDeals.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'distance':
        // For demo, randomize distance
        filteredDeals.sort(() => Math.random() - 0.5);
        break;
      default:
        // Keep AI relevance order
        break;
    }
    
    setDeals(filteredDeals);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      maxDistance: 10,
      minDiscount: 0,
      openNow: false,
      sortBy: 'relevance'
    });
    if (searchQuery) {
      performAISearch(searchQuery);
    } else {
      fetchInitialDeals();
    }
  };

  const activeFiltersCount = [
    filters.cuisine && filters.cuisine !== 'All Cuisines',
    filters.minDiscount > 0,
    filters.openNow,
    filters.sortBy !== 'relevance'
  ].filter(Boolean).length;

  return (
    <>
      <Head>
        <title>Explore Deals - Happy Hour</title>
        <meta name="description" content="Discover amazing restaurant deals and discounts near you. Search by cuisine, location, and preferences to find the best dining offers." />
        <meta name="keywords" content="restaurant deals, food discounts, dining offers, local restaurants, cuisine search" />
        <link rel="canonical" href="https://www.orderhappyhour.com/explore" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SearchResultsPage",
              "name": "Explore Deals - Happy Hour",
              "description": "Discover amazing restaurant deals and discounts near you",
              "url": "https://www.orderhappyhour.com/explore",
              "mainEntity": {
                "@type": "ItemList",
                "name": "Restaurant Deals",
                "description": "List of available restaurant deals and discounts"
              }
            })
          }}
        />
      </Head>
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="sr-only">
          <h1>Explore Deals</h1>
          <p>Search and discover amazing restaurant deals near you</p>
        </div>
      {/* Header - DoorDash Style */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for restaurants, cuisines, or deals..."
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full pl-12 pr-32 py-4 text-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              aria-label="Search for restaurants, cuisines, or deals"
              aria-describedby="search-help"
            />
            <button 
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              aria-label="Search for deals"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50" role="listbox" aria-label="Search suggestions">
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <>
                    <div className="text-slate-600 dark:text-slate-400 text-sm mb-3 font-semibold">Recent Searches</div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        role="option"
                        aria-label={`Search for ${search}`}
                      >
                        {search}
                      </button>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-700 my-3"></div>
                  </>
                )}
                
                <div className="text-slate-600 dark:text-slate-400 text-sm mb-3 font-semibold">Popular Searches</div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 6).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      role="option"
                      aria-label={`Search for ${search}`}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'map'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Map
                </button>
              </div>

              {/* Results Count */}
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'} found
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-label={`${showFilters ? 'Hide' : 'Show'} filters`}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-white text-indigo-600 text-xs px-2 py-1 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" role="region" aria-label="Filter options">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Cuisine Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Cuisine
                  </label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Filter by cuisine type"
                  >
                    {cuisineOptions.map((cuisine) => (
                      <option key={cuisine} value={cuisine === 'All Cuisines' ? '' : cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Distance Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Distance
                  </label>
                  <select
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({...filters, maxDistance: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Filter by maximum distance"
                  >
                    <option value={5}>Within 5 miles</option>
                    <option value={10}>Within 10 miles</option>
                    <option value={25}>Within 25 miles</option>
                    <option value={50}>Within 50 miles</option>
                  </select>
                </div>

                {/* Discount Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Discount
                  </label>
                  <select
                    value={filters.minDiscount}
                    onChange={(e) => setFilters({...filters, minDiscount: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Filter by minimum discount percentage"
                  >
                    <option value={0}>Any discount</option>
                    <option value={20}>20% or more</option>
                    <option value={30}>30% or more</option>
                    <option value={50}>50% or more</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Sort deals by"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="discount">Highest Discount</option>
                    <option value="rating">Highest Rating</option>
                    <option value="distance">Closest</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={clearFilters}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold"
                >
                  Clear all filters
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    aria-label="Apply selected filters"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights */}
      {aiResponse && aiResponse.insights.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">AI Insights</h3>
            </div>
            <div className="mt-2 space-y-1">
              {aiResponse.insights.map((insight, index) => (
                <p key={index} className="text-sm text-indigo-800 dark:text-indigo-200">
                  {insight}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="space-y-8">
            {/* Featured Deals Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="aspect-video bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* All Deals Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="aspect-video bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Deals Section */}
            {!searchQuery && deals.length > 0 && (
              <section className="mb-12" aria-labelledby="featured-deals-heading">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="featured-deals-heading" className="text-2xl font-bold text-slate-900 dark:text-white">Featured Deals</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Hot deals right now</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deals.slice(0, 3).map((deal, index) => (
                    <div 
                      key={`featured-${deal.id}`}
                      className="group bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:scale-105 transform"
                    >
                      {/* Featured Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Flame className="w-3 h-3" />
                          Featured
                        </span>
                      </div>
                      
                      {/* Deal Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={[
                            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
                            'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&crop=center',
                            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center',
                            'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=800&h=600&fit=crop&crop=center',
                            'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800&h=600&fit=crop&crop=center',
                            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&crop=center'
                          ][index % 6]}
                          alt={`${deal.venue?.name || 'Restaurant'} food`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50 group-hover:from-black/40 group-hover:to-black/60 transition-all duration-300"></div>
                        
                        {/* Discount Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {deal.discount}% OFF
                          </span>
                        </div>

                        {/* Restaurant Name Overlay */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg group-hover:text-yellow-200 transition-colors">
                            {deal.venue?.name || 'Amazing Restaurant'}
                          </h3>
                          <p className="text-white/80 text-sm flex items-center gap-1">
                            {deal.cuisine} • 
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(deal.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-white/40'}`} />
                              ))}
                              <span className="ml-1">{deal.rating || '4.5'}</span>
                            </div>
                          </p>
                        </div>
                      </div>

                      {/* Deal Info */}
                      <div className="p-6">
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                          {deal.description || "Amazing deal available now!"}
                        </p>
                        
                        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105 transform">
                          View Featured Deal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Deals Section */}
            {viewMode === 'grid' ? (
              <section aria-labelledby="all-deals-heading">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="all-deals-heading" className="text-2xl font-bold text-slate-900 dark:text-white">All Deals</h2>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {deals.length} {deals.length === 1 ? 'deal' : 'deals'} available
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((deal, index) => (
              <div 
                key={deal.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:scale-102 transform"
              >
                {/* Deal Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={[
                      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
                      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&crop=center',
                      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center',
                      'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=800&h=600&fit=crop&crop=center',
                      'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=800&h=600&fit=crop&crop=center',
                      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&crop=center'
                    ][index % 6]}
                    alt={`${deal.venue?.name || 'Restaurant'} food`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/30 group-hover:to-black/50 transition-all duration-300"></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {deal.discount}% OFF
                    </span>
                  </div>

                  {/* AI Score Badge */}
                  {deal.score && deal.score > 50 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Brain className="w-3 h-3" />
                        {Math.round(deal.score)}%
                      </span>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button 
                    className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-400 hover:text-red-500 transition-all duration-200 p-2 rounded-full shadow-lg hover:scale-110 group-hover:bg-white group-hover:shadow-xl"
                    aria-label="Add to favorites"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Restaurant Name Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg group-hover:text-yellow-200 transition-colors">
                      {deal.venue?.name || 'Amazing Restaurant'}
                    </h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      {deal.cuisine} • 
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.floor(deal.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-white/40'}`} />
                        ))}
                        <span className="ml-1">{deal.rating || '4.5'}</span>
                      </div>
                    </p>
                  </div>
                </div>

                {/* Deal Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 text-sm">
                        {Math.floor(Math.random() * 30) + 10} min away
                      </span>
                    </div>
                    {deal.redeemedCount && deal.redeemedCount > 0 && (
                      <div className="flex items-center gap-1 text-green-500 text-sm">
                        <Users className="w-4 h-4" />
                        {deal.redeemedCount} claimed
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                    {deal.description || "Amazing deal available now!"}
                  </p>
                  
                  <button 
                    onClick={() => router.push(`/deal/${deal.id}/view`)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105 transform"
                  >
                    View Deal
                  </button>
                </div>
              </div>
            ))}
                </div>
              </section>
            ) : (
              <div className="h-[600px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                <MapWithClusters deals={deals} />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && deals.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              No deals found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Try adjusting your search terms or filters to find more deals.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                fetchInitialDeals();
                setAiResponse(null);
              }}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Clear search and show all available deals"
            >
              Show All Deals
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
}