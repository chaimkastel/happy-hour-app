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
  Calendar, 
  Users, 
  AlertCircle, 
  CheckCircle,
  ExternalLink,
  Share2,
  Heart,
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
  maxRedemptions: number;
  redeemedCount: number;
  minSpend?: number;
  inPersonOnly: boolean;
  tags: string[];
  status: string;
  isLive: boolean;
  venue: {
    id: string;
    name: string;
    address: string;
    businessType: string[];
    priceTier: string;
    rating: number;
    latitude: number;
    longitude: number;
    photos: string[];
    hours: string;
    phone?: string;
    businessName: string;
  };
  terms: string;
  createdAt: string;
  updatedAt: string;
}

function DealDetailContent() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
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
      
      const response = await fetch(`/api/deals/${dealId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Deal not found');
        } else {
          setError('Failed to load deal');
        }
        return;
      }

      const data = await response.json();
      setDeal(data);
    } catch (err) {
      console.error('Error fetching deal:', err);
      setError('Failed to load deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDeal = async () => {
    if (!deal) return;
    
    try {
      setIsClaiming(true);
      
      const response = await fetch(`/api/wallet/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId: deal.id }),
      });
      
      if (response.ok) {
        // Redirect to wallet or show success message
        router.push('/wallet?claimed=true');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to claim deal');
      }
    } catch (err) {
      console.error('Error claiming deal:', err);
      alert('Failed to claim deal. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!deal) return;
    
    try {
      const response = await fetch('/api/favorite/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId: deal.id }),
      });
      
      if (response.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const formatTimeRemaining = (endAt: string) => {
    const now = new Date();
    const end = new Date(endAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGoogleMapsUrl = (venue: Deal['venue']) => {
    const address = encodeURIComponent(venue.address);
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This deal may have expired or been removed.'}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <Link
              href="/explore"
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors inline-block"
            >
              Browse Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deal Images */}
            {deal.venue.photos.length > 0 && (
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={deal.venue.photos[0]}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Deal Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{deal.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {deal.percentOff}% OFF
                    </span>
                    {deal.isLive ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Live
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {deal.description}
                </p>
              </div>

              {/* Deal Details */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Deal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Valid Until</div>
                      <div className="text-sm">{formatDate(deal.endAt)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Time Remaining</div>
                      <div className="text-sm">{formatTimeRemaining(deal.endAt)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">Redemptions</div>
                      <div className="text-sm">
                        {deal.redeemedCount} / {deal.maxRedemptions} claimed
                      </div>
                    </div>
                  </div>
                  
                  {deal.minSpend && (
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-3 text-gray-400">$</div>
                      <div>
                        <div className="font-medium">Minimum Spend</div>
                        <div className="text-sm">${deal.minSpend}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {deal.tags.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-900 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {deal.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                <p className="text-gray-700 leading-relaxed">{deal.terms}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Venue Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Info</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{deal.venue.name}</h4>
                  <p className="text-sm text-gray-600">{deal.venue.businessName}</p>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm">{deal.venue.address}</div>
                    <a
                      href={getGoogleMapsUrl(deal.venue)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 text-sm flex items-center mt-1"
                    >
                      View on Google Maps
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Star className="w-5 h-5 mr-3 text-yellow-500 fill-current" />
                  <div>
                    <div className="font-medium">{deal.venue.rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                </div>
                
                {deal.venue.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <a
                      href={`tel:${deal.venue.phone}`}
                      className="text-sm hover:text-amber-600 transition-colors"
                    >
                      {deal.venue.phone}
                    </a>
                  </div>
                )}
                
                <div>
                  <div className="font-medium text-gray-900 mb-2">Business Hours</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {deal.venue.hours || 'Hours not available'}
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-2">Cuisine Type</div>
                  <div className="flex flex-wrap gap-1">
                    {deal.venue.businessType.map((type, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Deal Button */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim This Deal</h3>
              
              {deal.isLive ? (
                <button
                  onClick={handleClaimDeal}
                  disabled={isClaiming}
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClaiming ? 'Claiming...' : 'Claim Deal'}
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-gray-500 mb-2">This deal has expired</div>
                  <Link
                    href="/explore"
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Browse Available Deals
                  </Link>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Deal will be added to your wallet for easy redemption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DealViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    }>
      <DealDetailContent />
    </Suspense>
  );
}