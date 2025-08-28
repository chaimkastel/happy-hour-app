'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Filter, 
  Grid, 
  List, 
  Users, 
  CreditCard,
  Bell,
  Settings,
  ChevronRight,
  X,
  Menu,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  Gift,
  SlidersHorizontal,
  Brain,
  Flame
} from 'lucide-react';
import { 
  PremiumSearchBar, 
  QuickAction, 
  PremiumDealCard, 
  PremiumBottomNav, 
  PremiumHeader, 
  PremiumSideMenu 
} from '../../../components/PremiumComponents';
import { Button, Card, Badge, Avatar } from '../../../components/DesignSystem';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  cuisine: string;
  venue: {
    latitude: number;
    longitude: number;
    name: string;
  };
  image?: string;
  expiresAt?: string;
  isHot?: boolean;
  isEndingSoon?: boolean;
  isStaffPick?: boolean;
  score?: number;
  rating?: number;
  redeemedCount?: number;
}

interface Filters {
  cuisine: string;
  maxDistance: number;
  minDiscount: number;
  openNow: boolean;
  sortBy: string;
}

export default function MobileExplorePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('near-me');
  const [filters, setFilters] = useState<Filters>({
    cuisine: '',
    maxDistance: 10,
    minDiscount: 0,
    openNow: false,
    sortBy: 'relevance'
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
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
            latitude: deal.venue?.latitude || 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: deal.venue?.longitude || -74.0060 + (Math.random() - 0.5) * 0.1,
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

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCuisine = !filters.cuisine || deal.cuisine.toLowerCase() === filters.cuisine.toLowerCase();
    const matchesDiscount = deal.discount >= filters.minDiscount;
    
    return matchesSearch && matchesCuisine && matchesDiscount;
  });

  const quickActions = [
    { id: 'near-me', icon: <MapPin className="w-5 h-5" />, label: 'Near Me', isActive: activeFilter === 'near-me' },
    { id: 'open-now', icon: <Clock className="w-5 h-5" />, label: 'Open Now', isActive: activeFilter === 'open-now' },
    { id: 'top-rated', icon: <Star className="w-5 h-5" />, label: 'Top Rated', isActive: activeFilter === 'top-rated' },
    { id: 'best-deals', icon: <Gift className="w-5 h-5" />, label: 'Best Deals', isActive: activeFilter === 'best-deals' },
  ];

  const bottomNavItems = [
    { id: 'explore', label: 'Explore', icon: <Grid className="w-6 h-6" />, isActive: true, onClick: () => {} },
    { id: 'map', label: 'Map', icon: <MapPin className="w-6 h-6" />, isActive: false, onClick: () => setViewMode('map') },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-6 h-6" />, isActive: false, onClick: () => window.location.href = '/mobile/favorites' },
    { id: 'profile', label: 'Profile', icon: <Users className="w-6 h-6" />, isActive: false, onClick: () => window.location.href = '/mobile/account' },
  ];

  const sideMenuItems = [
    { id: 'account', label: 'My Account', icon: <Users className="w-5 h-5" />, onClick: () => window.location.href = '/mobile/account' },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" />, onClick: () => window.location.href = '/mobile/favorites' },
    { id: 'wallet', label: 'Wallet', icon: <CreditCard className="w-5 h-5" />, onClick: () => window.location.href = '/mobile/wallet' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, onClick: () => alert('Settings coming soon!') },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, onClick: () => alert('Notifications feature coming soon!') },
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
        title="🍺 Happy Hour"
        subtitle="Discover amazing deals near you"
        onMenuClick={() => setShowMobileMenu(true)}
        onNotificationClick={() => alert('Notifications feature coming soon!')}
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
              onClick={() => setActiveFilter(action.id)}
            />
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Map
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/95 backdrop-blur-sm border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cuisine
                </label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Cuisines</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Indian">Indian</option>
                  <option value="Thai">Thai</option>
                  <option value="American">American</option>
                </select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Distance
                </label>
                <select
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({...filters, maxDistance: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value={5}>Within 5 miles</option>
                  <option value={10}>Within 10 miles</option>
                  <option value={25}>Within 25 miles</option>
                </select>
              </div>

              {/* Discount Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Discount
                </label>
                <select
                  value={filters.minDiscount}
                  onChange={(e) => setFilters({...filters, minDiscount: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value={0}>Any discount</option>
                  <option value={20}>20% or more</option>
                  <option value={30}>30% or more</option>
                  <option value={50}>50% or more</option>
                </select>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setFilters({
                      cuisine: '',
                      maxDistance: 10,
                      minDiscount: 0,
                      openNow: false,
                      sortBy: 'relevance'
                    });
                    setShowFilters(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="px-4 pb-24">
        {viewMode === 'grid' ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal, index) => (
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
                    onFavorite={(id) => {
                      console.log('Toggle favorite for deal:', id);
                    }}
                    onClick={(id) => {
                      window.location.href = `/deal/${id}`;
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600 mb-4">Interactive map coming soon!</p>
            <Button onClick={() => setViewMode('grid')} variant="primary" size="md">
              Back to List
            </Button>
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
