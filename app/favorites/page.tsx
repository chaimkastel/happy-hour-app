'use client';
import { useState } from 'react';
import AuthGuard from '@/lib/auth-guard';
import { 
  HeartIcon,
  StarIcon,
  LocationIcon,
  ClockIcon,
  ArrowRightIcon,
  UserIcon,
  WalletIcon,
  GridIcon,
  MapIcon,
  SearchIcon
} from '@/components/ui/ProfessionalIcons';

interface Deal {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  dealType: string;
  isActive: boolean;
  restaurant: {
    name: string;
    address: string;
    businessType: string;
    priceRange: string;
  };
  image?: string;
  rating?: number;
  distance?: string;
}

export default function FavoritesPage() {
  const [favorites] = useState<Deal[]>([
    {
      id: 'deal1',
      title: 'Late Lunch Happy Hour',
      description: '30% off pastas 3–5pm',
      discountPercent: 30,
      dealType: 'quiet_time',
      isActive: false,
      restaurant: {
        name: 'Crown Heights Trattoria',
        address: '123 Nostrand Ave, Brooklyn, NY',
        businessType: 'Italian',
        priceRange: '$$'
      },
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      rating: 4.5,
      distance: '0.8 mi'
    },
    {
      id: 'deal2',
      title: 'Early Bird Beer Special',
      description: '20% off all craft beers 4-6pm',
      discountPercent: 20,
      dealType: 'quiet_time',
      isActive: true,
      restaurant: {
        name: 'Brooklyn Brew House',
        address: '456 Atlantic Ave, Brooklyn, NY',
        businessType: 'American',
        priceRange: '$$'
      },
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      rating: 4.2,
      distance: '1.2 mi'
    },
    {
      id: 'deal3',
      title: 'Weekend Brunch Deal',
      description: '25% off brunch items 10am-12pm',
      discountPercent: 25,
      dealType: 'happy_blast',
      isActive: true,
      restaurant: {
        name: 'Sunset Diner',
        address: '789 Ocean Ave, Brooklyn, NY',
        businessType: 'American',
        priceRange: '$'
      },
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      rating: 4.7,
      distance: '0.5 mi'
    }
  ]);

  const removeFavorite = (dealId: string) => {
    console.log('Removing favorite:', dealId);
  };

  const getDealTypeLabel = (dealType: string) => {
    switch (dealType) {
      case 'quiet_time':
        return 'Quiet Time';
      case 'happy_blast':
        return 'Happy Blast';
      default:
        return 'Special';
    }
  };

  const getDealTypeColor = (dealType: string) => {
    switch (dealType) {
      case 'quiet_time':
        return 'bg-blue-100 text-blue-800';
      case 'happy_blast':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">

      <div className="container py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">My Favorites</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Keep track of your favorite deals and restaurants
          </p>
        </div>

        {/* Summary Stats */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <HeartIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{favorites.length}</div>
              <div className="text-sm text-gray-600">Total Favorites</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {favorites.filter(f => f.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Deals</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <LocationIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(favorites.map(f => f.restaurant.name)).size}
              </div>
              <div className="text-sm text-gray-600">Restaurants</div>
            </div>
          </div>
        )}

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring deals and add your favorites</p>
            <a
              href="/explore"
              className="btn-primary"
            >
              Explore Deals
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map((deal) => (
              <div
                key={deal.id}
                className="card overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Deal Image */}
                    <div className="lg:w-48 flex-shrink-0">
                      <img 
                        src={deal.image}
                        alt={`${deal.restaurant.name} - ${deal.title}`}
                        className="w-full h-32 lg:h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop&crop=center&auto=format&q=80';
                        }}
                      />
                    </div>

                    {/* Deal Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2 text-gray-900">{deal.title}</h3>
                          <p className="text-gray-600 mb-3">{deal.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            deal.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {deal.isActive ? 'Active' : 'Inactive'}
                          </span>

                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDealTypeColor(deal.dealType)}`}>
                            {getDealTypeLabel(deal.dealType)}
                          </span>
                        </div>
                      </div>

                      {/* Restaurant Info */}
                      <div className="mb-4">
                        <div className="text-lg font-semibold mb-2 text-gray-900">{deal.restaurant.name}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <LocationIcon className="w-4 h-4" />
                            <span className="text-sm">{deal.restaurant.address}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">{deal.restaurant.businessType} • {deal.restaurant.priceRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deal Actions */}
                    <div className="lg:w-64">
                      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-amber-600">
                            {deal.discountPercent}%
                          </div>
                          <div className="text-sm text-gray-600">OFF</div>
                        </div>

                        <div className="space-y-3">
                          <a
                            href={`/deal/${deal.id}/view`}
                            className="block w-full btn-primary text-center py-2 px-4 text-sm"
                          >
                            Redeem Deal
                          </a>

                          <button
                            onClick={() => removeFavorite(deal.id)}
                            className="block w-full btn-secondary text-center py-2 px-4 text-sm"
                          >
                            Remove from Favorites
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}