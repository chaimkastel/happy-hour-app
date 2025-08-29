'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, MapPin, ChevronDown, SlidersHorizontal, Heart, Star, Clock, Eye } from 'lucide-react';
import MobileShell from '@/components/mobile/MobileShell';
import DealCard from '@/components/mobile/DealCard';
import FiltersSheet, { FilterState } from '@/components/mobile/FiltersSheet';
import LocationPicker from '@/components/mobile/LocationPicker';
import { AddressComponents } from '@/components/mobile/AddressAutocomplete';

// Types
interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  venue: {
    name: string;
    address: string;
  };
  distance: string;
  rating: number;
  isOpen: boolean;
  category: string;
  imageUrl?: string;
  validUntil?: string;
  featured?: boolean;
  priceRange?: string;
  cuisine?: string;
  deliveryTime?: string;
  deliveryFee?: string;
  reviewCount?: string;
}

// Enhanced mock data with hero-worthy content
const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Happy Hour Special',
    description: '50% off all drinks and appetizers during happy hour',
    percentOff: 50,
    venue: {
      name: 'The Local Pub',
      address: '123 Main St, Downtown'
    },
    distance: '0.3 mi',
    rating: 4.5,
    isOpen: true,
    category: 'Drinks',
    validUntil: '7:00 PM',
    featured: true,
    priceRange: '$$',
    cuisine: 'American',
    deliveryTime: '15 min',
    deliveryFee: '$0',
    reviewCount: '1,200+'
  },
  {
    id: '2',
    title: 'Lunch Deal',
    description: '30% off lunch entrees and sides',
    percentOff: 30,
    venue: {
      name: 'Bella Vista',
      address: '456 Oak Ave, Midtown'
    },
    distance: '0.7 mi',
    rating: 4.2,
    isOpen: true,
    category: 'Food',
    validUntil: '3:00 PM',
    priceRange: '$$$',
    cuisine: 'Italian',
    deliveryTime: '25 min',
    deliveryFee: '$2.99',
    reviewCount: '850+'
  },
  {
    id: '3',
    title: 'Dinner Special',
    description: 'Buy one get one free on select entrees',
    percentOff: 50,
    venue: {
      name: 'Spice Garden',
      address: '789 Pine St, Uptown'
    },
    distance: '1.2 mi',
    rating: 4.8,
    isOpen: false,
    category: 'Food',
    validUntil: '10:00 PM',
    priceRange: '$$',
    cuisine: 'Indian',
    deliveryTime: '35 min',
    deliveryFee: '$0',
    reviewCount: '2,100+'
  },
  {
    id: '4',
    title: 'Weekend Brunch',
    description: '25% off brunch items and bottomless mimosas',
    percentOff: 25,
    venue: {
      name: 'Sunrise Cafe',
      address: '321 Elm St, Riverside'
    },
    distance: '0.9 mi',
    rating: 4.3,
    isOpen: true,
    category: 'Brunch',
    validUntil: '2:00 PM',
    priceRange: '$$',
    cuisine: 'American',
    deliveryTime: '20 min',
    deliveryFee: '$1.99',
    reviewCount: '650+'
  },
  {
    id: '5',
    title: 'Late Night Bites',
    description: '40% off late night menu after 10pm',
    percentOff: 40,
    venue: {
      name: 'Midnight Diner',
      address: '654 Maple Ave, Eastside'
    },
    distance: '1.5 mi',
    rating: 4.1,
    isOpen: true,
    category: 'Food',
    validUntil: '2:00 AM',
    priceRange: '$',
    cuisine: 'Diner',
    deliveryTime: '30 min',
    deliveryFee: '$0',
    reviewCount: '420+'
  },
  {
    id: '6',
    title: 'Cocktail Hour',
    description: 'Premium cocktails at happy hour prices',
    percentOff: 35,
    venue: {
      name: 'Sky Lounge',
      address: '999 High St, Skyline'
    },
    distance: '2.1 mi',
    rating: 4.7,
    isOpen: true,
    category: 'Drinks',
    validUntil: '8:00 PM',
    priceRange: '$$$',
    cuisine: 'Cocktail Bar',
    deliveryTime: '45 min',
    deliveryFee: '$3.99',
    reviewCount: '1,800+'
  }
];

export default function MobileExplorePage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(mockDeals);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('explore');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Brooklyn, New York");
  const [filters, setFilters] = useState<FilterState>({
    categories: ['All'],
    priceRange: 'All',
    distance: 5,
    timeWindow: 'Now',
    isOpen: false
  });

  // Filter deals based on current filters
  useEffect(() => {
    let filtered = deals;

    // Category filter
    if (!filters.categories.includes('All')) {
      filtered = filtered.filter(deal => filters.categories.includes(deal.category));
    }

    // Open now filter
    if (filters.isOpen) {
      filtered = filtered.filter(deal => deal.isOpen);
    }

    // Distance filter (simplified - in real app would use actual coordinates)
    const maxDistance = filters.distance;
    filtered = filtered.filter(deal => {
      const distance = parseFloat(deal.distance);
      return distance <= maxDistance;
    });

    setFilteredDeals(filtered);
  }, [deals, filters]);

  const handleFavorite = useCallback((dealId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dealId)) {
        newFavorites.delete(dealId);
      } else {
        newFavorites.add(dealId);
      }
      return newFavorites;
    });
  }, []);

  const handleViewDeal = useCallback((dealId: string) => {
    // Navigate to deal detail page
    window.location.href = `/deal/${dealId}`;
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleLocationSelect = useCallback((address: AddressComponents) => {
    setCurrentLocation(address.formatted_address);
    // In a real app, you would update the deals based on the new location
  }, []);

  const handleSearchClick = () => {
    // Navigate to search page
    window.location.href = '/mobile/search';
  };

  return (
    <MobileShell
      headerProps={{
        showSearch: true,
        showLocation: true,
        onSearchClick: handleSearchClick,
        onLocationClick: () => setShowLocationPicker(true),
        locationText: currentLocation
      }}
    >
      <div className="p-4 space-y-6">
        {/* Hero Section - Inspired by Uber Eats */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-6xl">🍔</div>
            <div className="absolute bottom-4 left-4 text-4xl">🍺</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-20">🍕</div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Enjoy Amazing Deals?</h2>
            <p className="text-orange-100 mb-4">Fans of great food also love these deals</p>
            
            {/* Featured Deal Preview */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍺</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">The Local Pub</h3>
                  <p className="text-orange-100 text-sm">50% off drinks & appetizers</p>
                </div>
                <div className="text-right">
                  <div className="bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-bold">
                    50% OFF
                  </div>
                  <p className="text-orange-100 text-xs mt-1">15 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Food', 'Drinks', 'Brunch', 'Pizza', 'Sushi', 'Mexican', 'Italian'].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                const newCategories = category === 'All' ? ['All'] : [category];
                setFilters(prev => ({ ...prev, categories: newCategories }));
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filters.categories.includes(category)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredDeals.length} deals near you
            </h2>
            <div className="text-xl animate-bounce">🍔</div>
          </div>
          <p className="text-sm text-gray-600">
            {!filters.categories.includes('All') && `Filtered by ${filters.categories.join(', ').toLowerCase()}`}
            {filters.isOpen && ' • Open now'}
          </p>
        </div>
        
        {/* Deals List */}
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <DealCard 
              key={deal.id} 
              deal={deal} 
              onFavorite={handleFavorite}
              onView={handleViewDeal}
              isFavorited={favorites.has(deal.id)}
              variant={deal.featured ? 'featured' : 'standard'}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No deals found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Adjust Filters
            </button>
          </div>
        )}
      </div>

      {/* Filters FAB */}
      <button
        type="button"
        onClick={() => setShowFilters(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center z-40"
        aria-label="Open filters"
      >
        <Plus size={24} />
      </button>

      {/* Filters Bottom Sheet */}
      <FiltersSheet 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Location Picker */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={currentLocation}
      />
    </MobileShell>
  );
}// Deployment trigger Fri Aug 29 01:57:57 EDT 2025
