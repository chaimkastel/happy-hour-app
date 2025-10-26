'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Star, Clock, Filter, Heart, Grid, List as ListIcon, Map, DollarSign, DollarSign as Dollar2, DollarSign as Dollar3, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import BottomNav from '@/components/navigation/BottomNav';
import Image from 'next/image';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff?: number;
  startAt: string;
  endAt: string;
  venue: {
    name: string;
    address: string;
    rating?: number;
    businessType?: string[];
  };
}

export default function ExplorePageNew() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Best Value');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [filters, setFilters] = useState({
    time: 'now',
    price: [] as string[],
    dietary: [] as string[],
    distance: 'All',
  });
  const [showFilters, setShowFilters] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadDeals();
  }, [searchParams, sortBy, filters]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const queryParam = searchParams.get('q') || '';
      setSearchTerm(queryParam);
      
      const url = `/api/deals/search?q=${encodeURIComponent(queryParam)}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        let deals = data.deals || [];
        
        // Apply client-side sorting
        if (sortBy === 'Closest') {
          deals.sort((a: Deal, b: Deal) => {
            const aDist = Math.random() * 2; // Mock distance
            const bDist = Math.random() * 2;
            return aDist - bDist;
          });
        } else if (sortBy === 'Ending Soon') {
          deals.sort((a: Deal, b: Deal) => 
            new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
          );
        } else {
          deals.sort((a: Deal, b: Deal) => (b.percentOff || 0) - (a.percentOff || 0));
        }
        
        setDeals(deals);
      }
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleFavorite = async (dealId: string) => {
    try {
      const response = await fetch('/api/favorite/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle favorite state
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const togglePriceFilter = (price: string) => {
    setFilters(prev => ({
      ...prev,
      price: prev.price.includes(price) 
        ? prev.price.filter(p => p !== price)
        : [...prev.price, price]
    }));
  };

  const getDealImage = (deal: Deal) => {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
  };

  const DealCard = ({ deal, large = false }: { deal: Deal; large?: boolean }) => (
    <Link href={`/deal/${deal.id}/view`}>
      <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden ${
        large ? 'md:col-span-1' : ''
      }`}>
        <div className="relative h-48">
          <Image
            src={getDealImage(deal)}
            alt={deal.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 font-bold text-lg px-3 py-1 rounded-lg">
            {deal.percentOff || 0}% OFF
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(deal.id);
            }}
            className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{deal.venue.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{deal.title}</p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{deal.venue.rating || 4.5}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>0.3mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(deal.startAt).toLocaleTimeString([], { hour: 'numeric' })}-{new Date(deal.endAt).toLocaleTimeString([], { hour: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-orange-600 font-bold text-lg">
              {deal.percentOff}% off
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">Explore</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilters({ ...filters, time: filters.time === 'now' ? 'later' : 'now' })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filters.time === 'now'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Now
            </button>
            <button
              onClick={() => togglePriceFilter('$')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.price.includes('$')
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              $
            </button>
            <button
              onClick={() => togglePriceFilter('$$')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.price.includes('$$')
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              $$
            </button>
            <button
              onClick={() => togglePriceFilter('$$$')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.price.includes('$$$')
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              $$$
            </button>
          </div>

          {/* View Toggle & Sort */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map' ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option>Best Value</option>
              <option>Closest</option>
              <option>Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {deals.map(deal => (
              <DealCard key={deal.id} deal={deal} large={viewMode === 'list'} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No deals found"
            description="Try adjusting your search or filters"
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}

