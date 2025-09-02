'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  ChevronRight,
  Play,
  Shield,
  Globe,
  Sparkles,
  Rocket,
  Gift
} from 'lucide-react';

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

export default function HomePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simulate loading deals
    setTimeout(() => {
      setDeals([
        {
          id: '1',
          title: 'Happy Hour Special',
          description: '50% off all drinks and appetizers',
          percentOff: 50,
          venue: { name: 'Sample Restaurant', address: '123 Main St' },
          cuisine: 'American',
          distance: '0.5 mi',
          rating: 4.5,
          isOpen: true
        },
        {
          id: '2',
          title: 'Lunch Deal',
          description: '30% off lunch entrees',
          percentOff: 30,
          venue: { name: 'Another Place', address: '456 Oak Ave' },
          cuisine: 'Italian',
          distance: '0.8 mi',
          rating: 4.2,
          isOpen: true
        },
        {
          id: '3',
          title: 'Dinner Special',
          description: '25% off dinner for two',
          percentOff: 25,
          venue: { name: 'Fine Dining', address: '789 Pine St' },
          cuisine: 'French',
          distance: '1.2 mi',
          rating: 4.8,
          isOpen: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDealClick = (dealId: string) => {
    router.push(`/deal/${dealId}/view`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            {/* Customer Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in shadow-2xl">
              <div className="flex -space-x-1 sm:-space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base">10,000+ Happy Customers</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Main Title */}
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

            {/* Subtitle */}
            <div className="mb-8 sm:mb-12 animate-slide-in-up">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-2xl">Find Amazing Deals</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-lg">
                Restaurants flip the switch when they're quiet. You get instant deals nearby.
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, deals..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-14 pr-14 py-4 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/20 transition-all duration-200 shadow-lg text-lg"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setLoading(true);
                    setTimeout(() => setLoading(false), 500);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                  : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
              }`}
            >
              <Grid className="w-4 h-4 inline mr-2" />
              All Deals
            </button>
            <button 
              onClick={() => setActiveFilter('near')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === 'near' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                  : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Near Me
            </button>
            <button 
              onClick={() => setActiveFilter('open')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === 'open' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                  : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Open Now
            </button>
            <button 
              onClick={() => setActiveFilter('top')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === 'top' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                  : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Top Rated
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-fade-in">
            <button 
              onClick={() => router.push('/signup')}
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3 sm:gap-4"
            >
              <Rocket className="w-6 h-6 sm:w-8 sm:h-8 group-hover:animate-bounce" />
              <span>Get Started Free</span>
              <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/signup')}
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Deals</h2>
          <p className="text-white/80">Discover the best happy hour deals in your area</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 animate-pulse">
                <div className="h-48 bg-white/20 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No deals found</h3>
            <p className="text-white/70">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal, index) => (
              <div 
                key={deal.id} 
                onClick={() => handleDealClick(deal.id)}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
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
                    </div>
                    <button className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/30 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to save on great food?</h3>
            <p className="text-white/80 mb-6">Join thousands of happy customers who save money every day</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/signup')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => router.push('/explore')}
                className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200"
              >
                Explore Deals
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium">Trusted</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">Local</span>
          </div>
        </div>
      </div>
    </div>
  );
}