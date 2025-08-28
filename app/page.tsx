'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Filter, Grid, List, Search } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Happy Hour
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Restaurants flip the switch when they're quiet. You get instant deals nearby.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for deals, restaurants, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
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
                  ? 'bg-indigo-600 text-white'
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
    </div>
  );
}