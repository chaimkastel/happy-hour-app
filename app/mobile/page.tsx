'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
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
}

// Mock data with more sophisticated structure
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
    featured: true
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
    validUntil: '3:00 PM'
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
    validUntil: '10:00 PM'
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
    validUntil: '2:00 PM'
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
    validUntil: '2:00 AM'
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
    validUntil: '8:00 PM'
  }
];

export default function MobileExplorePage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(mockDeals);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
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
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Food', 'Drinks', 'Brunch'].map((category) => (
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
}