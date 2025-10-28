'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Clock, ArrowRight, Edit3, Heart, X, TrendingUp, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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

const popularCuisines = ['Pizza', 'Sushi', 'Burgers', 'Italian', 'Mexican', 'Healthy', 'Thai', 'Cocktails'];
const timeWindows = ['Now', 'Later today', 'This weekend', 'Custom'];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Brooklyn');
  const [timeWindow, setTimeWindow] = useState('Now–7pm');
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [happeningNow, setHappeningNow] = useState<Deal[]>([]);
  const [tonightsDeals, setTonightsDeals] = useState<Deal[]>([]);
  const [newThisWeek, setNewThisWeek] = useState<Deal[]>([]);
  const [personalized, setPersonalized] = useState<Deal[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/deals/search?limit=50');
      const data = await response.json();
      const allDeals = data.deals || [];
      setDeals(allDeals);
      
      const now = new Date();
      
      // Happening Now
      const happening = allDeals
        .filter((deal: Deal) => {
          const end = new Date(deal.endAt);
          const diff = end.getTime() - now.getTime();
          return diff > 0 && diff < 4 * 60 * 60 * 1000;
        })
        .slice(0, 6);
      setHappeningNow(happening);
      
      // Tonight 5-8pm
      const tonight = allDeals
        .filter((deal: Deal) => {
          const start = new Date(deal.startAt);
          const end = new Date(deal.endAt);
          const startHour = start.getHours();
          return startHour >= 17 && startHour <= 20 && end > now;
        })
        .slice(0, 6);
      setTonightsDeals(tonight);
      
      // New this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newDeals = allDeals
        .filter((deal: Deal) => new Date(deal.startAt) > weekAgo)
        .slice(0, 6);
      setNewThisWeek(newDeals);
      
      // Personalized/Popular
      const popular = allDeals
        .sort((a: Deal, b: Deal) => (b.venue.rating || 0) - (a.venue.rating || 0))
        .slice(0, 6);
      setPersonalized(popular);
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

  const handleCuisineClick = (cuisine: string) => {
    router.push(`/explore?q=${encodeURIComponent(cuisine)}`);
  };

  const handleSaveDeal = async (dealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    // TODO: Call favorites API
    console.log('Save deal:', dealId);
  };

  const SectionRow = ({ emoji, title, deals, href }: { emoji: string; title: string; deals: Deal[]; href: string }) => {
    if (deals.length === 0) return null;
    
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <a href={href} className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {deals.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} index={index} onSave={handleSaveDeal} />
          ))}
        </div>
      </section>
    );
  };

  const DealCard = ({ deal, index, onSave }: { deal: Deal; index: number; onSave: (id: string, e: React.MouseEvent) => void }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => router.push(`/deal/${deal.id}/view`)}
      className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 rounded-t-2xl">
        <div className="absolute inset-0 flex items-center justify-center text-7xl">
          {deal.venue.businessType?.[0] === 'Italian' ? '🍝' :
           deal.venue.businessType?.[0] === 'Sushi' ? '🍣' :
           deal.venue.businessType?.[0] === 'Pizza' ? '🍕' :
           deal.venue.businessType?.[0] === 'Mexican' ? '🌮' :
           '🍽️'}
        </div>
        {deal.percentOff && (
          <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
            {deal.percentOff}% off
          </div>
        )}
        <button 
          onClick={(e) => onSave(deal.id, e)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white shadow-md transition-colors"
        >
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{deal.venue.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{deal.title}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>3–6pm • dine-in</span>
          </div>
          {deal.venue.rating && (
            <>
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{deal.venue.rating}</span>
            </>
          )}
        </div>
        <Button
          size="sm"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/deal/${deal.id}/view`);
          }}
        >
          View Deal
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F5]">
      {/* Sticky Top Context Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{location}</span>
              <span className="text-gray-400">•</span>
              <span>{timeWindow}</span>
            </div>
            <button
              onClick={() => setShowLocationPanel(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Location Edit Panel */}
      <AnimatePresence>
        {showLocationPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowLocationPanel(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Choose time window</h3>
                <button onClick={() => setShowLocationPanel(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {timeWindows.map((window) => (
                  <button
                    key={window}
                    onClick={() => {
                      setTimeWindow(window);
                      setShowLocationPanel(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 font-medium"
                  >
                    {window}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 pb-28 space-y-8">
        {/* Hero Section */}
        <section className="pt-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Great restaurants. Off-peak prices.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Save 20–60% when you dine a little earlier or later.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => router.push('/explore')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
              >
                Find deals near me
              </Button>
              <Link href="#how-it-works">
                <Button variant="outline" className="px-8 py-3 text-lg font-semibold rounded-xl">
                  How it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Search */}
        <section>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cuisines or places (pizza, sushi, SoHo…)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base bg-white"
              />
            </div>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            {popularCuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => handleCuisineClick(cuisine)}
                className="px-4 py-2 bg-white border border-gray-300 hover:border-orange-500 hover:bg-orange-50 rounded-full text-sm font-medium transition-colors"
              >
                {cuisine}
              </button>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-12 bg-white rounded-2xl px-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: '🔍', title: 'Browse off-peak deals', desc: 'Find deals near you' },
              { icon: '📱', title: 'Redeem at the venue', desc: 'Show QR code at restaurant' },
              { icon: '💰', title: 'Save on your bill', desc: 'Enjoy discounted prices' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deal Sections */}
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-80 flex-shrink-0 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <SectionRow emoji="🔥" title="Happening Now" deals={happeningNow} href="/explore" />
            <SectionRow emoji="🌙" title="Tonight 5–8pm" deals={tonightsDeals} href="/explore" />
            <SectionRow emoji="🆕" title="New this week" deals={newThisWeek} href="/explore" />
            <SectionRow emoji="🍣" title="Popular nearby" deals={personalized} href="/explore" />
          </>
        )}

        {/* Empty State */}
        {!loading && happeningNow.length === 0 && tonightsDeals.length === 0 && 
         newThisWeek.length === 0 && personalized.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nothing right now</h3>
            <p className="text-gray-600 mb-6">
              Try widening your time window or checking nearby neighborhoods.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push('/explore')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                See Tonight's Deals
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/explore')}
                className="px-6 py-3 rounded-xl font-semibold"
              >
                Browse All Deals
              </Button>
            </div>
          </div>
        )}

        {/* Trust & Social Proof */}
        <section className="text-center py-8 bg-white rounded-2xl">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">Over 1,000</span> diners saved{' '}
            <span className="font-bold text-gray-900">$50,000+</span>
          </p>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

