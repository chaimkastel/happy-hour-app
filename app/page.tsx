'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, Edit3, Heart, TrendingUp, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { DealRow } from '@/components/deals/DealRow';
import { LocationButton } from '@/components/location/LocationButton';
import { LocationModal } from '@/components/location/LocationModal';
import { HowItWorks } from '@/components/how-it-works/HowItWorks';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLocation } from '@/context/LocationContext';
import BottomNav from '@/components/navigation/BottomNav';
import '../styles/design-tokens.css';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff?: number;
  originalPrice?: number;
  discountedPrice?: number;
  startAt: string;
  endAt: string;
  image?: string;
  venue: {
    name: string;
    address: string;
    city?: string;
    state?: string;
    rating?: number;
    businessType?: string[];
  };
}

const popularCuisines = ['Pizza', 'Sushi', 'Burgers', 'Italian', 'Mexican', 'Healthy', 'Thai', 'Cocktails'];
const priceFilters = ['$', '$$', '$$$'];
const timeFilters = ['Now', 'Later today', 'Tomorrow'];
const distanceFilters = ['≤1 mi', '≤3 mi', '≤5 mi'];

// Rotating friendly taglines
const taglines = [
  'Save up to 60% when you dine off-peak',
  'Great deals. Great food. Great times.',
  'Your favorite restaurants at unbeatable prices',
  'Dine smart. Save more. Enjoy tonight.',
  'Exclusive off-peak dining experiences',
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [happeningNow, setHappeningNow] = useState<Deal[]>([]);
  const [tonightsDeals, setTonightsDeals] = useState<Deal[]>([]);
  const [newThisWeek, setNewThisWeek] = useState<Deal[]>([]);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showTypeahead, setShowTypeahead] = useState(false);
  const [typeaheadResults, setTypeaheadResults] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [tagline, setTagline] = useState(taglines[0]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  const { location, timeWindow } = useLocation();
  const { data: session } = useSession();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Pick random tagline on mount
  useEffect(() => {
    setTagline(taglines[Math.floor(Math.random() * taglines.length)]);
  }, []);

  useEffect(() => {
    fetchDeals();

    // Handle scroll for sticky bar
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close typeahead
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowTypeahead(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced typeahead search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setTypeaheadResults([]);
      return;
    }

    const timer = setTimeout(() => {
      // Mock typeahead results
      const results = [
        `${searchQuery} near ${location?.neighborhood || 'Brooklyn'}`,
        `${searchQuery} happy hour`,
        `${searchQuery} tonight`,
        `Best ${searchQuery} deals`,
      ];
      setTypeaheadResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, location]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/deals/mock');
      const data = await response.json();
      const allDeals = data.deals || [];
      setDeals(allDeals);
      
      const now = new Date();
      
      // Happening Now - ending within 2 hours
      const happening = allDeals
        .filter((deal: Deal) => {
          const end = new Date(deal.endAt);
          const diff = end.getTime() - now.getTime();
          return diff > 0 && diff < 2 * 60 * 60 * 1000;
        })
        .slice(0, 8);
      setHappeningNow(happening);
      
      // Tonight 5-9pm
      const tonight = allDeals
        .filter((deal: Deal) => {
          const start = new Date(deal.startAt);
          const hour = start.getHours();
          return hour >= 17 && hour <= 20;
        })
        .slice(0, 8);
      setTonightsDeals(tonight);
      
      // New This Week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newDeals = allDeals
        .filter((deal: Deal) => new Date(deal.startAt) > weekAgo)
        .slice(0, 8);
      setNewThisWeek(newDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleSaveDeal = async (dealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      router.push('/login');
      return;
    }
    // TODO: Call favorites API
    console.log('Save deal:', dealId);
  };

  const DealCard = ({ deal, index }: { deal: Deal; index: number }) => {
  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.01, y: -4 }}
        onClick={() => router.push(`/deal/${deal.id}/view`)}
        className="flex-shrink-0 w-[280px] group cursor-pointer"
      >
        <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group">
          {/* Image with Gradient Overlay */}
          <div className="relative h-[200px] overflow-hidden bg-gray-100">
            {deal.image ? (
          <Image
                src={deal.image} 
                alt={deal.title}
                fill
                className="object-cover transition-transform duration-300"
                sizes="280px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-300">
                <div className="text-5xl opacity-20 flex items-center justify-center h-full">
                  🍽️
        </div>
              </div>
            )}
            {/* Gradient overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Discount Badge */}
            {deal.percentOff && (
              <div className="absolute top-3 left-3 bg-orange-600 text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-lg">
                {deal.percentOff}% OFF
              </div>
            )}
            
            {/* Save Button */}
            <button 
              onClick={(e) => handleSaveDeal(deal.id, e)}
              className="absolute top-3 right-3 p-2 bg-white/95 rounded-full shadow-lg hover:bg-white transition-all"
            >
              <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
            </button>
            
            {/* Time Pill - Pinned bottom-left */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/95 rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-semibold text-gray-700">
                <Clock className="w-3 h-3 text-orange-600" />
                <span>{formatTime(deal.startAt)}-{formatTime(deal.endAt)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
              {deal.venue.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {deal.title}
            </p>
            
            {/* Rating & Distance - Single line */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              {deal.venue.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-700">{deal.venue.rating}</span>
              </div>
            )}
              <span>0.8 mi away</span>
            </div>
              </div>
        </div>
      </motion.div>
    );
  };

  const DealRow = ({ emoji, title, subtitle, deals, filter = '' }: { 
    emoji: string; 
    title: string; 
    subtitle: string;
    deals: Deal[];
    filter?: string;
  }) => {
    if (deals.length === 0) return null;
    
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 px-4">
            <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-0.5">
              {emoji} {title}
            </h2>
            <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
          {filter && (
            <button 
              onClick={() => router.push(`/explore?${filter}`)}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-semibold transition-colors"
            >
              See All →
            </button>
                        )}
                  </div>

        {/* Cards with Edge Padding */}
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
          {deals.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} index={index} />
          ))}
          </div>
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Context Bar */}
      <AnimatePresence>
        {showStickyBar && (
              <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-11 bg-white/70 backdrop-blur-md border-b border-gray-200 z-50 flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-2 text-sm text-gray-700 w-full max-w-7xl mx-auto">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-medium">{location?.neighborhood || 'Brooklyn'}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{timeWindow}</span>
            </div>
            <button 
              onClick={() => setShowLocationModal(true)}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
            >
              Edit
            </button>
                </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Premium Glass Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative border-b border-gray-200 overflow-hidden"
        style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}
      >
        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#fff8f1_0%,_#fff_40%,_#fefefe_100%)]" />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40" />
        <div className="absolute inset-0 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.03)]" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          {/* Welcome Message with Animation */}
          <div className="mb-3">
            <motion.h1 
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
            >
              Hey, {location?.neighborhood || 'Brooklyn'} 👋
            </motion.h1>
            <motion.p 
              key={tagline}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-slate-600 text-sm font-medium mt-0.5"
            >
              {tagline}
            </motion.p>
          </div>

          {/* Location Button */}
          <motion.div 
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 flex items-center justify-between"
          >
            <LocationButton onEdit={() => setShowLocationModal(true)} />
            
            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-slate-700" />
              </button>
              <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <Heart className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </motion.div>
            </div>
      </motion.div>
            
      {/* Search Section with Typeahead */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-6 relative" 
        ref={searchRef}
      >
        {/* Search Input */}
        <motion.form 
          onSubmit={handleSearch}
          className="mb-3"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Find deals by cuisine, restaurant, or vibe…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowTypeahead(true)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm shadow-sm transition-all text-slate-900"
              aria-label="Search deals"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
            </div>
        </motion.form>

        {/* Micro Copy */}
        <p className="text-slate-500 text-xs font-medium mb-3">
          Great restaurants. Off-peak prices.
        </p>
        
        {/* Cuisine Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {popularCuisines.map((cuisine, i) => (
            <motion.button
              key={cuisine}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/explore?q=${encodeURIComponent(cuisine)}`)}
              className="flex-shrink-0 px-3 py-1.5 bg-white border border-slate-300 hover:border-orange-500 hover:bg-orange-50 rounded-full text-xs font-medium text-slate-700 hover:text-orange-600 transition-all"
            >
              {cuisine}
            </motion.button>
          ))}
            </div>
            
        {/* Typeahead Dropdown */}
        <AnimatePresence>
          {showTypeahead && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 overflow-hidden z-50"
            >
              {/* Recent Searches */}
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent</p>
                <div className="text-sm text-gray-700">
                  <button className="w-full text-left py-2 hover:bg-gray-50 rounded px-2">Pizza Brooklyn</button>
                  <button className="w-full text-left py-2 hover:bg-gray-50 rounded px-2">Sushi deals</button>
                </div>
              </div>

              {/* Trending */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <p className="text-xs font-semibold text-gray-500 uppercase">Trending nearby</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Pizza', 'Sushi', 'Burgers'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => router.push(`/explore?q=${c}`)}
                      className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-full text-xs font-semibold hover:bg-orange-100"
                    >
                      {c}
                    </button>
                  ))}
                  </div>
      </div>

              {/* Quick Filters */}
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick filters</p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {timeFilters.map((filter) => (
                      <button 
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedFilter === filter 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
        </div>
                  <div className="flex gap-2 flex-wrap">
                    {priceFilters.map((filter) => (
                      <button 
                        key={filter}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                      >
                        {filter}
                      </button>
                    ))}
                    {distanceFilters.map((filter) => (
                      <button 
                        key={filter}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
            </div>
          </div>

              {/* Typeahead Results */}
              {typeaheadResults.length > 0 && (
                <div className="p-3 border-t border-gray-100">
                  {typeaheadResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => router.push(`/explore?q=${encodeURIComponent(result)}`)}
                      className="w-full text-left py-2 px-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                    >
                      {result}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="h-px bg-slate-200 -mx-4 md:-mx-6"></div>
      </motion.div>

      {/* Saved Starts Soon Nudge - Glass Card */}
      {!loading && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="max-w-7xl mx-auto px-4 md:px-6 mb-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/70 to-pink-50/70 backdrop-blur-sm p-4 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              {/* Clock Icon in Soft Badge */}
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Your saved Pizza Paradise starts at 5:00 PM</p>
                <p className="text-xs text-neutral-500">≈0.8 mi away</p>
                </div>
                </div>
            <button 
              onClick={() => router.push('/wallet?saved')}
              className="px-4 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-xl text-orange-600 hover:text-orange-700 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="View saved deal"
            >
              View →
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-28">
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-[280px] flex-shrink-0 rounded-xl" />
            ))}
                </div>
        ) : (
          <>
            <DealRow 
              emoji="🔥" 
              title="Happening Now" 
              subtitle="Deals ending soon"
              deals={happeningNow}
              filter="when=now"
            />
            <DealRow 
              emoji="🌙" 
              title="Tonight 5–9pm" 
              subtitle="Happy hour specials"
              deals={tonightsDeals}
              filter="when=tonight"
            />
            <DealRow 
              emoji="🆕" 
              title="New This Week" 
              subtitle="Fresh deals added"
              deals={newThisWeek}
              filter="when=new"
            />
          </>
        )}

        {/* Empty State */}
        {!loading && happeningNow.length === 0 && tonightsDeals.length === 0 && 
         newThisWeek.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-7xl mb-4">🍸</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Nothing nearby yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Check back at 5pm — new happy hours are added daily!
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
      
      {/* Location Modal */}
      <LocationModal 
        isOpen={showLocationModal} 
        onClose={() => setShowLocationModal(false)} 
      />
      
      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
}
