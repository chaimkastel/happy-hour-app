'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Clock, ArrowLeft, Menu, X } from 'lucide-react';

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
    distance: '0.8 mi',
    rating: 4.2,
    isOpen: true,
    category: 'Food',
    validUntil: '2:00 PM'
  }
];

export default function MobileFavoritesPage() {
  const [favorites, setFavorites] = useState<Deal[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    window.history.back();
  };

  const toggleFavorite = (dealId: string) => {
    setFavorites(prev => prev.filter(deal => deal.id !== dealId));
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">🍺</span>
              </div>
              <span className="text-gray-900 font-bold text-lg">Favorites</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => window.location.href = '/mobile/explore'}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Explore
              </button>
              <button
                onClick={() => window.location.href = '/mobile/login'}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/mobile/signup'}
                className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uber Eats-inspired Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-16 left-3 right-3 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Top Section - Sign Up & Log In */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => window.location.href = '/mobile/signup'}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Sign up
              </button>
              <button
                onClick={() => window.location.href = '/mobile/login'}
                className="w-full bg-white text-black border border-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Log in
              </button>
            </div>

            {/* Middle Section - Menu Links */}
            <div className="space-y-1 mb-6">
              <button
                onClick={() => {
                  window.location.href = '/mobile/deals';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                All Deals
              </button>
              <button
                onClick={() => {
                  window.location.href = '/mobile/about';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  window.location.href = '/mobile/how-it-works';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  window.location.href = '/mobile/faq';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                FAQ
              </button>
              <button
                onClick={() => {
                  window.location.href = '/mobile/contact';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                Contact Us
              </button>
            </div>

            {/* Bottom Section - App Promotion */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">🍺</span>
                </div>
                <span className="text-gray-700 font-medium">There's more to love in the app.</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  iPhone
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  Android
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">Start exploring deals and add them to your favorites!</p>
            <button
              onClick={() => window.location.href = '/mobile/explore'}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300"
            >
              Explore Deals
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">🍺</span>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {deal.percentOff}% OFF
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{deal.title}</h3>
                        <p className="text-gray-600 text-sm">{deal.venue.name}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(deal.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-300"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{deal.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{deal.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{deal.validUntil}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.location.href = `/mobile/deal/${deal.id}`}
                      className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300"
                    >
                      View Deal
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