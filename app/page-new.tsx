'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock, ArrowRight, Flame, Sparkles, Clock3, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import Image from 'next/image';
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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Downtown LA');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [happeningNow, setHappeningNow] = useState<Deal[]>([]);
  const [tonightsDeals, setTonightsDeals] = useState<Deal[]>([]);
  const [personalizedDeals, setPersonalizedDeals] = useState<Deal[]>([]);
  const [newThisWeek, setNewThisWeek] = useState<Deal[]>([]);
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
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getTimeRemaining = (endAt: string) => {
    const now = new Date();
    const end = new Date(endAt);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  const DealCard = ({ deal, index }: { deal: Deal; index: number }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={() => router.push(`/deal/${deal.id}/view`)}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white">
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100">
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🍕
          </div>
          {deal.percentOff && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {deal.percentOff}% OFF
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{deal.venue.name}</h3>
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.title}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(deal.startAt)} - {formatTime(deal.endAt)}</span>
            </div>
            {deal.venue.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{deal.venue.rating}</span>
              </div>
            )}
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white w-full"
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

  const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-orange-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={() => router.push('/explore')}
        className="text-orange-600 hover:text-orange-700"
      >
        View All <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{location}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">Now - 9pm</span>
            </div>
            <Link href="/account" className="text-sm font-medium text-gray-700 hover:text-orange-600">
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="What do you feel like eating?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-base bg-gray-50 border-gray-200 focus:bg-white"
          />
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-12">
        {/* Happening Now */}
        {happeningNow.length > 0 && (
          <section>
            <SectionHeader
              icon={Flame}
              title="Happening Now"
              subtitle="Ending soon - grab them quick!"
            />
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <SectionHeader
              icon={Clock3}
              title="Tonight's Happy Hours"
              subtitle="Starting soon today"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tonightsDeals.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Because You Liked */}
        {personalizedDeals.length > 0 && (
          <section>
            <SectionHeader
              icon={Sparkles}
              title="Because You Liked..."
              subtitle="Picked just for you"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedDeals.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* New This Week */}
        {newThisWeek.length > 0 && (
          <section>
            <SectionHeader
              icon={Star}
              title="New This Week"
              subtitle="Fresh deals just added"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-gray-600 mb-6">Check back later for amazing restaurant deals near you</p>
            <Link href="/explore">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold">
                Browse All Deals
              </Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

