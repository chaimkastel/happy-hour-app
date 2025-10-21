'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Star, Heart, Share2, Phone, Navigation, Calendar, Users, AlertCircle, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Deal {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  cuisine: string;
  venue: {
    name: string;
    address: string;
    phone: string;
    rating: number;
    distance: number;
    hours: string;
  };
  images: string[];
  timeLeft: number;
  isFavorite: boolean;
  terms: string[];
  validUntil: string;
}

export default function MobileDealDetailPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTerms, setShowTerms] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const toggleFavorite = () => {
    if (deal) {
      setDeal(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const shareDeal = () => {
    if (deal && navigator.share) {
      navigator.share({
        title: deal.title,
        text: `Check out this amazing deal: ${deal.discount}% off at ${deal.venue.name}`,
        url: window.location.href
      });
    }
  };

  const claimDeal = () => {
    window.location.href = `/mobile/redeem/${deal?.id}`;
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
        description: 'All pasta dishes half price during happy hour',
        fullDescription: 'Join us for our famous pasta night! All pasta dishes are 50% off during our happy hour. From classic spaghetti carbonara to our signature lobster ravioli, enjoy authentic Italian cuisine at unbeatable prices. This deal is valid for dine-in only and cannot be combined with other offers.',
        discount: 50,
        originalPrice: 24,
        discountedPrice: 12,
        cuisine: 'Italian',
        venue: {
          name: 'Bella Vista',
          address: '123 Main St, Brooklyn, NY 11201',
          phone: '(555) 123-4567',
          rating: 4.5,
          distance: 0.8,
          hours: 'Mon-Thu: 5PM-10PM, Fri-Sat: 5PM-11PM, Sun: 4PM-9PM'
        },
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop'
        ],
        timeLeft: 45,
        isFavorite: false,
        terms: [
          'Valid for dine-in only',
          'Cannot be combined with other offers',
          'Valid during happy hour: 5PM-7PM',
          'One deal per person per visit',
          'Subject to availability',
          'Restaurant reserves the right to modify or cancel this offer'
        ],
        validUntil: '2025-01-15'
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal...</p>
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
              <span className="text-gray-900 font-bold text-lg">Deal Details</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  deal.isFavorite 
                    ? 'bg-red-100 text-red-500' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${deal.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareDeal}
                className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <Image
          src={deal.images[currentImageIndex]}
          alt={deal.title}
          width={400}
          height={256}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {deal.discount}% OFF
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {deal.timeLeft}m left
          </div>
        </div>
        
        {/* Image dots */}
        {deal.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {deal.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Deal Info */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h1>
          <p className="text-gray-600 mb-4">{deal.fullDescription}</p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">${deal.discountedPrice}</div>
              <div className="text-sm text-gray-500">After discount</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-400 line-through">${deal.originalPrice}</div>
              <div className="text-sm text-gray-500">Original price</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">Save ${deal.originalPrice - deal.discountedPrice}</div>
              <div className="text-sm text-gray-500">You save</div>
            </div>
          </div>

          <button
            onClick={claimDeal}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all duration-300"
          >
            Claim This Deal
          </button>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Info</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">{deal.venue.name}</h3>
              <p className="text-gray-600">{deal.venue.address}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold">{deal.venue.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{deal.venue.distance} mi away</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{deal.venue.hours}</span>
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
                <Navigation className="w-4 h-4" />
                Directions
              </button>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-bold text-gray-900">Terms & Conditions</h2>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              showTerms ? 'rotate-180' : ''
            }`} />
          </button>
          
          {showTerms && (
            <div className="mt-4 space-y-2">
              {deal.terms.map((term, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">{term}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
