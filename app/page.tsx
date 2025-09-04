'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Search, Rocket, ArrowRight, Flame, Heart, Clock, Timer, Gift, Target, Grid, MapPin, Smartphone, CheckCircle, Diamond, Crown, TrendingUp, Users, Zap } from 'lucide-react';
import { 
  SearchIcon,
  LocationIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  MapIcon,
  ArrowRightIcon,
  MenuIcon,
  CloseIcon,
  UserIcon,
  WalletIcon,
  BuildingIcon,
  ShieldIcon,
  GlobeIcon,
  CocktailIcon,
  LunchIcon,
  BrunchIcon,
  FreeDrinkIcon,
  LateNightIcon
} from '@/components/ui/ProfessionalIcons';
import DealCard from '@/components/DealCard';
import MapWithClusters from '@/components/MapWithClusters';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  venue: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  cuisine: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  image: string;
}

export default function HomePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [filters, setFilters] = useState({
    cuisine: 'all',
    distance: 'all',
    price: 'all',
    maxDistance: 10,
    minDiscount: 0,
    openNow: false
  });

  // Filter deals based on current filters
  const filteredDeals = deals.filter(deal => {
    // Filter by cuisine
    if (filters.cuisine !== 'all' && deal.cuisine.toLowerCase() !== filters.cuisine) {
      return false;
    }
    
    // Filter by active filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'near') return deal.distance.includes('0.3') || deal.distance.includes('0.4') || deal.distance.includes('0.5');
    if (activeFilter === 'open') return deal.isOpen;
    if (activeFilter === 'top') return deal.rating >= 4.5;
    if (activeFilter === 'free-drink') return deal.title.toLowerCase().includes('drink') || deal.title.toLowerCase().includes('cocktail');
    if (activeFilter === 'lunch') return deal.title.toLowerCase().includes('lunch') || deal.title.toLowerCase().includes('brunch');
    if (activeFilter === 'late-night') return deal.title.toLowerCase().includes('late') || deal.title.toLowerCase().includes('night');
    
    return true;
  });

  // Load deals with realistic data
  useEffect(() => {
    const loadDeals = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setDeals([
          {
            id: '1',
            title: 'Happy Hour Special',
            description: '50% off all drinks and appetizers during our quiet hours',
            percentOff: 50,
            venue: { name: 'The Golden Spoon', address: '123 Main St, Downtown', latitude: 40.7128, longitude: -74.0060 },
            cuisine: 'American',
            distance: '0.3 mi',
            rating: 4.7,
            isOpen: true,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
          },
          {
            id: '2',
            title: 'Lunch Rush Relief',
            description: '30% off lunch entrees when we need to fill tables',
            percentOff: 30,
            venue: { name: 'Bella Vista', address: '456 Oak Ave, Midtown', latitude: 40.7589, longitude: -73.9851 },
            cuisine: 'Italian',
            distance: '0.8 mi',
            rating: 4.4,
            isOpen: true,
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
          },
          {
            id: '3',
            title: 'Dinner for Two',
            description: '25% off dinner for two during our slowest hours',
            percentOff: 25,
            venue: { name: 'Le Petit Bistro', address: '789 Pine St, Uptown', latitude: 40.7831, longitude: -73.9712 },
            cuisine: 'French',
            distance: '1.2 mi',
            rating: 4.9,
            isOpen: true,
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
          },
          {
            id: '4',
            title: 'Late Night Bites',
            description: '40% off late night menu items',
            percentOff: 40,
            venue: { name: 'Midnight Diner', address: '321 Elm St, Night District', latitude: 40.7505, longitude: -73.9934 },
            cuisine: 'Comfort Food',
            distance: '0.6 mi',
            rating: 4.2,
            isOpen: true,
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
          },
          {
            id: '5',
            title: 'Brunch Boost',
            description: '35% off brunch items on slow weekend mornings',
            percentOff: 35,
            venue: { name: 'Sunny Side Up', address: '555 Sunrise Blvd, Eastside', latitude: 40.7282, longitude: -73.9942 },
            cuisine: 'Breakfast',
            distance: '1.0 mi',
            rating: 4.6,
            isOpen: true,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
          },
          {
            id: '6',
            title: 'Cocktail Hour',
            description: 'Buy one get one free on all cocktails',
            percentOff: 50,
            venue: { name: 'The Mixing Room', address: '777 Bar St, Entertainment District', latitude: 40.7614, longitude: -73.9776 },
            cuisine: 'Cocktails',
            distance: '0.4 mi',
            rating: 4.8,
          isOpen: true,
            image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&crop=center&auto=format&q=80'
          }
        ]);
      setLoading(false);
      }, 1000);
  };

    loadDeals();
  }, []);

  // Handle hydration and mobile detection
  useEffect(() => {
    setIsHydrated(true);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const fetchInitialDeals = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deals/search');
      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals || []);
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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setLoading(true);
      try {
        const response = await fetch('/api/deals/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: query,
            limit: 6
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setDeals(data.deals || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else if (query.length === 0) {
      // Reset to all deals when search is cleared
      fetchInitialDeals();
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };


  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section with Real Photo */}
      <section className="hero bg-gray-900" role="banner" aria-label="Photo of a bar interior with people enjoying drinks">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80)'
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="hero-content">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h1 className="hero-title">Find Happy Hour Deals Near You</h1>
            <p className="hero-subtitle">Turn quiet hours into big savings</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <label htmlFor="hero-search" className="sr-only">Search for restaurants, cuisines or deals</label>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                id="hero-search"
                type="text"
                placeholder="Search restaurants, cuisines, or deals..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-search text-gray-900 placeholder-gray-500"
                aria-label="Search for restaurants, cuisines or deals"
                aria-describedby="search-help"
              />
            </div>
            <p id="search-help" className="sr-only">Search for restaurants, cuisines, or deals near you</p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            {[
              { id: 'all', label: 'All Deals', icon: GridIcon },
              { id: 'near', label: 'Near Me', icon: LocationIcon },
              { id: 'open', label: 'Open Now', icon: ClockIcon },
              { id: 'top', label: 'Top Rated', icon: StarIcon },
              { id: 'free-drink', label: 'Free Drink', icon: FreeDrinkIcon },
              { id: 'lunch', label: 'Lunch', icon: LunchIcon },
              { id: 'late-night', label: 'Late Night', icon: LateNightIcon }
            ].map((filter) => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.id;
              
              return (
                <button 
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`filter-chip ${isActive ? 'filter-chip-active' : ''}`}
                  aria-label={`Filter by ${filter.label}`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
              onClick={() => router.push('/signup')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Get Started Free
              </button>
              <button 
              onClick={() => router.push('/explore')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              Explore Deals
              </button>
            </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Deals</h2>
            <p className="section-subtitle">Discover the best happy hour deals in your area</p>
          </div>

          {loading ? (
            <div className="grid-deals">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card p-6">
                  <div className="skeleton-image mb-4"></div>
                  <div className="skeleton-text mb-2"></div>
                  <div className="skeleton-text w-2/3 mb-2"></div>
                  <div className="skeleton-text w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid-deals">
              {filteredDeals.map((deal) => (
              <div 
                key={deal.id} 
                onClick={() => handleDealClick(deal.id)}
                  className="deal-card group"
              >
                  <div className="relative">
                  <img
                      src={deal.image}
                    alt={deal.title}
                      className="deal-card-image"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop&crop=center&auto=format&q=80';
                      }}
                  />
                  <div className="absolute top-4 right-4">
                      <span className="badge-discount">
                      {deal.percentOff}% OFF
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                          <StarIcon className="w-3 h-3 text-amber-500 mr-1" />
                          <span className="text-xs font-medium text-gray-900">{deal.rating}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deal.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {deal.isOpen ? 'Open' : 'Closed'}
                      </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="deal-card-content">
                    <h3 className="deal-card-title">{deal.title}</h3>
                    <p className="deal-card-description">{deal.venue.name}</p>
                    <p className="text-gray-500 text-sm mb-4">{deal.description}</p>
                    
                    <div className="deal-card-meta">
                      <div className="flex items-center text-gray-500">
                        <LocationIcon className="w-4 h-4 mr-1" />
                        <span>{deal.distance}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {deal.cuisine}
                      </span>
                    </div>
                    
                    <div className="deal-card-footer">
                      <button className="btn-primary text-sm px-4 py-2">
                        View Deal
                    </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from happy customers who save money every day</p>
          </div>
          
          <div className="grid-testimonials">
            {[
              {
                name: 'Sarah M.',
                photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
                testimonial: 'Saved $50 on dinner last night! This app is a game changer.',
                deal: 'Dinner for Two at Le Petit Bistro',
                rating: 5
              },
              {
                name: 'Mike R.',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
                testimonial: 'Found amazing lunch deals near my office. Perfect timing!',
                deal: 'Lunch Rush Relief at Bella Vista',
                rating: 5
              },
              {
                name: 'Emma L.',
                photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
                testimonial: 'The late night deals are incredible. My wallet thanks me!',
                deal: 'Late Night Bites at Midnight Diner',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <img
                  src={testimonial.photo}
                      alt={testimonial.name}
                  className="testimonial-avatar w-16 h-16 rounded-full object-cover"
                />
                <div className="flex items-center justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-amber-500 fill-current" />
                      ))}
                </div>
                <p className="testimonial-text">"{testimonial.testimonial}"</p>
                <div className="testimonial-author">{testimonial.name}</div>
                <div className="testimonial-deal">{testimonial.deal}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Statistics */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container">
          <div className="flex items-center justify-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <ShieldIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <StarIcon className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium">Rated 4.8/5 by 10,000+ customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <GlobeIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Local</span>
      </div>
          </div>
        </div>
      </section>

      {/* For Merchants / Partner Section */}
      <section className="section-padding bg-gray-900 text-white pt-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Partner With Us</h2>
            <p className="text-xl text-gray-300 mb-12">
              Fill empty tables during quiet hours and attract new customers to your restaurant
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BuildingIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Increase Off-Peak Sales</h3>
                <p className="text-gray-300">Fill empty tables during slow hours with targeted deals</p>
                  </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Attract New Customers</h3>
                <p className="text-gray-300">Reach food lovers who are looking for great deals</p>
                  </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
                <p className="text-gray-300">Monitor your deals and see real-time analytics</p>
                </div>
              </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                onClick={() => router.push('/merchant/signup')}
                className="btn-primary text-lg px-8 py-4"
                >
                List Your Restaurant
                </button>
                <button
                onClick={() => router.push('/merchant')}
                className="btn-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-gray-900"
                >
                Learn More
                </button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );

  // Show loading state while checking mobile or loading deals
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {!isHydrated ? 'Loading...' : 'Loading deals...'}
          </p>
        </div>
      </div>
    );
  }

  // Don't render desktop content on mobile (redirect will happen)
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Redirecting to mobile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero-food-deals.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      ></div>
      
      {/* Enhanced overlay for better mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-[1px] md:backdrop-blur-sm"></div>
      
      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Hero Section - Exciting & Engaging */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="text-center">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in shadow-2xl">
              <div className="flex -space-x-1 sm:-space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base">10,000+ Happy Customers</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Main Brand */}
                        <div className="mb-6 sm:mb-8 animate-slide-in-down">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
            Happy Hour
          </h1>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
                <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-spin drop-shadow-lg" />
                <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Compelling Headlines */}
                        <div className="mb-8 sm:mb-12 animate-slide-in-up">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-2xl">Instant Deals</span> at Restaurants Near You
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-lg">
                Save up to <span className="font-bold text-yellow-300 drop-shadow-lg">70% OFF</span> when restaurants are quiet! 
                <br />
                <span className="text-base sm:text-lg text-white/95 drop-shadow-md">Real-time deals • Instant savings • No waiting</span>
              </p>
          </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 animate-fade-in">
              <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-2xl p-4 sm:p-6 hover:bg-white/30 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-2xl">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200 dark:text-slate-100 mb-2 drop-shadow-lg">1,247</div>
                <div className="text-slate-300 dark:text-slate-300 text-sm sm:text-base">Live Deals Right Now</div>
              </div>
              <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-2xl p-4 sm:p-6 hover:bg-white/30 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-2xl">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200 dark:text-slate-100 mb-2 drop-shadow-lg">12.3k</div>
                <div className="text-slate-300 dark:text-slate-300 text-sm sm:text-base">Deals Claimed Today</div>
              </div>
              <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-slate-600/40 rounded-2xl p-4 sm:p-6 hover:bg-white/30 dark:hover:bg-slate-800/60 transition-all duration-300 shadow-2xl">
                <div className="text-2xl sm:text-3xl font-bold text-slate-200 dark:text-slate-100 mb-2 drop-shadow-lg">$47</div>
                <div className="text-slate-300 dark:text-slate-300 text-sm sm:text-base">Average Savings</div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8 sm:mb-12 animate-scale-in">
              <div className="relative">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-300 w-5 h-5 sm:w-6 sm:h-6" />
                <input
                  type="text"
                  placeholder="Enter your address or city to find amazing deals..."
                  className="w-full pl-12 sm:pl-16 pr-24 sm:pr-32 py-4 sm:py-6 text-lg sm:text-xl bg-white/30 dark:bg-slate-800/60 backdrop-blur-xl border-2 border-white/40 dark:border-slate-600/50 rounded-2xl sm:rounded-3xl focus:border-white/60 dark:focus:border-slate-500 focus:outline-none transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-600 dark:placeholder-slate-300 shadow-2xl font-medium"
                />
                <button 
                  type="button"
                  aria-label="Search for deals"
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/30 dark:bg-slate-800/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-white/40 dark:hover:bg-slate-800/70 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/40 dark:border-slate-600/50">
                  <span className="hidden sm:inline">Find Deals</span>
                  <span className="sm:hidden">Search</span>
                </button>
              </div>
            </div>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-fade-in">
              <button 
                type="button"
                aria-label="Explore deals and offers"
                onClick={() => router.push('/explore')}
                className="group bg-white/30 dark:bg-slate-800/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-2xl hover:bg-white/40 dark:hover:bg-slate-800/70 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3 sm:gap-4 border border-white/40 dark:border-slate-600/50"
              >
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-bounce" />
                <span className="hidden sm:inline">Explore Deals</span>
                <span className="sm:hidden">Explore</span>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Live Deals Preview - Exciting */}
      <div className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-400/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-400/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-3 mb-6">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              <span className="text-orange-600 font-bold">LIVE NOW</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Hot Deals</span> Near You
          </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              These deals are <span className="text-orange-500 font-bold">flying off the shelves</span>! 
              Don't miss out on incredible savings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.slice(0, 6).map((deal, index) => (
              <div 
                key={deal.id} 
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 hover:scale-105 hover:bg-white/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Restaurant Image */}
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&auto=format&q=80)`
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50 group-hover:from-black/40 group-hover:to-black/60 transition-all duration-300"></div>
                  
                  {/* Hot Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Flame className="w-4 h-4 animate-pulse" />
                      {deal.percentOff}% OFF
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button 
                    type="button"
                    aria-label="Add to favorites"
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:text-orange-400 transition-colors p-3 rounded-full shadow-lg hover:bg-white/30">
                    <Heart className="w-5 h-5" />
                  </button>

                  {/* Restaurant Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                      {deal.venue?.name || 'Restaurant'}
                    </h3>
                    <p className="text-white/90 text-sm flex items-center gap-2">
                      <span>{(deal.venue as any)?.businessType || 'Restaurant'}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-white/40'}`} />
                        ))}
                        <span className="ml-1">4.{Math.floor(Math.random() * 3) + 2}</span>
                      </div>
                    </p>
                  </div>
                </div>

                {/* Deal Info */}
            <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80 text-sm">
                        {Math.floor(Math.random() * 30) + 10} min away
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Timer className="w-4 h-4" />
                      {Math.floor(Math.random() * 120) + 30} min left
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-6 line-clamp-2">
                    {deal.description || 'Special deal available now!'}
                  </p>
                  
                  <button 
                    type="button"
                    aria-label="Claim this deal"
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                    Claim This Deal
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Deals CTA */}
          <div className="text-center mt-12">
            <button 
              onClick={() => router.push('/deals')}
              className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-3xl font-black text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 hover:scale-105 flex items-center gap-4 mx-auto"
            >
              <Gift className="w-6 h-6 group-hover:animate-bounce" />
              View All Amazing Deals
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Deals Explorer */}
      <div className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 mb-6">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-blue-500 font-bold">EXPLORE & DISCOVER</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Interactive</span> Deals Explorer
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Switch between <span className="font-bold text-blue-500">grid view</span> and <span className="font-bold text-purple-500">interactive map</span> to find the perfect deals near you!
            </p>
          </div>

          {/* Enhanced View Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-2 flex gap-2 shadow-2xl">
              <button
                type="button"
                aria-label="Switch to grid view"
                onClick={() => setView('grid')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                  view === 'grid'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Grid className="w-6 h-6" />
                Grid View
              </button>
              <button
                type="button"
                aria-label="Switch to map view"
                onClick={() => setView('map')}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                  view === 'map'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <MapPin className="w-6 h-6" />
                Map View
              </button>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <select 
                    value={filters.cuisine} 
                    onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Cuisines</option>
                    <option value="american">American</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="asian">Asian</option>
                  </select>
                  <select 
                    value={filters.distance} 
                    onChange={(e) => setFilters({...filters, distance: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">Any Distance</option>
                    <option value="1">Within 1 mile</option>
                    <option value="5">Within 5 miles</option>
                    <option value="10">Within 10 miles</option>
                  </select>
                </div>
                <div className="text-gray-600">
                  {filteredDeals.length} deals found
                </div>
              </div>
            </div>
          </div>

          {/* Content with Enhanced Styling */}
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDeals.map((deal, index) => (
                <div 
                  key={deal.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DealCard d={deal} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[700px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 dark:border-slate-700/20">
              <MapWithClusters deals={filteredDeals} />
            </div>
          )}

          {filteredDeals.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-4xl text-white">!</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                No deals found in your area
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Don't worry! Try expanding your search radius or adjusting your filters to discover amazing deals nearby.
              </p>
              <button
                type="button"
                aria-label="Reset search and filters"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    cuisine: 'all',
                    distance: 'all',
                    price: 'all',
                    maxDistance: 10,
                    minDiscount: 0,
                    openNow: false
                  });
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How It Works - Exciting */}
      <div className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-6 py-3 mb-6">
              <Rocket className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-500 font-bold">SUPER SIMPLE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Happy Hour</span> Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get amazing deals in just <span className="font-bold text-emerald-500">3 simple steps</span>! 
              It's so easy, you'll be saving money in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Find Amazing Deals</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Browse real-time deals from restaurants near you. Our smart algorithm shows you the best offers first!
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Smartphone className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Claim & Save</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Tap to claim your deal instantly! Get your unique code and start saving money right away.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Enjoy & Save</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Show your code at the restaurant and enjoy your delicious meal while saving big bucks!
              </p>
                </div>
              </div>
              
          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to Start Saving?
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                Join thousands of smart diners who are already saving money every day!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  type="button"
                  aria-label="Start saving with deals"
                  onClick={() => router.push('/deals')}
                  className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                >
                  <Diamond className="w-6 h-6 group-hover:animate-spin" />
                  Start Saving Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Restaurants Section - Exciting */}
      <div className="py-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-6">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-bold">FOR RESTAURANTS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Quiet Hours</span> into <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Revenue Gold</span>
          </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Join <span className="font-bold text-yellow-300">500+ restaurants</span> already using Happy Hour to fill empty tables and boost revenue during slow periods!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center text-white group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  💰
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Boost Revenue by 40%</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Fill empty tables during slow periods and increase your average order value with targeted deals
              </p>
            </div>
            
            <div className="text-center text-white group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  👥
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Attract New Customers</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Reach food lovers in your area who are actively looking for great deals and new places to try
              </p>
            </div>
            
            <div className="text-center text-white group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Activation</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Create and activate deals in seconds. No complicated setup, no waiting, just instant results
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-white/90 mb-8">
                Join the restaurant revolution! Start your free trial today and see the difference in just 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  type="button"
                  aria-label="Start free trial for restaurants"
                  className="group bg-white text-orange-600 px-12 py-6 rounded-3xl font-black text-xl hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105 flex items-center gap-3">
                  <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                                  <button 
                                    type="button"
                                    aria-label="Watch success stories"
                                    className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
                    <span className="text-2xl">▶</span>
                    Watch Success Stories
            </button>
              </div>
              <p className="text-white/80 mt-6 text-sm">
                No setup fees • Cancel anytime • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
