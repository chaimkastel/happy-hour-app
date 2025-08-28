'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Star, 
  MapPin, 
  Tag, 
  Clock, 
  ArrowLeft,
  Users,
  CreditCard,
  Bell,
  Settings,
  Grid,
  Menu,
  X
} from 'lucide-react';
import { 
  PremiumBottomNav, 
  PremiumHeader, 
  PremiumSideMenu 
} from '../../../components/PremiumComponents';
import { Button, Card, Badge } from '../../../components/DesignSystem';

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

export default function MobileFavoritesPage() {
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
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
        return 'bg-blue-100 text-blue-700';
      case 'happy_blast':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const bottomNavItems = [
    { id: 'explore', label: 'Explore', icon: <Grid className="w-6 h-6" />, isActive: false, onClick: () => window.location.href = '/mobile/explore' },
    { id: 'map', label: 'Map', icon: <MapPin className="w-6 h-6" />, isActive: false, onClick: () => {} },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-6 h-6" />, isActive: true, onClick: () => {} },
    { id: 'profile', label: 'Profile', icon: <Users className="w-6 h-6" />, isActive: false, onClick: () => window.location.href = '/mobile/account' },
  ];

  const sideMenuItems = [
    { id: 'account', label: 'My Account', icon: <Users className="w-5 h-5" />, onClick: () => window.location.href = '/mobile/account' },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" />, onClick: () => {} },
    { id: 'wallet', label: 'Wallet', icon: <CreditCard className="w-5 h-5" />, onClick: () => window.location.href = '/mobile/wallet' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, onClick: () => alert('Settings coming soon!') },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, onClick: () => alert('Notifications feature coming soon!') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Premium Header */}
      <PremiumHeader
        title="🍺 Happy Hour"
        subtitle="Your favorite deals"
        onMenuClick={() => setShowMobileMenu(true)}
        onNotificationClick={() => alert('Notifications feature coming soon!')}
      />

      {/* Back Button */}
      <div className="px-4 py-2">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Summary Stats */}
      {favorites.length > 0 && (
        <div className="px-4 pb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="w-8 h-8 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{favorites.length}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {favorites.filter(f => f.isActive).length}
              </div>
              <div className="text-xs text-gray-600">Active</div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {new Set(favorites.map(f => f.restaurant.name)).size}
              </div>
              <div className="text-xs text-gray-600">Restaurants</div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites List */}
      <div className="px-4 pb-24">
        {favorites.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring deals and add your favorites</p>
            <Button 
              onClick={() => window.location.href = '/mobile/explore'} 
              variant="primary" 
              size="lg"
            >
              Explore Deals
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {favorites.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="elevated" className="overflow-hidden">
                  <div className="p-4">
                    {/* Deal Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{deal.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{deal.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deal.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {deal.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDealTypeColor(deal.dealType)}`}>
                          {getDealTypeLabel(deal.dealType)}
                        </span>
                      </div>
                    </div>

                    {/* Restaurant Info */}
                    <div className="mb-4">
                      <div className="text-base font-semibold mb-1 text-gray-900">{deal.restaurant.name}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{deal.restaurant.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Tag className="w-3 h-3" />
                          <span>{deal.restaurant.businessType} • {deal.restaurant.priceRange}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deal Actions */}
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-3 flex-1 mr-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-600">
                            {deal.discountPercent}%
                          </div>
                          <div className="text-xs text-gray-600">OFF</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => window.location.href = `/redeem/${deal.id}`}
                          className="bg-pink-600 text-white text-center py-2 px-4 rounded-xl text-sm font-medium hover:bg-pink-700 transition-colors duration-200"
                        >
                          Redeem
                        </button>
                        <button
                          onClick={() => removeFavorite(deal.id)}
                          className="bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Premium Bottom Navigation */}
      <PremiumBottomNav items={bottomNavItems} />

      {/* Premium Side Menu */}
      <PremiumSideMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        items={sideMenuItems}
        user={{
          name: "John Doe",
          email: "john@example.com",
          avatar: undefined
        }}
      />
    </div>
  );
}
