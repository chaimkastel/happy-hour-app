'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Clock, Star, Heart, Filter, Grid, List, ArrowRight } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  venue: {
    name: string;
    address: string;
  };
  cuisine: string;
  distance: string;
  rating: number;
  isOpen: boolean;
}

export default function ExplorePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async (searchTerm = '') => {
    try {
      setLoading(true);
      const url = searchTerm 
        ? `/api/deals/search?search=${encodeURIComponent(searchTerm)}`
        : '/api/deals/search';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const transformedDeals = (data.deals || []).map((deal: any) => ({
          id: deal.id,
          title: deal.title,
          description: deal.description,
          percentOff: deal.percentOff,
          venue: {
            name: deal.venue?.name || 'Restaurant',
            address: deal.venue?.address || 'Address not available'
          },
          cuisine: Array.isArray(deal.venue?.businessType) 
            ? deal.venue.businessType[0] 
            : deal.venue?.businessType || 'Restaurant',
          distance: '0.5 mi',
          rating: deal.venue?.rating || 4.0,
          isOpen: true
        }));
        setDeals(transformedDeals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/deal/${dealId}/view`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      setLoading(true);
      fetchDeals(query);
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'near') return deal.distance.includes('0.5') || deal.distance.includes('0.3');
    if (activeFilter === 'open') return deal.isOpen;
    if (activeFilter === 'top') return deal.rating >= 4.5;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Explore</h1>
            <p className="text-white/70 text-sm">Discover amazing deals</p>
          </div>
        </div>

          {/* Search Bar */}
          <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
            placeholder="Search restaurants, cuisines, deals..."
              value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/20 transition-all duration-200 shadow-lg"
          />
          </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
                      <button
            onClick={() => setActiveFilter('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === 'all' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
            }`}
          >
            <Grid className="w-4 h-4 inline mr-1" />
            All
                      </button>
                    <button
            onClick={() => setActiveFilter('near')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === 'near' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Near Me
                    </button>
                <button
            onClick={() => setActiveFilter('open')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === 'open' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Open Now
                </button>
                <button
            onClick={() => setActiveFilter('top')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === 'top' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
            }`}
          >
            <Star className="w-4 h-4 inline mr-1" />
            Top Rated
                </button>
              </div>

              {/* Results Count */}
        <div className="text-white/70 text-sm mb-4">
          {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
        </div>
      </div>

      {/* Deals List */}
      <div className="px-4 pb-24">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 animate-pulse">
                <div className="h-36 bg-white/20 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  <div className="h-3 bg-white/20 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No deals found</h3>
            <p className="text-white/70 text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeals.map((deal, index) => (
              <div 
                key={deal.id}
                onClick={() => handleDealClick(deal.id)}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-xl active:scale-95 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Deal Image */}
                <div className="relative h-36 mb-4 rounded-xl overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center&auto=format&q=80)`
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {deal.percentOff}% OFF
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-300 mr-1" />
                        <span className="text-white text-xs font-medium">{deal.rating}</span>
                    </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deal.isOpen 
                          ? 'bg-green-500/80 text-white' 
                          : 'bg-red-500/80 text-white'
                      }`}>
                        {deal.isOpen ? 'Open' : 'Closed'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{deal.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{deal.venue.name}</p>
                    <p className="text-white/60 text-xs mt-1">{deal.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-white/70 text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{deal.distance}</span>
                      </div>
                      <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                        {deal.cuisine}
                      </span>
                    </div>
                    <button className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
  );
}