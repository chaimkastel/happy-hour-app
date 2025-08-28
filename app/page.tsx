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
  distance: number;
  discount: number;
  sort: 'nearby' | 'discount' | 'new';
}

export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    cuisine: '',
    distance: 10,
    discount: 0,
    sort: 'nearby'
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        // Transform the data to include venue information
        const transformedDeals = data.map((deal: any) => ({
          ...deal,
          venue: {
            latitude: deal.restaurant?.latitude || 40.7128,
            longitude: deal.restaurant?.longitude || -74.0060,
            name: deal.restaurant?.name || 'Restaurant'
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
    const matchesDiscount = deal.discount >= filters.discount;
    
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
      {/* Simplified Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center text-white">
            {/* Main Headline */}
            <div className="animate-slide-in-down">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Instant Deals at Restaurants Near You
              </h1>
            </div>
            
            {/* Subheadline */}
            <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
              <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90 leading-relaxed">
                Save up to 70% when restaurants are quiet
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button 
                  onClick={() => window.location.href = '/deals'}
                  className="group bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center gap-3"
                >
                  <MapPin className="w-5 h-5" />
                  See Deals Near You
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-white/30 transition-all duration-300 border border-white/30 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Download App
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Deals Preview */}
      <div className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Live Deals Right Now
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Fresh deals updated every minute
            </p>
          </div>
          
          {/* Deal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDeals.slice(0, 6).map((deal, index) => (
              <div 
                key={deal.id} 
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-600 transform hover:-translate-y-1"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                      {deal.description}
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-red-500 transition-colors p-1">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-semibold">
                      {deal.discount}% OFF
                    </span>
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
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                    Claim Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => window.location.href = '/deals'}
              className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Deals
            </button>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">4.9★</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">App Rating</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">50K+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,247</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Live Deals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}