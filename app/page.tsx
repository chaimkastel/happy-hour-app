'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, MapPin, Clock, Users, Shield, Award, Smartphone, CreditCard, CheckCircle, Sparkles, Flame, Gift, Target, Rocket, Crown, Diamond, Heart, Zap, TrendingUp, Globe, Timer, Menu, X, Search, Filter, Grid, List } from 'lucide-react';
import Image from 'next/image';

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
    address: string;
  };
}

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        const dealsData = data.deals || data;
        const transformedDeals = dealsData.map((deal: any) => ({
          ...deal,
          discount: deal.percentOff || deal.discount || 0,
          cuisine: (deal.venue as any)?.businessType || deal.cuisine || 'Restaurant',
          venue: {
            latitude: deal.venue?.latitude || 40.7128,
            longitude: deal.venue?.longitude || -74.0060,
            name: deal.venue?.name || 'Restaurant',
            address: deal.venue?.address || '',
            businessType: (deal.venue as any)?.businessType || 'Restaurant'
          }
        }));
        setDeals(transformedDeals);
      } else {
        setDeals([]);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg md:text-xl">🍺</span>
              </div>
              <span className="text-white font-bold text-lg md:text-xl">Happy Hour</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => window.location.href = '/explore'}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                Explore
              </button>
              <button
                onClick={handleSignIn}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                {showMenu ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Menu className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uber Eats-inspired Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-16 md:top-20 left-3 right-3 md:left-4 md:right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Top Section - Sign Up & Log In */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleSignUp}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Sign up
              </button>
              <button
                onClick={handleSignIn}
                className="w-full bg-white text-black border border-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Log in
              </button>
            </div>

            {/* Middle Section - Menu Links */}
            <div className="space-y-1 mb-6">
              <button
                onClick={() => {
                  window.location.href = '/favorites';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                Favorites
              </button>
              <button
                onClick={() => {
                  window.location.href = '/deals';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                All Deals
              </button>
              <button
                onClick={() => {
                  window.location.href = '/about';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  window.location.href = '/how-it-works';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  window.location.href = '/faq';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                FAQ
              </button>
              <button
                onClick={() => {
                  window.location.href = '/contact';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                Contact Us
              </button>
            </div>

            {/* Bottom Section - App Promotion */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">🍺</span>
                </div>
                <span className="text-gray-700 font-medium">There's more to love in the app.</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  iPhone
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  Android
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-food-deals.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        {/* Enhanced overlay for better mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-[1px] md:backdrop-blur-sm"></div>
        
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 py-12 md:py-24 text-center max-w-7xl mx-auto">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in shadow-2xl">
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
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
              Happy Hour
            </h1>
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-spin drop-shadow-lg" />
              <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            </div>
          </div>
          
          {/* Compelling Headlines */}
          <div className="mb-8 sm:mb-12 animate-slide-in-up">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-2xl">Instant Deals</span> at Restaurants Near You
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-lg">
              Save up to <span className="font-bold text-yellow-300 drop-shadow-lg">70% OFF</span> when restaurants are quiet! 
              <br />
              <span className="text-base sm:text-lg text-white/95 drop-shadow-md">Real-time deals • Instant savings • No waiting</span>
            </p>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 animate-fade-in">
            <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-2xl p-4 sm:p-6 hover:bg-white/30 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-slate-200 dark:text-slate-100 mb-2 drop-shadow-lg">1,247</div>
              <div className="text-slate-300 dark:text-slate-300 text-sm sm:text-base">Live Deals Right Now</div>
            </div>
            <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-2xl p-4 sm:p-6 hover:bg-white/30 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-slate-200 dark:text-slate-100 mb-2 drop-shadow-lg">12.3k</div>
              <div className="text-slate-300 dark:text-slate-300 text-sm sm:text-base">Deals Claimed Today</div>
            </div>
            <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-2xl p-4 sm:p-6 hover:bg-white/30 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-2xl">
              <div className="text-2xl sm:text-3xl font-bold text-slate-200 dark:text-slate-100 mb-2 drop-shadow-lg">$47</div>
              <div className="text-slate-300 dark:text-slate-300 text-sm sm:text-base">Average Savings</div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8 sm:mb-12 animate-scale-in">
            <div className="relative">
              <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-300 w-5 h-5 sm:w-6 sm:h-6" />
              <input
                type="text"
                placeholder="Enter your address or city to find amazing deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 sm:pl-16 pr-24 sm:pr-32 py-4 sm:py-6 text-lg sm:text-xl bg-white/30 dark:bg-slate-800/60 backdrop-blur-xl border-2 border-white/40 dark:border-slate-600/50 rounded-2xl sm:rounded-3xl focus:border-white/60 dark:focus:border-slate-500 focus:outline-none transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-600 dark:placeholder-slate-300 shadow-2xl font-medium"
              />
              <button 
                type="button"
                aria-label="Search for deals"
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/30 dark:bg-slate-800/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-white/40 dark:hover:bg-slate-800/70 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/40 dark:border-slate-600/50">
                <span className="hidden sm:inline">Find Deals</span>
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </div>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-fade-in">
            <button 
              type="button"
              aria-label="Explore deals and offers"
              onClick={() => window.location.href = '/explore'}
              className="group bg-white/30 dark:bg-slate-800/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-2xl hover:bg-white/40 dark:hover:bg-slate-800/70 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3 sm:gap-4 border border-white/40 dark:border-slate-600/50"
            >
              <Rocket className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-bounce" />
              <span className="hidden sm:inline">Explore Deals</span>
              <span className="sm:hidden">Explore</span>
              <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Deals Preview */}
      <div className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-400/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-400/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-3 mb-6">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <span className="text-orange-600 font-bold">LIVE NOW</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Hot Deals</span> Near You
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              These deals are <span className="text-orange-500 font-bold">flying off the shelves</span>! 
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
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&auto=format&q=80)`
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50 group-hover:from-black/40 group-hover:to-black/60 transition-all duration-300"></div>
                  
                  {/* Hot Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Flame className="w-4 h-4 animate-pulse" />
                      {deal.discount}% OFF
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button 
                    type="button"
                    aria-label="Add to favorites"
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:text-orange-400 transition-colors p-3 rounded-full shadow-lg hover:bg-white/30">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Restaurant Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                      {deal.venue?.name || 'Restaurant'}
                    </h3>
                    <p className="text-white/90 text-sm flex items-center gap-2">
                      <span>{(deal.venue as any)?.businessType || 'Restaurant'}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-white/40'}`} />
                        ))}
                        <span className="ml-1">4.{Math.floor(Math.random() * 3) + 2}</span>
                      </div>
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
                    {deal.description || 'Special deal available now!'}
                  </p>
                  
                  <button 
                    type="button"
                    aria-label="Claim this deal"
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                    Claim This Deal
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Deals CTA */}
          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = '/deals'}
              className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-3xl font-black text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 hover:scale-105 flex items-center gap-4 mx-auto"
            >
              <Gift className="w-6 h-6 group-hover:animate-bounce" />
              View All Amazing Deals
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">🍺</span>
          </div>
          <span className="text-white font-bold text-lg">Happy Hour</span>
        </div>
        <p className="text-gray-400 text-sm">
          © 2025 Happy Hour. Find amazing deals near you.
        </p>
      </div>
    </div>
  );
}