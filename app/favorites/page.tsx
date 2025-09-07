'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/lib/auth-guard';
import { 
  Heart,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  AlertCircle,
  Trash2
} from 'lucide-react';
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
  inPersonOnly: boolean;
  tags: string[];
  status: string;
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

interface Favorite {
  id: string;
  dealId: string;
  addedAt: string;
  deal: Deal;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/favorites');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (dealId: string) => {
    try {
      const response = await fetch(`/api/favorites?dealId=${dealId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.dealId !== dealId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Failed to remove favorite. Please try again.');
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

  const isDealActive = (deal: Deal) => {
    const now = new Date();
    const start = new Date(deal.startAt);
    const end = new Date(deal.endAt);
    return deal.status === 'LIVE' && start <= now && end > now;
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchFavorites}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">My Favorites</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Keep track of your favorite deals and restaurants
            </p>
          </div>

          {/* Summary Stats */}
          {favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{favorites.length}</div>
                <div className="text-sm text-gray-600">Total Favorites</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {favorites.filter(f => isDealActive(f.deal)).length}
                </div>
                <div className="text-sm text-gray-600">Active Deals</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(favorites.map(f => f.deal.venue.name)).size}
                </div>
                <div className="text-sm text-gray-600">Restaurants</div>
              </div>
            </div>
          )}

          {/* Favorites List */}
          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">No favorites yet</h3>
              <p className="text-gray-600 mb-6">Start exploring deals and add your favorites</p>
              <Link
                href="/explore"
                className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Explore Deals
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {favorites.map((favorite) => {
                const deal = favorite.deal;
                const isActive = isDealActive(deal);
                
                return (
                  <div
                    key={favorite.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Deal Image */}
                        <div className="lg:w-48 flex-shrink-0">
                          {deal.venue.photos.length > 0 ? (
                            <img 
                              src={deal.venue.photos[0]}
                              alt={`${deal.venue.name} - ${deal.title}`}
                              className="w-full h-32 lg:h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 lg:h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No image</span>
                            </div>
                          )}
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
                                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {isActive ? 'Active' : 'Inactive'}
                              </span>

                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {deal.percentOff}% OFF
                              </span>
                            </div>
                          </div>

                          {/* Restaurant Info */}
                          <div className="mb-4">
                            <div className="text-lg font-semibold mb-2 text-gray-900">{deal.venue.name}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{deal.venue.address}</span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm">{deal.venue.rating.toFixed(1)} • {deal.venue.priceTier}</span>
                              </div>
                            </div>
                          </div>

                          {/* Time Remaining */}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeRemaining(deal.endAt)}</span>
                          </div>
                        </div>

                        {/* Deal Actions */}
                        <div className="lg:w-64">
                          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                            <div className="text-center mb-4">
                              <div className="text-3xl font-bold text-amber-600">
                                {deal.percentOff}%
                              </div>
                              <div className="text-sm text-gray-600">OFF</div>
                            </div>

                            <div className="space-y-3">
                              <Link
                                href={`/deal/${deal.id}/view`}
                                className="block w-full bg-amber-600 text-white text-center py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                              >
                                View Deal
                              </Link>

                              <button
                                onClick={() => removeFavorite(deal.id)}
                                className="w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}