'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search, Star, TrendingUp, Zap, Heart, ArrowRight, Play, Shield, Award, Globe, Smartphone, CreditCard, Timer, CheckCircle, Sparkles, X, ChevronDown, Loader2, Flame, Gift, Target, Rocket, Crown, Diamond, Brain, Lightbulb, Sparkle, Wand2 } from 'lucide-react';
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

export default function ExplorePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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

  // AI-powered search
  const performAISearch = async (query: string) => {
    if (!query.trim()) return;
    
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
            location: 'current', // Could be enhanced with actual user location
            preferredCuisines: [],
            maxDistance: 10
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

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    performAISearch(query);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* AI-Powered Header */}
      <div className="relative bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-6">
              <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-purple-400 font-bold">AI-POWERED SEARCH</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              🧠 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Smart</span> Deal Discovery
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Tell our AI what you're craving and discover the perfect deals tailored just for you!
            </p>
          </div>

          {/* AI Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <Brain className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-400 w-6 h-6 animate-pulse" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Try: 'I want cheap pizza near me' or 'fancy dinner with 50% off'..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="w-full pl-16 pr-32 py-6 text-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-3xl focus:border-purple-400 focus:outline-none transition-all duration-300 text-white placeholder-white/60 shadow-2xl"
              />
              <button 
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Wand2 className="w-5 h-5 inline mr-2" />
                AI Search
              </button>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl z-50">
                <div className="p-4">
                  <div className="text-white/80 text-sm mb-3 font-semibold">Recent Searches</div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                  
                  <div className="border-t border-white/20 my-3"></div>
                  
                  <div className="text-white/80 text-sm mb-3 font-semibold">Popular Searches</div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.slice(0, 6).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex justify-center">
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

      {/* AI Insights */}
      {aiResponse && aiResponse.insights.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">AI Insights</h3>
            </div>
            <div className="space-y-2">
              {aiResponse.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Sparkle className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p className="text-white/90">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {aiResponse && aiResponse.suggestions.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Smart Suggestions</h3>
            </div>
            <div className="space-y-2">
              {aiResponse.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-white/90">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AI is thinking...</h3>
                <p className="text-white/80">Finding the perfect deals for you</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && deals.length > 0 && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    🎯 {deals.length} Perfect Matches Found
                  </h2>
                  <p className="text-white/80">
                    AI-ranked results for "{aiResponse?.query}"
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {Math.round(deals.reduce((acc, deal) => acc + deal.discount, 0) / deals.length) || 0}%
                  </div>
                  <div className="text-white/80 text-sm">Average Savings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal, index) => (
                <div 
                  key={deal.id}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 hover:bg-white/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* AI Score Badge */}
                  {deal.score && deal.score > 50 && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        AI Match {Math.round(deal.score)}%
                      </span>
                    </div>
                  )}

                  {/* Restaurant Image */}
                  <div className="relative h-56 bg-gradient-to-br from-purple-400/20 to-pink-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30"></div>
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                        <Flame className="w-4 h-4 animate-pulse" />
                        {deal.discount}% OFF
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:text-red-400 transition-colors p-3 rounded-full shadow-lg hover:bg-white/30">
                      <Heart className="w-5 h-5" />
                    </button>

                    {/* Restaurant Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                        {deal.venue?.name || 'Amazing Restaurant'}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {deal.cuisine} • {deal.rating ? `${deal.rating}⭐` : '4.5⭐'}
                      </p>
                    </div>
                  </div>

                  {/* Deal Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-white/80 text-sm">
                          {Math.floor(Math.random() * 30) + 10} min away
                        </span>
                      </div>
                      {deal.redeemedCount && deal.redeemedCount > 0 && (
                        <div className="flex items-center gap-1 text-green-400 text-sm">
                          <Users className="w-4 h-4" />
                          {deal.redeemedCount} claimed
                        </div>
                      )}
                    </div>
                    
                    <p className="text-white/70 text-sm mb-6 line-clamp-2">
                      {deal.description || "Amazing AI-recommended deal!"}
                    </p>
                    
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                      🧠 Claim AI Deal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[700px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
              <MapWithClusters deals={deals} />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && deals.length === 0 && aiResponse && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🧠</div>
            <h3 className="text-3xl font-bold text-white mb-6">
              No matches found for "{aiResponse.query}"
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Try different search terms or be more specific about what you're looking for.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.slice(0, 4).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!loading && deals.length === 0 && !aiResponse && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-8xl mb-6">🧠</div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to discover amazing deals?
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Use our AI-powered search to find exactly what you're craving. Just type what you want and let our AI do the magic!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.slice(0, 6).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
