'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Filter, 
  Grid, 
  List,
  ArrowRight,
  Menu,
  X,
  User,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Award,
  Zap,
  CreditCard,
  Building2,
  Compass
} from 'lucide-react';
import UnifiedLayout from '@/components/UnifiedLayout';
import DealCardSkeleton from '@/components/mobile/DealCardSkeleton';

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

export default function HomePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    console.log('Home page mounted, fetching deals...');
    const timer = setTimeout(() => {
      fetchDeals();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchDeals = async (searchTerm = '') => {
    try {
      console.log('fetchDeals called with searchTerm:', searchTerm);
      const url = searchTerm 
        ? `/api/deals/search?search=${encodeURIComponent(searchTerm)}`
        : '/api/deals/search';
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
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
        console.log('Transformed deals:', transformedDeals);
        setDeals(transformedDeals);
      } else {
        console.error('API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      const mockDeals = [
        {
          id: 'mock-1',
          title: 'Happy Hour Special',
          description: '50% off all drinks and appetizers',
          percentOff: 50,
          venue: {
            name: 'Sample Restaurant',
            address: '123 Main St, City, State'
          },
          cuisine: 'American',
          distance: '0.5 mi',
          rating: 4.5,
          isOpen: true
        },
        {
          id: 'mock-2',
          title: 'Lunch Deal',
          description: '30% off lunch entrees',
          percentOff: 30,
          venue: {
            name: 'Another Place',
            address: '456 Oak Ave, City, State'
          },
          cuisine: 'Italian',
          distance: '0.8 mi',
          rating: 4.2,
          isOpen: true
        }
      ];
      setDeals(mockDeals);
    } finally {
      console.log('Setting loading to false');
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
    <UnifiedLayout 
      showSearch={true}
      showBottomNav={true}
      title="Happy Hour"
      subtitle="Find amazing deals"
    >
      {/* Hero Section */}
      <div className="px-4 py-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-3 mb-6 shadow-2xl">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
            <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-white font-semibold text-sm">10,000+ Happy Customers</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-4 leading-tight drop-shadow-2xl">
          Happy Hour
        </h1>
        <p className="text-xl text-white mb-8 max-w-md mx-auto leading-relaxed drop-shadow-lg">
          Save up to <span className="font-bold text-yellow-300">70% OFF</span> when restaurants are quiet!
        </p>
      </div>

      {/* Deals List */}
      <div className="px-4 pb-24">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <DealCardSkeleton key={index} />
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
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredDeals.map((deal, index) => (
              <div 
                key={deal.id} 
                onClick={() => handleDealClick(deal.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDealClick(deal.id);
                  }
                }}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-xl active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ animationDelay: `${index * 100}ms` }}
                tabIndex={0}
                role="button"
                aria-label={`View deal: ${deal.title} at ${deal.venue.name}`}
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
                    <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm line-clamp-1">{deal.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{deal.venue.name}</p>
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">{deal.description}</p>
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
        ) : (
          <div className="space-y-4">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center">
              <MapPin className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Map View</h3>
              <p className="text-white/70 text-sm mb-4">
                Interactive map view coming soon! For now, use the list view to browse deals.
              </p>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Switch to List View
              </button>
            </div>
          </div>
        )}
      </div>
    </UnifiedLayout>
  );
}