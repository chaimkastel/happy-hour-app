'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Grid, List, MapPin, Star, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

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

interface DealsResponse {
  deals: Deal[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface Filters {
  search: string;
  cuisine: string;
  minDiscount: string;
  openNow: boolean;
  sortBy: 'newest' | 'discount' | 'rating' | 'distance';
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    minDiscount: searchParams.get('minDiscount') || '',
    openNow: searchParams.get('openNow') === 'true',
    sortBy: 'newest'
  });
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
    hasMore: false
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

  const fetchDeals = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.minDiscount) params.append('minDiscount', filters.minDiscount);
      if (filters.openNow) params.append('openNow', 'true');
      params.append('limit', pagination.limit.toString());
      params.append('offset', reset ? '0' : pagination.offset.toString());

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
      setError('Failed to load deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals(true);
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeals(true);
  };

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchDeals(false);
    }
  };

  const formatTimeRemaining = (endAt: string) => {
    const now = new Date();
    const end = new Date(endAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const DealCard = ({ deal }: { deal: Deal }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {deal.venue.photos.length > 0 && (
        <div className="h-48 bg-gray-200 relative">
          <img
            src={deal.venue.photos[0]}
            alt={deal.venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {deal.percentOff}% OFF
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {deal.title}
          </h3>
          <div className="flex items-center text-yellow-500 ml-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium ml-1">
              {deal.venue.rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {deal.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{deal.venue.name}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatTimeRemaining(deal.endAt)}</span>
          </div>
          <span className="capitalize">{deal.venue.priceTier.toLowerCase()}</span>
        </div>
        
        <Link
          href={`/deal/${deal.id}/view`}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center font-medium"
        >
          View Deal
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );

  const DealListItem = ({ deal }: { deal: Deal }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex gap-4">
        {deal.venue.photos.length > 0 && (
          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={deal.venue.photos[0]}
              alt={deal.venue.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900">
              {deal.title}
            </h3>
            <div className="flex items-center text-yellow-500 ml-4">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium ml-1">
                {deal.venue.rating.toFixed(1)}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {deal.description}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{deal.venue.name} • {deal.venue.address}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTimeRemaining(deal.endAt)}</span>
              </div>
              <span className="capitalize">{deal.venue.priceTier.toLowerCase()}</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                {deal.percentOff}% OFF
              </span>
            </div>
            
            <Link
              href={`/deal/${deal.id}/view`}
              className="bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center font-medium"
            >
              View Deal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchDeals(true)}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Deals</h1>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search deals, restaurants, or cuisines..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Search
              </button>
            </form>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {cuisineOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                value={filters.minDiscount}
                onChange={(e) => handleFilterChange('minDiscount', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Any Discount</option>
                <option value="10">10%+ Off</option>
                <option value="20">20%+ Off</option>
                <option value="30">30%+ Off</option>
                <option value="40">40%+ Off</option>
                <option value="50">50%+ Off</option>
              </select>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">Open Now</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {pagination.total} deal{pagination.total !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Deals Grid/List */}
        {loading && deals.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {deals.map((deal) => (
                viewMode === 'grid' ? (
                  <DealCard key={deal.id} deal={deal} />
                ) : (
                  <DealListItem key={deal.id} deal={deal} />
                )
              ))}
            </div>
            
            {pagination.hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Deals'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}