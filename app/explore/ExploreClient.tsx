'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Grid, List, MapPin, Star, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { DealsResponse, DealFilters } from '@/lib/server/deals';

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
  venue: {
    id: string;
    name: string;
    address: string;
    businessType: string[];
    priceTier: string;
    rating: number;
    latitude: number;
    longitude: number;
    photos: string[];
  };
}

interface ExploreClientProps {
  initialData: DealsResponse;
  filters: DealFilters;
}

export default function ExploreClient({ initialData, filters: initialFilters }: ExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [deals, setDeals] = useState<Deal[]>(initialData.deals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<DealFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    limit: initialData.limit,
    offset: initialData.offset,
    total: initialData.total,
    hasMore: initialData.hasMore
  });

  const cuisineOptions = [
    { value: '', label: 'All Cuisines' },
    { value: 'american', label: 'American' },
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'indian', label: 'Indian' },
    { value: 'thai', label: 'Thai' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'french', label: 'French' },
    { value: 'greek', label: 'Greek' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'middle-eastern', label: 'Middle Eastern' },
    { value: 'caribbean', label: 'Caribbean' },
    { value: 'latin-american', label: 'Latin American' },
    { value: 'african', label: 'African' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'steakhouse', label: 'Steakhouse' },
    { value: 'pizza', label: 'Pizza' },
    { value: 'burger', label: 'Burger' },
    { value: 'sushi', label: 'Sushi' },
    { value: 'bbq', label: 'BBQ' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'coffee', label: 'Coffee/Tea' },
    { value: 'bar', label: 'Bar/Pub' },
    { value: 'other', label: 'Other' }
  ];

  const fetchDeals = async (newFilters: DealFilters, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (newFilters.search) params.append('search', newFilters.search);
      if (newFilters.cuisine) params.append('cuisine', newFilters.cuisine);
      if (newFilters.minDiscount) params.append('minDiscount', newFilters.minDiscount);
      if (newFilters.openNow) params.append('openNow', 'true');
      if (newFilters.sortBy) params.append('sortBy', newFilters.sortBy);
      params.append('limit', (newFilters.limit || 20).toString());
      params.append('offset', reset ? '0' : (newFilters.offset || 0).toString());

      const response = await fetch(`/api/deals?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data: DealsResponse = await response.json();
      
      if (reset) {
        setDeals(data.deals);
      } else {
        setDeals(prev => [...prev, ...data.deals]);
      }
      
      setPagination(prev => ({
        ...prev,
        offset: reset ? data.offset + data.limit : prev.offset + data.limit,
        total: data.total,
        hasMore: data.hasMore
      }));

    } catch (err) {
      console.error('Error fetching deals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<DealFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, offset: 0 };
    setFilters(updatedFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        params.set(key, value.toString());
      }
    });
    
    router.push(`/explore?${params.toString()}`);
    
    // Fetch new data
    fetchDeals(updatedFilters, true);
  };

  const handleLoadMore = () => {
    fetchDeals(filters, false);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endAt: string) => {
    const now = new Date();
    const end = new Date(endAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Less than 1h left';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search deals..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Cuisine */}
          <select
            value={filters.cuisine || ''}
            onChange={(e) => handleFilterChange({ cuisine: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {cuisineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Min Discount */}
          <select
            value={filters.minDiscount || ''}
            onChange={(e) => handleFilterChange({ minDiscount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Discount</option>
            <option value="10">10%+ Off</option>
            <option value="20">20%+ Off</option>
            <option value="30">30%+ Off</option>
            <option value="40">40%+ Off</option>
            <option value="50">50%+ Off</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="discount">Highest Discount</option>
            <option value="rating">Highest Rated</option>
            <option value="distance">Nearest</option>
          </select>
        </div>

        {/* Additional Filters */}
        <div className="mt-4 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.openNow || false}
              onChange={(e) => handleFilterChange({ openNow: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Open Now</span>
          </label>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {pagination.total} deals found
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchDeals(filters, true)}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && deals.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or check back later for new deals.
          </p>
          <div className="mt-6">
            <button
              onClick={() => handleFilterChange({ search: '', cuisine: '', minDiscount: '', openNow: false })}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Deals Grid/List */}
      {deals.length > 0 && (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'p-6 flex items-center space-x-4' : 'p-6'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {deal.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {deal.venue.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {deal.venue.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {deal.percentOff}% OFF
                      </div>
                      {deal.minSpend && (
                        <div className="text-xs text-gray-500">
                          Min spend: ${deal.minSpend}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {deal.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {deal.venue.rating.toFixed(1)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeRemaining(deal.endAt)}
                      </div>
                    </div>
                    <div>
                      {deal.redeemedCount}/{deal.maxRedemptions} claimed
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/deal/${deal.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      View Deal
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {deal.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {deal.venue.name} • {deal.venue.address}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {deal.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {deal.percentOff}% OFF
                        </div>
                        {deal.minSpend && (
                          <div className="text-xs text-gray-500">
                            Min spend: ${deal.minSpend}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {deal.venue.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeRemaining(deal.endAt)}
                      </div>
                    </div>
                    <Link
                      href={`/deal/${deal.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      View Deal
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {pagination.hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More Deals'}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </button>
        </div>
      )}
    </div>
  );
}
