'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, ArrowLeft, Heart, Share2, Calendar, Users, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Deal {
  id: string;
  type: 'HAPPY_HOUR' | 'INSTANT';
  title: string;
  description: string;
  percentOff?: number;
  originalPrice?: number;
  discountedPrice?: number;
  startsAt: string;
  endsAt: string;
  daysOfWeek: string[];
  timeWindows: Array<{ start: string; end: string }>;
  conditions: string[];
  maxRedemptions?: number;
  perUserLimit: number;
  priority: number;
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    rating?: number;
    photos: string[];
    timezone: string;
  };
  redemptionCount: number;
}

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchDeal();
    }
  }, [params.id]);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/deals/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDeal(data.deal);
      } else {
        setError('Deal not found');
      }
    } catch (error) {
      console.error('Error fetching deal:', error);
      setError('Failed to load deal');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDeal = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      setClaiming(true);
      setError(null);
      
      const response = await fetch(`/api/deals/${params.id}/claim`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Deal claimed successfully!');
        // Redirect to claim success page
        router.push(`/claim-success?code=${data.voucher.code}`);
      } else {
        setError(data.error || 'Failed to claim deal');
      }
    } catch (error) {
      console.error('Error claiming deal:', error);
      setError('Failed to claim deal');
    } finally {
      setClaiming(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const formatTimeWindow = (window: { start: string; end: string }) => {
    const start = new Date(`2000-01-01T${window.start}`);
    const end = new Date(`2000-01-01T${window.end}`);
    
    return `${start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })} - ${end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })}`;
  };

  const formatDaysOfWeek = (days: string[]) => {
    const dayMap: { [key: string]: string } = {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
    };
    
    return days.map(day => dayMap[day] || day).join(', ');
  };

  const isDealActive = () => {
    if (!deal) return false;
    const now = new Date();
    const start = new Date(deal.startsAt);
    const end = new Date(deal.endsAt);
    return now >= start && now <= end;
  };

  const canClaim = () => {
    if (!deal || !session) return false;
    return isDealActive() && deal.redemptionCount < (deal.maxRedemptions || Infinity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This deal may have expired or been removed.'}</p>
          <Link href="/explore">
            <Button>Browse Other Deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Deal Details</h1>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/explore" className="hover:text-orange-600 transition-colors">
              Explore
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{deal.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
              <Image
                src={deal.venue.photos[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'}
                alt={deal.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  deal.type === 'HAPPY_HOUR'
                    ? 'bg-orange-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {deal.type === 'HAPPY_HOUR' ? 'Happy Hour' : 'Instant Deal'}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="sm" variant="ghost" className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Deal Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{deal.title}</h1>
                    <p className="text-xl text-gray-600 font-medium mb-4">{deal.venue.name}</p>
                    <div className="flex items-center space-x-6 text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        {deal.venue.address}, {deal.venue.city}, {deal.venue.state}
                      </span>
                      {deal.venue.rating && (
                        <span className="flex items-center">
                          <Star className="w-5 h-5 mr-1 fill-current text-yellow-400" />
                          {deal.venue.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {deal.discountedPrice && (
                      <div className="text-3xl font-bold text-orange-500 mb-1">
                        ${formatPrice(deal.discountedPrice)}
                      </div>
                    )}
                    {deal.originalPrice && deal.discountedPrice && (
                      <div className="text-lg text-gray-400 line-through">
                        ${formatPrice(deal.originalPrice)}
                      </div>
                    )}
                    {deal.percentOff && (
                      <div className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full mt-2">
                        {deal.percentOff}% OFF
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">{deal.description}</p>

                {/* Time Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    When Available
                  </h3>
                  
                  {deal.type === 'HAPPY_HOUR' ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDaysOfWeek(deal.daysOfWeek)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {deal.timeWindows.map((window, i) => (
                          <div key={i}>{formatTimeWindow(window)}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Available anytime between{' '}
                      {new Date(deal.startsAt).toLocaleDateString()} and{' '}
                      {new Date(deal.endsAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Conditions */}
                {deal.conditions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                    <ul className="space-y-2">
                      {deal.conditions.map((condition, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Redemption Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-blue-800">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      {deal.redemptionCount} claimed
                      {deal.maxRedemptions && ` of ${deal.maxRedemptions} available`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Claim Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Claim?</h2>
                  <p className="text-gray-600 text-sm">
                    Get your voucher and start saving today!
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-800 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800 text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {success}
                    </div>
                  </div>
                )}

                {!isDealActive() && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-yellow-800 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      This deal is not currently active
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleClaimDeal}
                  disabled={!canClaim() || claiming}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming ? 'Claiming...' : 'Claim Deal'}
                </Button>

                {!session && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    <Link href="/login" className="text-orange-500 hover:text-orange-600">
                      Sign in
                    </Link>{' '}
                    to claim this deal
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Venue Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Restaurant Info</h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">{deal.venue.name}</div>
                    <div className="text-sm text-gray-600">{deal.venue.address}</div>
                    <div className="text-sm text-gray-600">
                      {deal.venue.city}, {deal.venue.state} {deal.venue.zip}
                    </div>
                  </div>
                  {deal.venue.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{deal.venue.rating}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}