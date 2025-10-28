'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock, ArrowRight, Edit3, Heart, TrendingUp, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Image from 'next/image';
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
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [happeningNow, setHappeningNow] = useState<Deal[]>([]);
  const [tonightsDeals, setTonightsDeals] = useState<Deal[]>([]);
  const [newThisWeek, setNewThisWeek] = useState<Deal[]>([]);
  const [personalized, setPersonalized] = useState<Deal[]>([]);
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
      
      const happening = allDeals
        .filter((deal: Deal) => {
          const end = new Date(deal.endAt);
          const diff = end.getTime() - now.getTime();
          return diff > 0 && diff < 4 * 60 * 60 * 1000;
        })
        .slice(0, 6);
      setHappeningNow(happening);
      
      const tonight = allDeals
        .filter((deal: Deal) => {
          const start = new Date(deal.startAt);
          const end = new Date(deal.endAt);
          const startHour = start.getHours();
          return startHour >= 17 && startHour <= 20 && end > now;
        })
        .slice(0, 6);
      setTonightsDeals(tonight);
      
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newDeals = allDeals
        .filter((deal: Deal) => new Date(deal.startAt) > weekAgo)
        .slice(0, 6);
      setNewThisWeek(newDeals);
      
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

  const DealCard = ({ deal, index }: { deal: Deal; index: number }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => router.push(`/deal/${deal.id}/view`)}
      className="flex-shrink-0 w-[340px] group"
    >
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100">
        {/* Image */}
        <div className="relative h-[200px] bg-gradient-to-br from-orange-500 to-pink-500">
          {/* Restaurant Photo - would be real in production */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 flex items-center justify-center">
            <div className="text-8xl opacity-20">
              {deal.venue.businessType?.[0] === 'Italian' ? '🍝' :
               deal.venue.businessType?.[0] === 'Sushi' ? '🍣' :
               deal.venue.businessType?.[0] === 'Pizza' ? '🍕' :
               deal.venue.businessType?.[0] === 'Mexican' ? '🌮' :
               '🍽️'}
            </div>
          </div>
          
          {/* Discount Badge */}
          {deal.percentOff && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1 font-bold">
              <Tag className="w-4 h-4" />
              {deal.percentOff}% OFF
            </div>
          )}
          
          {/* Save Button */}
          <button 
            onClick={(e) => handleSaveDeal(deal.id, e)}
            className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all hover:scale-110"
          >
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
          
          {/* Time Badge */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{formatTime(deal.startAt)} - {formatTime(deal.endAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
            {deal.venue.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">
            {deal.title}
          </p>
          
          {/* Rating & Distance */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            {deal.venue.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-900">{deal.venue.rating}</span>
                <span className="text-xs text-gray-500">(124 reviews)</span>
              </div>
            )}
            <span className="text-xs font-semibold text-orange-600">$$ • 0.8 mi</span>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/deal/${deal.id}/view`);
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
          >
            View Deal
          </button>
        </div>
      </div>
    </motion.div>
  );

  const SectionRow = ({ emoji, title, subtitle, deals, href }: { 
    emoji: string; 
    title: string; 
    subtitle: string;
    deals: Deal[]; 
    href: string;
  }) => {
    if (deals.length === 0) return null;
    
    return (
      <section className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{emoji}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-500 ml-11">{subtitle}</p>
          </div>
          <a 
            href={href} 
            className="hidden sm:flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {deals.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} index={index} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          {/* Location & Time Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-bold text-gray-900">{location}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{timeWindow}</span>
            </div>
            <button
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Great restaurants.<br />
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Off-peak prices.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium">
            Save 20–60% when you dine a little earlier or later
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => router.push('/explore')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Find deals near me
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 text-lg font-bold rounded-2xl border-2 border-gray-300 hover:border-orange-500"
            >
              How it works
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search cuisines or places (pizza, sushi, SoHo…)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 text-lg bg-transparent focus:outline-none"
            />
          </div>
        </form>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-3 justify-center">
          {popularCuisines.map((cuisine) => (
            <motion.button
              key={cuisine}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/explore?q=${encodeURIComponent(cuisine)}`)}
              className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 rounded-full text-sm font-bold text-gray-700 hover:text-orange-600 transition-all shadow-sm hover:shadow-md"
            >
              {cuisine}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-28">
        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[480px] w-[340px] flex-shrink-0 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <SectionRow 
              emoji="🔥" 
              title="Happening Now" 
              subtitle="Deals ending soon - grab them quick!"
              deals={happeningNow} 
              href="/explore" 
            />
            <SectionRow 
              emoji="🌙" 
              title="Tonight 5–8pm" 
              subtitle="Starting soon"
              deals={tonightsDeals} 
              href="/explore" 
            />
            <SectionRow 
              emoji="🆕" 
              title="New this week" 
              subtitle="Fresh deals just added"
              deals={newThisWeek} 
              href="/explore" 
            />
            <SectionRow 
              emoji="⭐" 
              title="Popular nearby" 
              subtitle="Based on your preferences"
              deals={personalized} 
              href="/explore" 
            />
          </>
        )}

        {/* Empty State */}
        {!loading && happeningNow.length === 0 && tonightsDeals.length === 0 && 
         newThisWeek.length === 0 && personalized.length === 0 && (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">🍽️</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Nothing right now</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Try widening your time window or checking nearby neighborhoods.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => router.push('/explore')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl"
              >
                See Tonight's Deals
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/explore')}
                className="px-8 py-4 rounded-2xl font-bold text-lg border-2"
              >
                Browse All Deals
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-16"
          >
            How it works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: '🔍', title: 'Browse off-peak deals', desc: 'Find amazing deals near you' },
              { icon: '📱', title: 'Redeem at the venue', desc: 'Show QR code at restaurant' },
              { icon: '💰', title: 'Save on your bill', desc: 'Enjoy discounted prices' },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="text-7xl mb-6">{step.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 text-center bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-3xl mx-4 mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">Over 1,000</span>
        </div>
        <p className="text-gray-600 text-lg">diners saved $50,000+ this month</p>
      </section>

      <BottomNav />
    </div>
  );
}

