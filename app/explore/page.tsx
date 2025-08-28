'use client';

import { useState, useEffect, useRef } from 'react';
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
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
            />
            <button 
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50">
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <>
                    <div className="text-slate-600 dark:text-slate-400 text-sm mb-3 font-semibold">Recent Searches</div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
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
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
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
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Searching for the best deals...</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <div 
                key={deal.id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                {/* Deal Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {deal.discount}% OFF
                    </span>
                  </div>

                  {/* AI Score Badge */}
                  {deal.score && deal.score > 50 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        {Math.round(deal.score)}%
                      </span>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full shadow-lg">
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Restaurant Name Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">
                      {deal.venue?.name || 'Amazing Restaurant'}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {deal.cuisine} • {deal.rating ? `${deal.rating}⭐` : '4.5⭐'}
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
                  
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                    View Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <MapWithClusters deals={deals} />
          </div>
        )}

        {/* Empty State */}
        {!loading && deals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
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
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Show All Deals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}