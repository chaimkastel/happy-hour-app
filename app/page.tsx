'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search, Star, TrendingUp, Zap, Heart, ArrowRight, Shield, Award, Globe, Smartphone, CreditCard, Timer, CheckCircle, Sparkles, Flame, Gift, Target, Rocket, Crown, Diamond } from 'lucide-react';
import DealCard from '../components/DealCard';
import MapWithClusters from '../components/MapWithClusters';
import SortFilterBar from '../components/SortFilterBar';

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
}

interface Filters {
  cuisine: string;
  maxDistance: number;
  minDiscount: number;
  openNow: boolean;
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<Filters>({
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
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        // The API returns { deals: [...] }, so we need to access data.deals
        const dealsData = data.deals || data;
        // Transform the data to include venue information
        const transformedDeals = dealsData.map((deal: any) => ({
          ...deal,
          discount: deal.percentOff || deal.discount || 0,
          cuisine: deal.venue?.businessType || deal.cuisine || 'Restaurant',
          venue: {
            latitude: deal.venue?.latitude || 40.7128,
            longitude: deal.venue?.longitude || -74.0060,
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

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCuisine = !filters.cuisine || deal.cuisine.toLowerCase() === filters.cuisine.toLowerCase();
    const matchesDiscount = deal.discount >= filters.minDiscount;
    
    return matchesSearch && matchesCuisine && matchesDiscount;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section - Exciting & Engaging */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="text-center">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in">
              <div className="flex -space-x-1 sm:-space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base">10,000+ Happy Customers</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Main Brand */}
                        <div className="mb-6 sm:mb-8 animate-slide-in-down">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4 sm:mb-6 leading-tight">
            Happy Hour
          </h1>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
                <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-spin" />
                <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Compelling Headlines */}
                        <div className="mb-8 sm:mb-12 animate-slide-in-up">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Instant Deals</span> at Restaurants Near You
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8">
                Save up to <span className="font-bold text-yellow-400">70% OFF</span> when restaurants are quiet! 
                <br />
                <span className="text-base sm:text-lg text-white/80">Real-time deals • Instant savings • No waiting</span>
              </p>
          </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">247</div>
                <div className="text-white/80 text-sm sm:text-base">Live Deals Right Now</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">2.3k</div>
                <div className="text-white/80 text-sm sm:text-base">Deals Claimed Today</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-pink-400 mb-2">$127</div>
                <div className="text-white/80 text-sm sm:text-base">Average Savings</div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8 sm:mb-12 animate-scale-in">
              <div className="relative">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 sm:w-6 sm:h-6" />
                <input
                  type="text"
                  placeholder="Enter your address or city to find amazing deals..."
                  className="w-full pl-12 sm:pl-16 pr-24 sm:pr-32 py-4 sm:py-6 text-lg sm:text-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl sm:rounded-3xl focus:border-yellow-400 focus:outline-none transition-all duration-300 text-white placeholder-white/60 shadow-2xl"
                />
                <button className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  <span className="hidden sm:inline">Find Deals</span>
                  <span className="sm:hidden">Search</span>
                </button>
              </div>
            </div>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-fade-in">
              <button 
                onClick={() => window.location.href = '/explore'}
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 flex items-center gap-3 sm:gap-4"
              >
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-bounce" />
                <span className="hidden sm:inline">Explore Deals</span>
                <span className="sm:hidden">Explore</span>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Live Deals Preview - Exciting */}
      <div className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-3 mb-6">
              <Flame className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-bold">LIVE NOW</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              🔥 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Hot Deals</span> Near You
          </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              These deals are <span className="text-yellow-400 font-bold">flying off the shelves</span>! 
              Don't miss out on incredible savings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.slice(0, 6).map((deal, index) => (
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

          {/* View All Deals CTA */}
          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = '/deals'}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 rounded-3xl font-black text-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-4 mx-auto"
            >
              <Gift className="w-6 h-6 group-hover:animate-bounce" />
              View All Amazing Deals
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Deals Explorer */}
      <div className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 mb-6">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-blue-500 font-bold">EXPLORE & DISCOVER</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              🗺️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Interactive</span> Deals Explorer
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Switch between <span className="font-bold text-blue-500">grid view</span> and <span className="font-bold text-purple-500">interactive map</span> to find the perfect deals near you!
            </p>
          </div>

          {/* Enhanced View Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-2 flex gap-2 shadow-2xl">
              <button
                onClick={() => setView('grid')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                  view === 'grid'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Grid className="w-6 h-6" />
                Grid View
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                  view === 'map'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <MapPin className="w-6 h-6" />
                Map View
              </button>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl">
              <SortFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                dealsCount={filteredDeals.length}
              />
            </div>
          </div>

          {/* Content with Enhanced Styling */}
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDeals.map((deal, index) => (
                <div 
                  key={deal.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DealCard d={deal} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[700px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 dark:border-slate-700/20">
              <MapWithClusters deals={filteredDeals} />
            </div>
          )}

          {filteredDeals.length === 0 && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6 animate-bounce">🍔</div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                No deals found in your area
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Don't worry! Try expanding your search radius or adjusting your filters to discover amazing deals nearby.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    cuisine: '',
                    maxDistance: 10,
                    minDiscount: 0,
                    openNow: false
                  });
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                🔄 Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How It Works - Exciting */}
      <div className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-6 py-3 mb-6">
              <Rocket className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-500 font-bold">SUPER SIMPLE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              🚀 How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Happy Hour</span> Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get amazing deals in just <span className="font-bold text-emerald-500">3 simple steps</span>! 
              It's so easy, you'll be saving money in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">🔍 Find Amazing Deals</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Browse real-time deals from restaurants near you. Our smart algorithm shows you the best offers first!
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Smartphone className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">⚡ Claim & Save</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Tap to claim your deal instantly! Get your unique code and start saving money right away.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">🎉 Enjoy & Save</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Show your code at the restaurant and enjoy your delicious meal while saving big bucks!
              </p>
                </div>
              </div>
              
          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to Start Saving? 🎯
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                Join thousands of smart diners who are already saving money every day!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/deals'}
                  className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                >
                  <Diamond className="w-6 h-6 group-hover:animate-spin" />
                  Start Saving Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Restaurants Section - Exciting */}
      <div className="py-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-6">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-bold">FOR RESTAURANTS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              🏆 Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Quiet Hours</span> into <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Revenue Gold</span>
          </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Join <span className="font-bold text-yellow-300">500+ restaurants</span> already using Happy Hour to fill empty tables and boost revenue during slow periods!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center text-white group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  💰
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">🚀 Boost Revenue by 40%</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Fill empty tables during slow periods and increase your average order value with targeted deals
              </p>
            </div>
            
            <div className="text-center text-white group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  👥
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">🎯 Attract New Customers</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Reach food lovers in your area who are actively looking for great deals and new places to try
              </p>
            </div>
            
            <div className="text-center text-white group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ⚡
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Activation</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Create and activate deals in seconds. No complicated setup, no waiting, just instant results
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-white/90 mb-8">
                Join the restaurant revolution! Start your free trial today and see the difference in just 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-white text-orange-600 px-12 py-6 rounded-3xl font-black text-xl hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105 flex items-center gap-3">
                  <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                                  <button className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Watch Success Stories
            </button>
              </div>
              <p className="text-white/80 mt-6 text-sm">
                No setup fees • Cancel anytime • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}// Force deployment Thu Aug 28 01:24:27 EDT 2025
