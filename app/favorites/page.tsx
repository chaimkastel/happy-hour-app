'use client';
import { useState } from 'react';
import { Heart, Star, MapPin, Tag, Clock, ArrowLeft } from 'lucide-react';

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
}

export default function FavoritesPage() {
  // Use sample data directly instead of API calls
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
      }
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
      }
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
      }
    }
  ]);

  const removeFavorite = (dealId: string) => {
    // In a real app, this would call an API to remove from favorites
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
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'happy_blast':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-200">My Favorites</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Keep track of your favorite deals and restaurants
        </p>
      </div>

      {/* Back Button */}
      <div className="mb-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </a>
      </div>

      {/* Summary Stats */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{favorites.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Favorites</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {favorites.filter(f => f.isActive).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Deals</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {new Set(favorites.map(f => f.restaurant.name)).size}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Restaurants</div>
          </div>
        </div>
      )}

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">No favorites yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Start exploring deals and add your favorites</p>
          <a
            href="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Explore Deals
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.map((deal) => (
            <div
              key={deal.id}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Deal Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">{deal.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">{deal.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          deal.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                      <div className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">{deal.restaurant.name}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{deal.restaurant.address}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Tag className="w-4 h-4" />
                          <span className="text-sm">{deal.restaurant.businessType} • {deal.restaurant.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deal Actions */}
                  <div className="lg:w-64">
                    <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-2xl p-4 border border-pink-200 dark:border-pink-700">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                          {deal.discountPercent}%
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">OFF</div>
                      </div>

                      <div className="space-y-3">
                        <a
                          href={`/redeem/${deal.id}`}
                          className="block w-full bg-pink-600 text-white text-center py-2 px-4 rounded-xl text-sm font-medium hover:bg-pink-700 transition-colors duration-200"
                        >
                          Redeem Deal
                        </a>

                        <button
                          onClick={() => removeFavorite(deal.id)}
                          className="block w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-center py-2 px-4 rounded-xl text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
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
  );
}
