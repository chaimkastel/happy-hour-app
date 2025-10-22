'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MapPin, Star, Clock, Trash2 } from 'lucide-react';

interface FavoriteDeal {
  id: string;
  deal: {
    id: string;
    title: string;
    description: string;
    percentOff?: number;
    originalPrice?: number;
    discountedPrice?: number;
    startAt: string;
    endAt: string;
    venue: {
      name: string;
      address: string;
      city: string;
      state: string;
    };
  };
  createdAt: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (dealId: string) => {
    try {
      const response = await fetch('/api/favorite/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId }),
      });

      if (response.ok) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.deal.id !== dealId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isDealActive = (startAt: string, endAt: string) => {
    const now = new Date();
    const start = new Date(startAt);
    const end = new Date(endAt);
    return now >= start && now <= end;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-1">Deals you've saved for later</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring deals and save your favorites to find them here later!
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Browse Deals
            </Link>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              Start exploring deals and save your favorites to see them here.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {favorite.deal.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {favorite.deal.description}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFavorite(favorite.deal.id)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{favorite.deal.venue.name}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{favorite.deal.venue.address}, {favorite.deal.venue.city}, {favorite.deal.venue.state}</span>
                  </div>

                  {favorite.deal.percentOff && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-3">
                      {favorite.deal.percentOff}% OFF
                    </div>
                  )}

                  {favorite.deal.originalPrice && favorite.deal.discountedPrice && (
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-green-600">
                        ${(favorite.deal.discountedPrice / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${(favorite.deal.originalPrice / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        Save ${((favorite.deal.originalPrice - favorite.deal.discountedPrice) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {formatDate(favorite.deal.startAt)} - {formatTime(favorite.deal.startAt)} to {formatTime(favorite.deal.endAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isDealActive(favorite.deal.startAt, favorite.deal.endAt) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">Favorited</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t">
                  <Link
                    href={`/deal/${favorite.deal.id}`}
                    className="block w-full text-center px-4 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50 transition-colors"
                  >
                    View Deal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}