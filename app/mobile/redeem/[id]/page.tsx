'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, Clock, MapPin, Phone, CheckCircle, AlertCircle, Copy, Share2 } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  discount: number;
  venue: {
    name: string;
    address: string;
    phone: string;
  };
  code: string;
  expiresAt: string;
  timeLeft: number;
}

export default function MobileRedeemPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleBack = () => {
    window.history.back();
  };

  const copyCode = async () => {
    if (deal) {
      try {
        await navigator.clipboard.writeText(deal.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  const shareDeal = () => {
    if (deal && navigator.share) {
      navigator.share({
        title: deal.title,
        text: `Check out this deal: ${deal.discount}% off at ${deal.venue.name}`,
        url: window.location.href
      });
    }
  };

  const callRestaurant = () => {
    if (deal) {
      window.location.href = `tel:${deal.venue.phone}`;
    }
  };

  const getDirections = () => {
    if (deal) {
      const address = encodeURIComponent(deal.venue.address);
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
    }
  };

  useEffect(() => {
    // Simulate loading deal data
    setTimeout(() => {
      setDeal({
        id: params.id,
        title: '50% Off Pasta Night',
        discount: 50,
        venue: {
          name: 'Bella Vista',
          address: '123 Main St, Brooklyn, NY 11201',
          phone: '(555) 123-4567'
        },
        code: 'HAPPY50',
        expiresAt: '2025-01-15T23:59:59Z',
        timeLeft: 45
      });
      setTimeLeft(45);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 60000); // Update every minute

      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading redemption...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal not found</h2>
          <p className="text-gray-600 mb-4">This deal may have expired or been removed.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">🍺</span>
              </div>
              <span className="text-gray-900 font-bold text-lg">Redeem Deal</span>
            </div>
            <button
              onClick={shareDeal}
              className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Deal Info */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h1>
            <p className="text-gray-600">{deal.venue.name}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400">Show to restaurant</p>
              </div>
            </div>
          </div>

          {/* Deal Code */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-orange-600 font-medium mb-2">Your Deal Code</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-orange-600 tracking-wider">{deal.code}</span>
                <button
                  onClick={copyCode}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    copied 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  }`}
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-orange-500 mt-2">
                {copied ? 'Code copied!' : 'Tap to copy'}
              </p>
            </div>
          </div>

          {/* Time Left */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-semibold text-gray-900">
              {timeLeft > 0 ? `${timeLeft} minutes left` : 'Expired'}
            </span>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">How to redeem:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Show this QR code or code to restaurant staff</li>
              <li>2. Order your items from the menu</li>
              <li>3. Present your code before payment</li>
              <li>4. Enjoy your discounted meal!</li>
            </ol>
          </div>

          {/* Restaurant Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Restaurant Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{deal.venue.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{deal.venue.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={callRestaurant}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button
                onClick={getDirections}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                <MapPin className="w-4 h-4" />
                Directions
              </button>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Deal must be redeemed before expiration</li>
            <li>• One deal per person per visit</li>
            <li>• Cannot be combined with other offers</li>
            <li>• Subject to restaurant availability</li>
            <li>• No refunds for unused deals</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
