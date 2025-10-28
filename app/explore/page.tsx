'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, Filter, Heart, Grid, List as ListIcon, SlidersHorizontal, X, Map, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import Image from 'next/image';
import BottomNav from '@/components/navigation/BottomNav';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff?: number;
  originalPrice?: number;
  discountedPrice?: number;
  startAt: string;
  endAt: string;
  image?: string;
  venue: {
    name: string;
    address: string;
    city?: string;
    state?: string;
    rating?: number;
    businessType?: string[];
  };
}

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { location, timeWindow } = useLocation();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'best-value');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>(
    () => (typeof window !== 'undefined' && localStorage.getItem('exploreViewMode')) as 'grid' | 'list' | 'map' || 'grid'
  );
  const [priceFilter, setPriceFilter] = useState(searchParams.get('price') || '');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const categories = ['All', 'Pizza', 'Sushi', 'Burgers', 'Italian', 'Mexican', 'Thai', 'Healthy', 'Cocktails'];
  const priceRanges = [
    { label: 'Budget', value: '$' },
    { label: 'Moderate', value: '$$' },
    { label: 'Premium', value: '$$$' }
  ];
  const sortOptions = [
    { label: 'Best Value', value: 'best-value' },
    { label: 'Closest', value: 'distance' },
    { label: 'Ending Soon', value: 'ending-soon' },
    { label: 'Top Rated', value: 'rating' }
  ];

  // Load deals
  useEffect(() => {
    loadDeals();
  }, [searchParams]);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: 'grid' | 'list' | 'map') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('exploreViewMode', mode);
    }
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (category && category !== 'All') params.set('category', category);
    if (sortBy && sortBy !== 'best-value') params.set('sort', sortBy);
    if (priceFilter) params.set('price', priceFilter);
    
    const newUrl = params.toString() ? `/explore?${params.toString()}` : '/explore';
    router.push(newUrl as any, { scroll: false });
  }, [searchTerm, category, sortBy, priceFilter, router]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/deals/mock');
      const data = await response.json();
      let allDeals = data.deals || [];
      
      // Apply filters
      if (searchTerm) {
        allDeals = allDeals.filter((deal: Deal) => 
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.venue.businessType?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (category && category !== 'All') {
        allDeals = allDeals.filter((deal: Deal) => 
          deal.venue.businessType?.some(t => t.toLowerCase().includes(category.toLowerCase()))
        );
      }

      // Apply sorting
      if (sortBy === 'ending-soon') {
        allDeals.sort((a: Deal, b: Deal) => 
          new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
        );
      } else if (sortBy === 'best-value') {
        allDeals.sort((a: Deal, b: Deal) => (b.percentOff || 0) - (a.percentOff || 0));
      } else if (sortBy === 'rating') {
        allDeals.sort((a: Deal, b: Deal) => (b.venue.rating || 0) - (a.venue.rating || 0));
      }
      
      setDeals(allDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (category !== 'All') params.set('category', category);
    if (sortBy) params.set('sort', sortBy);
    router.push(`/explore?${params.toString()}`);
  };

  const handleFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (category !== 'All') params.set('category', category);
    params.set(filterType, value);
    if (sortBy) params.set('sort', sortBy);
    router.push(`/explore?${params.toString()}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const DealCard = ({ deal }: { deal: Deal }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-100 cursor-pointer"
        onClick={() => router.push(`/deal/${deal.id}/view`)}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100">
          {deal.image ? (
            <Image
              src={deal.image}
              alt={deal.title}
              fill
              className="object-cover"
              sizes="400px"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl opacity-30">🍽️</div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Discount Badge */}
          {deal.percentOff && (
            <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
              {deal.percentOff}% OFF
            </div>
          )}
          
          {/* Favorite Button */}
          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-500'}`} />
          </motion.button>
          
          {/* Time Badge */}
          <div className="absolute bottom-3 left-3 backdrop-blur-sm bg-white/70 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700 shadow-md border border-white/20">
            <Clock className="w-3 h-3 text-orange-600" />
            <span>{formatTime(deal.startAt)}-{formatTime(deal.endAt)}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg text-slate-900 mb-1.5 line-clamp-1">
            {deal.venue.name}
          </h3>
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {deal.title}
          </p>
          
          {/* Rating & Distance */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            {deal.venue.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="font-semibold text-slate-700">{deal.venue.rating}</span>
              </div>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>0.8 mi</span>
            </span>
          </div>

          <Link
            href={`/deal/${deal.id}/view`}
            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-md transition-all"
          >
            View & Redeem
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20">
      {/* Sticky Premium Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
          {/* Location & Search */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full"
            >
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-slate-900">{location?.neighborhood || 'Brooklyn'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">•</span>
              <span className="text-sm text-slate-600">{timeWindow}</span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Find your perfect deal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </form>

          {/* Filters Bar */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* Categories */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter('category', cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* View Toggle */}
            <div className="ml-auto flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('map')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'map' 
                    ? 'bg-orange-50 text-orange-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm h-[400px] animate-pulse" />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={loadDeals}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : deals.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-7xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">No deals found</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategory('All');
                    router.push('/explore');
                  }}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-md transition-all"
                >
                  Browse All
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{deals.length}</span> {deals.length === 1 ? 'deal' : 'deals'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DealCard deal={deal} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
