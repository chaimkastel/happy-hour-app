'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Star, Clock, Filter, Heart, Grid, List as ListIcon, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonDealCard } from '@/components/ui/Skeleton';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff?: number;
  originalPrice?: number;
  discountedPrice?: number;
  startAt: string;
  endAt: string;
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
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { addToast } = useToast();

  const categories = ['All', 'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Seafood', 'Steakhouse', 'Cafe', 'Bar'];

  // Load deals on mount and when search params change
  useEffect(() => {
    const queryParam = searchParams.get('q') || searchParams.get('query') || '';
    const categoryParam = searchParams.get('category') || 'All';
    setSearchTerm(queryParam);
    setCategory(categoryParam);
    loadDeals(queryParam, categoryParam);
  }, [searchParams]);

  const loadDeals = async (query = '', categoryFilter = 'All') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/deals/search?';
      if (query) url += `q=${encodeURIComponent(query)}&`;
      if (categoryFilter && categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        let filteredDeals = data.deals || [];
        
        // Apply category filter on client side if needed
        if (categoryFilter && categoryFilter !== 'All') {
          filteredDeals = filteredDeals.filter((deal: Deal) => {
            const businessTypes = deal.venue?.businessType || [];
            return businessTypes.some(type => 
              type.toLowerCase().includes(categoryFilter.toLowerCase())
            );
          });
        }
        
        // Apply sorting
        if (sortBy === 'newest') {
          filteredDeals.sort((a: Deal, b: Deal) => 
            new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
          );
        } else if (sortBy === 'discount') {
          filteredDeals.sort((a: Deal, b: Deal) => 
            (b.percentOff || 0) - (a.percentOff || 0)
          );
        } else if (sortBy === 'ending-soon') {
          filteredDeals.sort((a: Deal, b: Deal) => 
            new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
          );
        }
        
        setDeals(filteredDeals);
      } else {
        setError('Failed to load deals. Please try again.');
        addToast({
          type: 'error',
          title: 'Failed to load deals',
          message: 'Please check your connection and try again'
        });
      }
    } catch (error) {
      console.error('Error loading deals:', error);
      setError('Network error. Please check your connection.');
      addToast({
        type: 'error',
        title: 'Network error',
        message: 'Please check your connection and try again'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (category !== 'All') params.set('category', category);
    router.push(`/explore?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (newCategory !== 'All') params.set('category', newCategory);
    router.push(`/explore?${params.toString()}`);
  };

  // Apply sorting when sortBy changes
  useEffect(() => {
    if (deals.length > 0) {
      const sorted = [...deals];
      if (sortBy === 'newest') {
        sorted.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
      } else if (sortBy === 'discount') {
        sorted.sort((a, b) => (b.percentOff || 0) - (a.percentOff || 0));
      } else if (sortBy === 'ending-soon') {
        sorted.sort((a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime());
      }
      setDeals(sorted);
    }
  }, [sortBy]);

  const toggleFavorite = async (dealId: string) => {
    try {
      const response = await fetch('/api/favorite/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (data.isFavorite) {
            newFavorites.add(dealId);
            addToast({
              type: 'success',
              title: 'Added to favorites',
              message: 'This deal has been saved to your favorites'
            });
          } else {
            newFavorites.delete(dealId);
            addToast({
              type: 'info',
              title: 'Removed from favorites',
              message: 'This deal has been removed from your favorites'
            });
          }
          return newFavorites;
        });
      } else {
        addToast({
          type: 'error',
          title: 'Failed to update favorites',
          message: 'Please try again'
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      addToast({
        type: 'error',
        title: 'Network error',
        message: 'Please check your connection and try again'
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isDealActive = (startAt: string, endAt: string) => {
    const now = new Date();
    const start = new Date(startAt);
    const end = new Date(endAt);
    return now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Explore Deals</h1>
          <p className="text-gray-600 mt-1">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Find amazing deals near you'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </form>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="discount">Highest Discount</option>
                <option value="ending-soon">Ending Soon</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonDealCard key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<div className="text-6xl mb-4">⚠️</div>}
            title="Something went wrong"
            description={error}
            action={{
              label: 'Try Again',
              onClick: () => loadDeals(searchTerm, category)
            }}
          />
        ) : deals.length === 0 ? (
          <EmptyState
            title={searchTerm || category !== 'All' ? `No deals found` : 'No deals available right now'}
            description={searchTerm || category !== 'All'
              ? 'Try adjusting your search terms or filters.'
              : 'Check back later for new deals from restaurants near you.'
            }
            action={searchTerm || category !== 'All' ? {
              label: 'Clear Filters',
              onClick: () => {
                setSearchTerm('');
                setCategory('All');
                router.push('/explore');
              }
            } : undefined}
            secondaryAction={{
              label: 'Browse All Deals',
              onClick: () => {
                setSearchTerm('');
                setCategory('All');
                router.push('/explore');
              }
            }}
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
            </div>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center relative">
                  <div className="text-6xl">🍺</div>
                  <button
                    onClick={() => toggleFavorite(deal.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.has(deal.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </button>
                  {isDealActive(deal.startAt, deal.endAt) && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Live Now
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {deal.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {deal.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{deal.venue.name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{deal.venue.city}, {deal.venue.state}</span>
                  </div>

                  {deal.percentOff && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-3">
                      {deal.percentOff}% OFF
                    </div>
                  )}

                  {deal.originalPrice && deal.discountedPrice && (
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-green-600">
                        ${(deal.discountedPrice / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${(deal.originalPrice / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        Save ${((deal.originalPrice - deal.discountedPrice) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {formatTime(deal.startAt)} - {formatTime(deal.endAt)}
                    </span>
                  </div>

                  <Link
                    href={`/deal/${deal.id}/view`}
                    className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    View Deal
                  </Link>
                </div>
              </div>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}