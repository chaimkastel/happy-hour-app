'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Filter, 
  Grid, 
  List,
  ArrowRight,
  Menu,
  X,
  User,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Award,
  Zap,
  CreditCard,
  Building2,
  Compass
} from 'lucide-react';
import MobileHeader from './mobile/MobileHeader';
import MobileBottomNav from './mobile/MobileBottomNav';
import FiltersBottomSheet from './mobile/FiltersBottomSheet';
import LocationSelector from './mobile/LocationSelector';
import ViewToggle from './mobile/ViewToggle';

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
}

interface UnifiedLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showFilters?: boolean;
  showBottomNav?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function UnifiedLayout({ 
  children, 
  showSearch = false,
  showFilters = false,
  showBottomNav = true,
  title,
  subtitle,
  className = ''
}: UnifiedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'All',
    priceRange: 'all',
    distance: 5,
    timeWindow: 'now'
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const isHomePage = pathname === '/';
  const isMobilePage = pathname.startsWith('/mobile');

  useEffect(() => {
    if (showSearch && isHomePage) {
      fetchDeals();
    }
  }, [showSearch, isHomePage]);

  const fetchDeals = async (searchTerm = '') => {
    try {
      setLoading(true);
      const url = searchTerm 
        ? `/api/deals/search?search=${encodeURIComponent(searchTerm)}`
        : '/api/deals/search';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const transformedDeals = (data.deals || []).map((deal: any) => ({
          id: deal.id,
          title: deal.title,
          description: deal.description,
          percentOff: deal.percentOff,
          venue: {
            name: deal.venue?.name || 'Restaurant',
            address: deal.venue?.address || 'Address not available'
          },
          cuisine: Array.isArray(deal.venue?.businessType) 
            ? deal.venue.businessType[0] 
            : deal.venue?.businessType || 'Restaurant',
          distance: '0.5 mi',
          rating: deal.venue?.rating || 4.0,
          isOpen: true
        }));
        setDeals(transformedDeals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/deal/${dealId}/view`);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowMobileMenu(false);
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      setLoading(true);
      fetchDeals(query);
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'near') return deal.distance.includes('0.5') || deal.distance.includes('0.3');
    if (activeFilter === 'open') return deal.isOpen;
    if (activeFilter === 'top') return deal.rating >= 4.5;
    return true;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 relative overflow-hidden ${className}`}>
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {isHomePage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ 
              backgroundImage: 'url(/images/hero-food-deals.png)'
            }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Unified Header */}
      <MobileHeader
        title={title || "Happy Hour"}
        subtitle={subtitle}
        rightElement={
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        }
      />

      {/* Search Section - Only on home page */}
      {showSearch && isHomePage && (
        <div className="px-4 py-4 relative z-10">
          {/* Location Selector */}
          <div className="mb-4">
            <LocationSelector
              onLocationChange={(addressData) => {
                console.log('Location changed:', addressData);
              }}
              placeholder="Enter your location..."
            />
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, deals..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/20 transition-all duration-200 shadow-lg text-base"
              aria-label="Search for restaurants, cuisines, and deals"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setLoading(true);
                  fetchDeals('');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Smart Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent ${
                  activeFilter === 'all' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
                }`}
              >
                <Grid className="w-4 h-4 inline mr-1" />
                All
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('near')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === 'near' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                Near Me
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('open')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === 'open' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                Open Now
              </button>
              <button 
                type="button"
                onClick={() => setActiveFilter('top')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === 'top' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
                }`}
              >
                <Star className="w-4 h-4 inline mr-1" />
                Top Rated
              </button>
            </div>
            <button 
              type="button"
              onClick={() => setShowFiltersSheet(!showFiltersSheet)}
              className="p-2 rounded-lg bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Open filters"
              aria-expanded={showFiltersSheet}
              aria-haspopup="dialog"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Results Count and View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 text-sm">
              {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
            </div>
            <ViewToggle
              onViewChange={setViewMode}
              initialView={viewMode}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10" style={{ 
        paddingBottom: showBottomNav ? '80px' : '0',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}>
        {children}
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && <MobileBottomNav />}

      {/* Filters Bottom Sheet */}
      <FiltersBottomSheet
        isOpen={showFiltersSheet}
        onClose={() => setShowFiltersSheet(false)}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
      />

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
                  onClick={() => handleNavigation('/explore')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Compass className="w-5 h-5 mr-3" />
                    <span className="font-medium">Explore</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/favorites')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-3" />
                    <span className="font-medium">Favorites</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/account')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <span className="font-medium">Account</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/wallet')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span className="font-medium">Wallet</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/partner')}
                  className="w-full text-left text-white py-4 px-4 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-200 transform hover:scale-105 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-3" />
                    <span className="font-medium">Partner</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigation('/merchant')}
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
                  onClick={() => handleNavigation('/login')}
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
