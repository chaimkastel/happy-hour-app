'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search, Star, TrendingUp, Zap, Heart, ArrowRight, Play, Shield, Award, Globe, Smartphone, CreditCard, Timer, CheckCircle, Sparkles } from 'lucide-react';
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
      {/* Epic Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 overflow-hidden min-h-screen flex items-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Floating Food Elements */}
        <div className="absolute top-16 left-8 animate-float">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🍕</span>
          </div>
        </div>
        <div className="absolute top-32 right-16 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-2xl">🍔</span>
          </div>
        </div>
        <div className="absolute bottom-32 left-16 animate-float" style={{animationDelay: '4s'}}>
          <div className="w-18 h-18 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-2xl">🍜</span>
          </div>
        </div>
        <div className="absolute top-48 right-32 animate-float" style={{animationDelay: '1s'}}>
          <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-xl">☕</span>
          </div>
        </div>
        <div className="absolute bottom-48 right-8 animate-float" style={{animationDelay: '3s'}}>
          <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-lg">🍰</span>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="text-center text-white">
            {/* Badge */}
            <div className="animate-slide-in-down">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-semibold">Join 50,000+ food lovers saving money daily</span>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="animate-slide-in-down" style={{animationDelay: '0.2s'}}>
              <h1 className="text-7xl md:text-9xl font-black mb-8 hero-text-shadow leading-tight">
                Happy Hour
              </h1>
            </div>
            
            {/* Subtitle */}
            <div className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
              <p className="text-2xl md:text-4xl mb-4 max-w-5xl mx-auto text-white/95 leading-relaxed font-medium">
                Restaurants flip the switch when they're quiet.
              </p>
              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white/80">
                You get instant deals nearby. Save up to 70% on amazing food.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="animate-scale-in" style={{animationDelay: '0.6s'}}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button className="group bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-3">
                  <Smartphone className="w-6 h-6" />
                  Download App
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/30 transition-all duration-300 border border-white/30 flex items-center gap-3">
                  <Play className="w-6 h-6" />
                  Watch Demo
                </button>
              </div>
            </div>
            
            {/* Live Stats */}
            <div className="animate-fade-in" style={{animationDelay: '0.8s'}}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/25 transition-all duration-300 border border-white/20">
                  <div className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-300" />
                    1,247
                  </div>
                  <div className="text-white/90 text-lg font-semibold">Live Deals</div>
                  <div className="text-white/70 text-sm">Updated every minute</div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/25 transition-all duration-300 border border-white/20">
                  <div className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-300" />
                    68%
                  </div>
                  <div className="text-white/90 text-lg font-semibold">Avg Savings</div>
                  <div className="text-white/70 text-sm">On every deal</div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/25 transition-all duration-300 border border-white/20">
                  <div className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
                    <Users className="w-8 h-8 text-blue-300" />
                    2.3k
                  </div>
                  <div className="text-white/90 text-lg font-semibold">Active Now</div>
                  <div className="text-white/70 text-sm">People saving money</div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/25 transition-all duration-300 border border-white/20">
                  <div className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
                    <Star className="w-8 h-8 text-purple-300" />
                    4.9★
                  </div>
                  <div className="text-white/90 text-lg font-semibold">App Rating</div>
                  <div className="text-white/70 text-sm">50k+ reviews</div>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="animate-scale-in" style={{animationDelay: '1s'}}>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-slate-400 w-7 h-7" />
                  <input
                    type="text"
                    placeholder="Search for deals, restaurants, or cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-20 pr-8 py-6 text-2xl bg-white/95 dark:bg-slate-800/95 border-2 border-white/40 rounded-3xl focus:border-white/80 focus:outline-none transition-all duration-300 shadow-2xl backdrop-blur-sm placeholder:text-slate-400"
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-primary-700 transition-colors">
                    Search
                  </button>
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

      {/* Product Features Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-neutral-100 dark:from-slate-900 dark:to-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Why 50,000+ people choose Happy Hour
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 mb-8">
              The Future of
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Food Deals</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Real-time deals from restaurants that need customers. No coupons, no hassle, just instant savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-600">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Timer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Real-Time Deals</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Restaurants activate deals instantly when they need customers. No waiting, no expired coupons.
              </p>
            </div>
            
            <div className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-accent-300 dark:hover:border-accent-600">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Nearby & Fresh</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Find deals within walking distance. Fresh food, local restaurants, supporting your community.
              </p>
            </div>
            
            <div className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-secondary-300 dark:hover:border-secondary-600">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">One-Tap Claim</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Claim deals in seconds. Show your phone at the restaurant. No apps to download, no accounts needed.
              </p>
            </div>
            
            <div className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-600">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Verified Restaurants</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Every restaurant is verified and rated. Quality guaranteed, or your money back.
              </p>
            </div>
            
            <div className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-accent-300 dark:hover:border-accent-600">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">No Hidden Fees</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Pay only what you see. No service fees, no tips required, no surprises at checkout.
              </p>
            </div>
            
            <div className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-secondary-300 dark:hover:border-secondary-600">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Global Network</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Works in 50+ cities worldwide. Traveling? Find deals wherever you go.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              How It Works
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Three simple steps to start saving money on amazing food
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <Search className="w-12 h-12 text-white" />
              </div>
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">1</div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Discover</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse live deals from restaurants near you. See real-time availability and savings.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
              <div className="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">2</div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Claim</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Tap to claim your deal instantly. Get a unique code valid for 2 hours.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="w-8 h-8 bg-secondary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold">3</div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Enjoy</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Show your code at the restaurant and enjoy your meal with instant savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}