'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Star, Edit3, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/navigation/BottomNav';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  restaurant: string;
  address: string;
  rating: number;
  timeWindow: string;
  image: string;
  distance: string;
  endingSoon: boolean;
}

export default function HomePage() {
  const [location, setLocation] = useState('Downtown LA');
  const [timeRange, setTimeRange] = useState('Now - 8pm');
  const [happeningNow, setHappeningNow] = useState<Deal[]>([]);
  const [tonightDeals, setTonightDeals] = useState<Deal[]>([]);
  const [recommendations, setRecommendations] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch personalized deals
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      // Fetch deals based on time and location
      const [nowRes, tonightRes, recRes] = await Promise.all([
        fetch('/api/deals/search?q=&limit=10'),
        fetch('/api/deals/search?q=&limit=6'),
        fetch('/api/deals/search?q=pizza&limit=4'),
      ]);

      const nowData = await nowRes.json();
      const tonightData = await tonightRes.json();
      const recData = await recRes.json();

      setHappeningNow(transformDeals(nowData.deals || []));
      setTonightDeals(transformDeals(tonightData.deals || []));
      setRecommendations(transformDeals(recData.deals || []));
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformDeals = (deals: any[]): Deal[] => {
    return deals.map(deal => ({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      percentOff: deal.percentOff || 0,
      restaurant: deal.venue?.name || 'Restaurant',
      address: deal.venue?.address || 'Address',
      rating: deal.venue?.rating || 4.5,
      timeWindow: `${new Date(deal.startAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${new Date(deal.endAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
      image: Array.isArray(deal.venue?.photos) ? JSON.parse(deal.venue.photos)[0] : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      distance: '0.3mi',
      endingSoon: false,
    }));
  };

  const DealCard = ({ deal, large = false }: { deal: Deal; large?: boolean }) => (
    <motion.div
      className={`flex-shrink-0 ${large ? 'w-72' : 'w-64'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push(`/deal/${deal.id}/view`)}>
        <div className="relative h-48">
          <Image
            src={deal.image}
            alt={deal.title}
            fill
            className="object-cover"
          />
          {deal.endingSoon && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
               <Flame className="w-3 h-3" />
              Ending Soon
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 font-bold text-lg px-3 py-1 rounded-lg">
            {deal.percentOff}% OFF
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">{deal.restaurant}</h3>
              <p className="text-sm text-gray-600 truncate">{deal.title}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{deal.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {deal.distance}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {deal.timeWindow}
            </span>
          </div>

          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
            View & Redeem
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmptyState = ({ message, suggestion }: { message: string; suggestion: string }) => (
    <div className="text-center py-12 px-4">
      <p className="text-gray-500 text-lg mb-2">{message}</p>
      <p className="text-gray-400 text-sm">{suggestion}</p>
    </div>
  );

  const SectionHeader = ({ title, icon: Icon, subtitle }: { title: string; icon: any; subtitle?: string }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-6 h-6 text-orange-600" />}
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && (
        <span className="text-sm text-gray-500">{subtitle}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Happy Hour</h1>
            <Link href="/account">
              <Button variant="ghost" size="sm">
                Account
              </Button>
            </Link>
          </div>
          
          {/* Location & Time Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Deals near {location}</span>
              <button onClick={() => {/* Open location picker */}}>
                <Edit3 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{timeRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Happening Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
           <SectionHeader title="Happening Now" icon={Flame} subtitle="Ending soon" />
          
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-64 h-80 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : happeningNow.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {happeningNow.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="No deals happening now"
              suggestion="Check out our evening deals below ⬇️"
            />
          )}
        </motion.div>

        {/* Tonight Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SectionHeader title="Tonight 5–8pm" icon={Clock} />
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : tonightDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tonightDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} large />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="No evening deals today"
              suggestion="Check back tomorrow for new deals!"
            />
          )}
        </motion.div>

        {/* Because You Liked */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <SectionHeader 
              title="Because You Liked Pizza" 
              icon={Star} 
              subtitle="Personalized for you"
            />
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {recommendations.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
