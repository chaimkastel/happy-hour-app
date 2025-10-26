'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Heart, Share2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import BottomNav from '@/components/navigation/BottomNav';
import QRScanner from '@/components/redeem/QRScanner';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showFinePrint, setShowFinePrint] = useState(false);
  const [partySize, setPartySize] = useState(2);

  useEffect(() => {
    loadDeal();
  }, [dealId]);

  const loadDeal = async () => {
    try {
      const response = await fetch(`/api/deals/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setDeal(data);
      }
    } catch (error) {
      console.error('Error loading deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = () => {
    setShowScanner(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gray-200 h-96 animate-pulse" />
        <div className="px-4 py-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Deal not found</p>
          <Button onClick={() => router.push('/explore')} className="mt-4">
            Browse Deals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        {/* Hero Image */}
        <div className="relative h-96 bg-gray-200">
          <Image
            src={deal.venue?.photos ? JSON.parse(deal.venue.photos)[0] : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'}
            alt={deal.title}
            fill
            className="object-cover"
          />
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            ←
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-6 max-w-3xl mx-auto">
          {/* Key Info Line */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <p className="text-center text-gray-900 font-semibold">
              {deal.percentOff}% off • dine-in • {new Date(deal.startAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}–{new Date(deal.endAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} • 2 pax max
            </p>
          </div>

          {/* Title & Location */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{deal.venue?.name || 'Restaurant'}</h1>
          <p className="text-lg text-gray-600 mb-4">{deal.title}</p>
          <p className="text-gray-700 mb-6">{deal.description}</p>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{deal.venue?.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Valid {new Date(deal.startAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Why It's a Great Deal */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Why It's a Great Deal</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Save {deal.percentOff}% on your meal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">No booking required - walk in anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Instant confirmation via QR code</span>
              </li>
            </ul>
          </div>

          {/* Fine Print */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
            <button
              onClick={() => setShowFinePrint(!showFinePrint)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Fine Print</h3>
              {showFinePrint ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showFinePrint && (
              <div className="px-4 pb-4 text-sm text-gray-600">
                <p>• Valid for dine-in only</p>
                <p>• Cannot be combined with other offers</p>
                <p>• Subject to availability</p>
                <p>• Expires {new Date(deal.endAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* How to Redeem */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">How to Redeem</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Claim this deal</p>
                  <p className="text-sm text-gray-600">Click "Redeem Now" below</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Show QR code</p>
                  <p className="text-sm text-gray-600">Present to staff at the restaurant</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Enjoy & Save</p>
                  <p className="text-sm text-gray-600">Your discount is applied automatically</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRedeem}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 text-lg"
            >
              Redeem Now
            </Button>
            <Button
              variant="outline"
              className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-4"
            >
              <Heart className="w-5 h-5 mr-2 inline" />
              Save for Later
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
            >
              <Share2 className="w-5 h-5 mr-2 inline" />
              Share Deal
            </Button>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          dealId={dealId}
          onSuccess={() => {
            setShowScanner(false);
            router.push('/wallet');
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      <BottomNav />
    </>
  );
}

