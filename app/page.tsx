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
    <div className="min-h-screen">
      {/* Hero Section - Grubhub Inspired */}
      <div className="relative bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Happy Hour
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
            </div>
            
            {/* Main Headline */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                Find great deals at restaurants near you
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Save up to 70% when restaurants are quiet. Real-time deals, instant savings.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your address or city"
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-primary-500 focus:outline-none transition-colors shadow-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                  Find Deals
                </button>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.location.href = '/deals'}
                className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <MapPin className="w-5 h-5" />
                Browse All Deals
              </button>
              <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-semibold text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Get the app
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Deals Section */}
      <div className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Popular deals near you
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Handpicked deals from top restaurants
            </p>
          </div>
          
          {/* Deal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDeals.slice(0, 6).map((deal, index) => (
              <div 
                key={deal.id} 
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200 dark:border-slate-700"
              >
                {/* Restaurant Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                  <div className="text-4xl">🍽️</div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {deal.venue?.name || 'Restaurant Name'}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                        {deal.cuisine} • {Math.floor(Math.random() * 5) + 1}⭐
                      </p>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-sm font-medium">
                        {deal.discount}% OFF
                      </span>
                      <span className="text-slate-500 text-sm">
                        {Math.floor(Math.random() * 30) + 10} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      {Math.floor(Math.random() * 5) + 0.5} mi
                    </div>
                  </div>
                  
                  <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    View Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => window.location.href = '/deals'}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-lg border border-slate-200 dark:border-slate-700"
            >
              See all deals
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Deals Discovery */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* View Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 flex gap-2">
                <button
                  onClick={() => setView('grid')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    view === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setView('map')}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    view === 'map'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Map
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-8">
              <SortFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                dealsCount={filteredDeals.length}
              />
            </div>
          </div>

          {/* Content */}
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} d={deal} />
              ))}
            </div>
          ) : (
            <div className="h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <MapWithClusters deals={filteredDeals} />
            </div>
          )}

          {filteredDeals.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍔</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                No deals found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Try adjusting your search or filters to find more deals
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
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              How Happy Hour works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Simple steps to save money on great food
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">1. Find deals</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Browse real-time deals from restaurants near you
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">2. Claim & save</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Tap to claim your deal and get instant savings
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">3. Enjoy</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Show your code at the restaurant and enjoy your meal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Restaurants Section */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              For Restaurants
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Turn quiet hours into revenue opportunities. Attract customers when you need them most.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Boost Revenue</h3>
              <p className="text-white/80">
                Fill empty tables during slow periods and increase your average order value
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attract New Customers</h3>
              <p className="text-white/80">
                Reach food lovers in your area who are actively looking for great deals
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Activation</h3>
              <p className="text-white/80">
                Create and activate deals in seconds. No complicated setup required
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg">
              Start Your Free Trial
            </button>
            <p className="text-white/80 mt-4 text-sm">No setup fees • Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}