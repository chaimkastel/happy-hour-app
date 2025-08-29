'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Clock } from 'lucide-react';
import MobileShell from '@/components/mobile/MobileShell';
import DealCard from '@/components/mobile/DealCard';

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
}

// Mock favorites data
const mockFavorites: Deal[] = [
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
    validUntil: '7:00 PM'
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
  }
];

export default function MobileFavoritesPage() {
  const [favorites, setFavorites] = useState<Deal[]>(mockFavorites);
  const [sortBy, setSortBy] = useState<'recent' | 'nearby'>('recent');

  const handleFavorite = (dealId: string) => {
    setFavorites(prev => prev.filter(deal => deal.id !== dealId));
  };

  const handleViewDeal = (dealId: string) => {
    window.location.href = `/deal/${dealId}`;
  };

  return (
    <MobileShell
      headerProps={{
        title: 'Favorites'
      }}
    >
      <div className="p-4 space-y-4">
        {/* Sort Options */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'recent'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Recently Saved
          </button>
          <button
            type="button"
            onClick={() => setSortBy('nearby')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'nearby'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Nearby
          </button>
        </div>

        {/* Favorites Count */}
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-red-500" />
          <span className="text-lg font-semibold text-gray-900">
            {favorites.length} saved deals
          </span>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((deal) => (
              <DealCard 
                key={deal.id} 
                deal={deal} 
                onFavorite={handleFavorite}
                onView={handleViewDeal}
                isFavorited={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-6">
              Save deals you love to see them here
            </p>
            <button
              type="button"
              onClick={() => window.location.href = '/mobile'}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Explore Deals
            </button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}