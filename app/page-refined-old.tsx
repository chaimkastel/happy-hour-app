'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, ArrowRight, Flame, Sparkles, Bell, Menu, Heart, X, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/navigation/BottomNav';

interface Deal {
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
    city?: string;
    state?: string;
    rating?: number;
    businessType?: string[];
  };
}

const popularCuisines = ['Pizza', 'Sushi', 'Burgers', 'Vegan', 'Italian', 'Mexican', 'Thai', 'Indian'];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Downtown LA');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [happeningNow, setHappeningNow] = useState<Deal[]>([]);
  const [tonightsDeals, setTonightsDeals] = useState<Deal[]>([]);
  const [personalizedDeals, setPersonalizedDeals] = useState<Deal[]>([]);
  const [newThisWeek, setNewThisWeek] = useState<Deal[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/deals/search?limit=50');
        const data = await response.json();
        const allDeals = data.deals || [];
        setDeals(allDeals);
        
        // Filter for "Happening Now" (active deals ending soon)
        const now = new Date();
        const happening = allDeals
          .filter((deal: Deal) => {
            const end = new Date(deal.endAt);
            const diff = end.getTime() - now.getTime();
            return diff > 0 && diff < 4 * 60 * 60 * 1000; // Less than 4 hours left
          })
          .slice(0, 6);
        setHappeningNow(happening);
        
        // Filter for "Tonight" (deals starting soon today)
        const tonight = allDeals
          .filter((deal: Deal) => {
            const start = new Date(deal.startAt);
            const end = new Date(deal.endAt);
            const today = new Date().setHours(0, 0, 0, 0);
            const dealDay = new Date(start).setHours(0, 0, 0, 0);
            return dealDay === today && end > now && start < new Date(now.getTime() + 12 * 60 * 60 * 1000);
          })
          .slice(0, 6);
        setTonightsDeals(tonight);
        
        // New this week (created in last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newDeals = allDeals
          .filter((deal: Deal) => {
            const created = new Date(deal.startAt);
            return created > weekAgo;
          })
          .slice(0, 6);
        setNewThisWeek(newDeals);
        
        // Personalized (top rated)
        const personalized = allDeals
          .sort((a: Deal, b: Deal) => (b.venue.rating || 0) - (a.venue.rating || 0))
          .slice(0, 6);
        setPersonalizedDeals(personalized);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleCuisineClick = (cuisine: string) => {
    setSearchQuery(cuisine);
    router.push(`/explore?q=${encodeURIComponent(cuisine)}`);
    setShowSearchModal(false);
  };

  const DealCard = ({ deal, index }: { deal: Deal; index: number }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => router.push(`/deal/${deal.id}/view`)}
      className="flex-shrink-0 w-[300px]"
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white h-full">
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100">
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {deal.venue.businessType?.[0] === 'Italian' ? '🍝' :
             deal.venue.businessType?.[0] === 'Sushi' ? '🍣' :
             deal.venue.businessType?.[0] === 'Pizza' ? '🍕' :
             deal.venue.businessType?.[0] === 'Mexican' ? '🌮' :
             '🍽️'}
          </div>
          {deal.percentOff && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
              {deal.percentOff}% OFF
            </div>
          )}
          <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{deal.venue.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{deal.title}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTime(deal.startAt)}-{formatTime(deal.endAt)}</span>
            </div>
            {deal.venue.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{deal.venue.rating}</span>
              </div>
            )}
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white w-full font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/deal/${deal.id}/view`);
            }}
          >
            View & Redeem
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const SectionHeader = ({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={() => router.push('/explore')}
        className="text-orange-600 hover:text-orange-700 text-sm"
      >
        View All <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900">Happy Hour Premium Deals</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setShowMenu(!showMenu)}>
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Location & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">{location}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Now–9pm</span>
            </div>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => setShowSearchModal(true)}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-4 text-left text-gray-500 hover:border-orange-500 transition-colors"
        >
          <Search className="w-5 h-5 inline mr-2" />
          What do you feel like eating?
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-8">
        {/* Happening Now */}
        {happeningNow.length > 0 && (
          <section>
            <SectionHeader emoji="🔥" title="Happening Now" subtitle="Ending soon - grab them quick!" />
            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-[300px] flex-shrink-0 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {happeningNow.map((deal, index) => (
                  <DealCard key={deal.id} deal={deal} index={index} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tonight's Happy Hours */}
        {tonightsDeals.length > 0 && (
          <section>
            <SectionHeader emoji="🌙" title="Tonight's Happy Hours" subtitle="Starting soon today" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {tonightsDeals.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Because You Liked */}
        {personalizedDeals.length > 0 && (
          <section>
            <SectionHeader emoji="🍣" title="Because You Liked..." subtitle="Picked just for you" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {personalizedDeals.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* New This Week */}
        {newThisWeek.length > 0 && (
          <section>
            <SectionHeader emoji="🆕" title="New This Week" subtitle="Fresh deals just added" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {newThisWeek.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && happeningNow.length === 0 && tonightsDeals.length === 0 && 
         personalizedDeals.length === 0 && newThisWeek.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No deals right now</h3>
            <p className="text-gray-600 mb-1">Check back at 5pm for tonight's happy hours!</p>
            <Link href="/explore" className="mt-4 inline-block">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold">
                Browse All Deals
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => router.push('/redeem')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30"
      >
        <QrCode className="w-6 h-6" />
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start pt-20"
            onClick={() => setShowSearchModal(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Search</h2>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="mb-6">
                <Input
                  type="text"
                  placeholder="Search for cuisine, restaurant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </form>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Popular Cuisines</h3>
                <div className="flex flex-wrap gap-2">
                  {popularCuisines.map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => handleCuisineClick(cuisine)}
                      className="px-4 py-2 bg-gray-100 hover:bg-orange-500 hover:text-white rounded-full text-sm font-medium transition-colors"
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

