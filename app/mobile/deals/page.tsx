'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, MapPin, Clock, Star, Heart, Share2, ChevronDown } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  cuisine: string;
  venue: {
    name: string;
    address: string;
    rating: number;
    distance: number;
  };
  image: string;
  timeLeft: number;
  isFavorite: boolean;
}

export default function MobileDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Fast Food'];

  const handleBack = () => {
    window.history.back();
  };

  const toggleFavorite = (dealId: string) => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, isFavorite: !deal.isFavorite } : deal
    ));
  };

  const shareDeal = (deal: Deal) => {
    if (navigator.share) {
      navigator.share({
        title: deal.title,
        text: `Check out this amazing deal: ${deal.discount}% off at ${deal.venue.name}`,
        url: window.location.href
      });
    }
  };

  useEffect(() => {
    // Simulate loading deals
    setTimeout(() => {
      setDeals([
        {
          id: '1',
          title: '50% Off Pasta Night',
          description: 'All pasta dishes half price during happy hour',
          discount: 50,
          cuisine: 'Italian',
          venue: {
            name: 'Bella Vista',
            address: '123 Main St, Brooklyn',
            rating: 4.5,
            distance: 0.8
          },
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          timeLeft: 45,
          isFavorite: false
        },
        {
          id: '2',
          title: 'Buy 1 Get 1 Free Tacos',
          description: 'Authentic Mexican tacos, buy one get one free',
          discount: 50,
          cuisine: 'Mexican',
          venue: {
            name: 'El Mariachi',
            address: '456 Oak Ave, Brooklyn',
            rating: 4.2,
            distance: 1.2
          },
          image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
          timeLeft: 120,
          isFavorite: true
        },
        {
          id: '3',
          title: '30% Off Sushi Rolls',
          description: 'Fresh sushi rolls at discounted prices',
          discount: 30,
          cuisine: 'Asian',
          venue: {
            name: 'Sakura Sushi',
            address: '789 Pine St, Brooklyn',
            rating: 4.7,
            distance: 0.5
          },
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
          timeLeft: 90,
          isFavorite: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.venue.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || deal.cuisine === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-xl">🍺</span>
              </div>
              <span className="text-gray-900 font-bold text-xl">Deals</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/mobile/explore'}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm"
              >
                Explore
              </button>
              <button
                onClick={() => window.location.href = '/mobile/login'}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/mobile/signup'}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-300"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Deals List */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="relative">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {deal.discount}% OFF
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{deal.title}</h3>
                        <p className="text-gray-600 text-sm">{deal.venue.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(deal.id)}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            deal.isFavorite 
                              ? 'bg-red-100 text-red-500' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${deal.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => shareDeal(deal)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all duration-300"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{deal.venue.distance} mi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{deal.venue.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{deal.timeLeft}m left</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.location.href = `/mobile/deal/${deal.id}`}
                      className="w-full mt-3 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300"
                    >
                      View Deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
