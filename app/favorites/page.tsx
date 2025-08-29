'use client';

import { useState } from 'react';
import { Heart, Star, MapPin, Tag, Clock, ArrowLeft, Menu, X, User, CreditCard, Award, Building2, Grid } from 'lucide-react';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';

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
  status: 'active' | 'expired' | 'used';
}

export default function FavoritesPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Mock data for favorites
  const favoriteDeals: Deal[] = [
    {
      id: '1',
      title: 'Happy Hour Special',
      description: '50% off all drinks and appetizers during happy hour',
      percentOff: 50,
      venue: {
        name: 'The Golden Spoon',
        address: '123 Main St, Downtown'
      },
      cuisine: 'American',
      distance: '0.3 mi',
      rating: 4.8,
      isOpen: true,
      status: 'active'
    },
    {
      id: '2',
      title: 'Lunch Combo Deal',
      description: 'Get any lunch entree with a side and drink for just $12',
      percentOff: 30,
      venue: {
        name: 'Bella Vista',
        address: '456 Oak Avenue'
      },
      cuisine: 'Italian',
      distance: '0.7 mi',
      rating: 4.5,
      isOpen: true,
      status: 'active'
    },
    {
      id: '3',
      title: 'Weekend Brunch',
      description: 'Bottomless mimosas and brunch specials every weekend',
      percentOff: 25,
      venue: {
        name: 'Sunrise Cafe',
        address: '789 Pine Street'
      },
      cuisine: 'Breakfast',
      distance: '1.2 mi',
      rating: 4.3,
      isOpen: false,
      status: 'expired'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'expired':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'used':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Mobile Header */}
      <MobileHeader
        title="Favorites"
        rightElement={
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        }
      />

      {/* Content */}
      <div className="px-4 py-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Favorites</h1>
          <p className="text-white/70">Deals you've saved for later</p>
        </div>

        {/* Favorites List */}
        {favoriteDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No favorites yet</h3>
            <p className="text-white/70 text-sm">Start exploring deals and save your favorites!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteDeals.map((deal, index) => (
              <div 
                key={deal.id}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                        {deal.status}
                      </span>
                    </div>
                    <button className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200">
                      <Heart className="w-4 h-4 text-white fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />

      {/* Enhanced Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute top-0 right-0 w-80 h-full bg-white/15 backdrop-blur-xl border-l border-white/30 animate-in slide-in-from-right duration-300">
            <div className="p-6 h-full flex flex-col">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-white text-xl font-bold drop-shadow-lg">Menu</h2>
                  <p className="text-white/70 text-sm">Navigate & manage</p>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Welcome!</h3>
                    <p className="text-white/70 text-sm">Sign in to save favorites</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 space-y-3">
                <button 
                  onClick={() => window.location.href = '/mobile'}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Grid className="w-5 h-5 mr-3" />
                    <span className="font-medium">Home</span>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/explore'}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Grid className="w-5 h-5 mr-3" />
                    <span className="font-medium">Explore</span>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/account'}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <span className="font-medium">Account</span>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/wallet'}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span className="font-medium">Wallet</span>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/partner'}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-3" />
                    <span className="font-medium">Partner</span>
                  </div>
                </button>
                <button 
                  onClick={() => window.location.href = '/merchant'}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-3" />
                    <span className="font-medium">For Restaurants</span>
                  </div>
                </button>
              </div>

              {/* Menu Footer */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}