'use client';

import React, { useState } from 'react';
import { Search, MapPin, Clock, Star, Filter } from 'lucide-react';

export default function SmartSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect to explore page with search query
      window.location.href = `/explore?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
        <input
          type="text"
          placeholder="Search restaurants, cuisines, or deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-32 py-4 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:border-yellow-400 focus:outline-none transition-all duration-300 text-white placeholder-white/60 shadow-2xl"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          🔍 Search
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-200"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </button>
        
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button className="flex-shrink-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium border border-yellow-400/30 hover:bg-yellow-400/30 transition-all duration-200">
            <MapPin className="w-4 h-4 inline mr-1" />
            Near Me
          </button>
          <button className="flex-shrink-0 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
            <Clock className="w-4 h-4 inline mr-1" />
            Open Now
          </button>
          <button className="flex-shrink-0 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
            <Star className="w-4 h-4 inline mr-1" />
            Top Rated
          </button>
          <button className="flex-shrink-0 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
            💰 Best Deals
          </button>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {showFilters && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Cuisine</label>
              <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
                <option value="">All Cuisines</option>
                <option value="italian">Italian</option>
                <option value="chinese">Chinese</option>
                <option value="mexican">Mexican</option>
                <option value="japanese">Japanese</option>
                <option value="indian">Indian</option>
                <option value="american">American</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Price Range</label>
              <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
                <option value="">Any Price</option>
                <option value="1">$ (Budget)</option>
                <option value="2">$$ (Moderate)</option>
                <option value="3">$$$ (Expensive)</option>
                <option value="4">$$$$ (Luxury)</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Distance</label>
              <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
                <option value="">Any Distance</option>
                <option value="1">Within 1 mile</option>
                <option value="3">Within 3 miles</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Popular Searches */}
      <div className="text-center">
        <p className="text-white/60 text-sm mb-2">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Pizza', 'Sushi', 'Burger', 'Tacos', 'Pasta', 'Ramen'].map((term) => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}