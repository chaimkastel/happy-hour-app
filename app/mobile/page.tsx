'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Users, 
  Filter, 
  Grid, 
  List, 
  Search, 
  Star, 
  TrendingUp, 
  Zap, 
  Heart, 
  ArrowRight, 
  Shield, 
  Award, 
  Globe, 
  Smartphone, 
  CreditCard, 
  Timer, 
  CheckCircle, 
  Sparkles, 
  Flame, 
  Gift, 
  Target, 
  Rocket, 
  Crown, 
  Diamond,
  Bell,
  Menu,
  X,
  ChevronRight,
  Settings
} from 'lucide-react';
import { 
  PremiumSearchBar, 
  QuickAction, 
  PremiumDealCard, 
  PremiumBottomNav, 
  PremiumHeader, 
  PremiumSideMenu 
} from '../../components/PremiumComponents';
import { Button, Card, Badge, Avatar } from '../../components/DesignSystem';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  cuisine: string;
  venue: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export default function MobileHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        const dealsData = data.deals || data;
        const transformedDeals = dealsData.map((deal: any) => ({
          ...deal,
          discount: deal.percentOff || deal.discount || 0,
          cuisine: deal.venue?.businessType || deal.cuisine || 'Restaurant',
          venue: {
            latitude: deal.venue?.latitude || 40.7128,
            longitude: deal.venue?.longitude || -74.0060,
            name: deal.venue?.name || 'Restaurant'
          }
        }));
        setDeals(transformedDeals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'near-me', icon: <MapPin className="w-5 h-5" />, label: 'Near Me', isActive: true },
    { id: 'open-now', icon: <Clock className="w-5 h-5" />, label: 'Open Now', isActive: false },
    { id: 'top-rated', icon: <Star className="w-5 h-5" />, label: 'Top Rated', isActive: false },
    { id: 'best-deals', icon: <Gift className="w-5 h-5" />, label: 'Best Deals', isActive: false },
  ];

  const bottomNavItems = [
    { id: 'explore', label: 'Explore', icon: <Grid className="w-6 h-6" />, isActive: true, onClick: () => {} },
    { id: 'map', label: 'Map', icon: <MapPin className="w-6 h-6" />, isActive: false, onClick: () => {} },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-6 h-6" />, isActive: false, onClick: () => {} },
    { id: 'profile', label: 'Profile', icon: <Users className="w-6 h-6" />, isActive: false, onClick: () => {} },
  ];

  const sideMenuItems = [
    { id: 'account', label: 'My Account', icon: <Users className="w-5 h-5" />, onClick: () => {} },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" />, onClick: () => {} },
    { id: 'wallet', label: 'Wallet', icon: <CreditCard className="w-5 h-5" />, onClick: () => {} },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, onClick: () => {} },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, onClick: () => {} },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading amazing deals...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Premium Header */}
      <PremiumHeader
        title="HappyHour"
        subtitle="Discover amazing deals near you"
        onMenuClick={() => setShowMobileMenu(true)}
        onNotificationClick={() => {}}
      />

      {/* Premium Search Bar */}
      <div className="px-4 py-4">
        <PremiumSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search restaurants, cuisines..."
        />
      </div>

      {/* Premium Quick Actions */}
      <div className="px-4 pb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action) => (
            <QuickAction
              key={action.id}
              icon={action.icon}
              label={action.label}
              isActive={action.isActive}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Premium Deals List */}
      <div className="px-4 pb-24">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PremiumDealCard
                deal={{
                  id: deal.id,
                  title: deal.title,
                  venue: { name: deal.venue.name },
                  discount: deal.discount,
                  cuisine: deal.cuisine,
                  distance: 0.5,
                  rating: 4.8,
                  isOpen: true,
                  isFavorite: false
                }}
                onFavorite={(id) => console.log('Favorite:', id)}
                onClick={(id) => console.log('Click:', id)}
              />
            </motion.div>
          ))}
        </motion.div>
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
