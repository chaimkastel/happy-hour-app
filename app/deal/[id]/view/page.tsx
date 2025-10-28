'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Users, 
  CheckCircle,
  ExternalLink,
  Share2,
  Heart,
  Info,
  QrCode
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import BottomNav from '@/components/navigation/BottomNav';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  startAt: string;
  endAt: string;
  image?: string;
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    rating: number;
    latitude: number;
    longitude: number;
  };
}

function DealDetailContent() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (dealId) {
      fetchDeal();
    }
  }, [dealId]);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/deals/mock`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Deal not found');
        } else {
          setError('Failed to load deal');
        }
        return;
      }

      const data = await response.json();
      const deals = data.deals || [];
      const foundDeal = deals.find((d: Deal) => d.id === dealId);
      
      if (foundDeal) {
        setDeal(foundDeal);
      } else {
        setError('Deal not found');
      }
    } catch (err) {
      console.error('Error fetching deal:', err);
      setError('Failed to load deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    setIsFavorited(!isFavorited);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 pb-20">
        <div className="h-80 bg-gray-200 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 flex items-center justify-center pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Deal Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'This deal may have expired or been removed.'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              Go Back
            </button>
            <Link
              href="/explore"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-md transition-all"
            >
              Browse Deals
            </Link>
          </div>
        </motion.div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 pb-20">
      {/* Hero Image */}
      <div className="relative h-80 w-full overflow-hidden">
        {deal.image ? (
          <Image
            src={deal.image}
            alt={deal.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-300 flex items-center justify-center">
            <div className="text-9xl opacity-30">🍽️</div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-slate-900" />
            </motion.button>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-900'}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
              >
                <Share2 className="w-5 h-5 text-slate-900" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Discount Badge on Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-20 left-4 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-xl"
        >
          {deal.percentOff}% OFF
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto px-4 py-6 space-y-6"
      >
        {/* Title & Venue */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{deal.title}</h1>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{deal.venue.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-sm">{deal.venue.city}, {deal.venue.state}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-700 leading-relaxed">{deal.description}</p>

        {/* Key Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <Clock className="w-5 h-5 text-orange-600 mb-2" />
            <div className="text-xs text-slate-500">Duration</div>
            <div className="font-semibold text-slate-900">
              {formatTime(deal.startAt)} - {formatTime(deal.endAt)}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <Star className="w-5 h-5 text-yellow-400 fill-current mb-2" />
            <div className="text-xs text-slate-500">Rating</div>
            <div className="font-semibold text-slate-900">{deal.venue.rating.toFixed(1)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deal.venue.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-200 hover:border-orange-500 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Get Directions</div>
                <div className="text-sm text-slate-500">{deal.venue.address}</div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white rounded-xl p-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <QrCode className="w-6 h-6" />
              <span>Claim & Redeem Deal</span>
            </div>
          </motion.button>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-slate-900">How It Works</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>Click "Claim & Redeem Deal" to save to your wallet</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>Visit the restaurant during the valid time window</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>Show your QR code at checkout to get the discount</p>
            </div>
          </div>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
}

export default function DealViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 flex items-center justify-center">
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
          <p className="text-slate-600">Loading deal...</p>
        </motion.div>
      </div>
    }>
      <DealDetailContent />
    </Suspense>
  );
}
