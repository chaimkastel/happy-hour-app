'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Star, Clock, Trash2, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/navigation/BottomNav';

interface Deal {
  id: string;
  title: string;
  description: string;
  image?: string;
  percentOff?: number;
  startAt: string;
  endAt: string;
  venue: {
    name: string;
    city: string;
    state: string;
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      // For now, use mock data
      const response = await fetch('/api/deals/mock');
      const data = await response.json();
      const deals = data.deals || [];
      
      // Take first 3 as favorites
      setFavorites(deals.slice(0, 3));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (dealId: string) => {
    setFavorites(prev => prev.filter(deal => deal.id !== dealId));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 flex items-center justify-center pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600">Loading favorites...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-100"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Heart className="w-8 h-8 text-pink-500 fill-current" />
                My Favorites
              </h1>
              <p className="text-slate-600">Deals you love, saved for later</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {favorites.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-12 text-center border border-slate-200"
            >
              <div className="text-7xl mb-4">💔</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No favorites yet</h3>
              <p className="text-slate-600 mb-8">
                Start exploring deals and save your favorites to find them here later!
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-md transition-all"
              >
                Browse Deals
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="mb-6">
                <p className="text-sm text-slate-600">
                  You have <span className="font-semibold text-slate-900">{favorites.length}</span> saved {favorites.length === 1 ? 'favorite' : 'favorites'}
                </p>
              </div>

              {favorites.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 sm:w-56 overflow-hidden">
                      {deal.image ? (
                        <Image
                          src={deal.image}
                          alt={deal.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-300 flex items-center justify-center">
                          <div className="text-7xl opacity-30">🍽️</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Discount Badge */}
                      {deal.percentOff && (
                        <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                          {deal.percentOff}% OFF
                        </div>
                      )}

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFavorite(deal.id)}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </motion.button>

                      {/* Time Badge */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="backdrop-blur-sm bg-white/70 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700 shadow-md border border-white/20">
                          <Clock className="w-3 h-3 text-orange-600" />
                          <span>{formatTime(deal.startAt)}-{formatTime(deal.endAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2">
                        {deal.venue.name}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-2">{deal.title}</p>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{deal.venue.city}, {deal.venue.state}</span>
                      </div>

                      <Link
                        href={`/deal/${deal.id}/view`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-md transition-all"
                      >
                        View Deal
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
