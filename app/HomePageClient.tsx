'use client';

import { useState } from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

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
  };
}

interface HomePageClientProps {
  initialDeals: Deal[];
}

export default function HomePageClient({ initialDeals }: HomePageClientProps) {
  const [deals] = useState<Deal[]>(initialDeals);

  const getTimeRemaining = (endAt: string) => {
    const now = new Date();
    const end = new Date(endAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Less than 1h left';
  };

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <MapPin className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No deals available</h3>
        <p className="text-gray-600 mb-6">
          Check back later for new restaurant deals in your area.
        </p>
        <Link
          href="/explore"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Browse All Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal) => (
        <div
          key={deal.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {deal.venue.name}
              </p>
              <p className="text-sm text-gray-500">
                {deal.venue.address}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {deal.percentOff}% OFF
              </div>
              {deal.minSpend && (
                <div className="text-xs text-gray-500">
                  Min spend: ${deal.minSpend}
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-2">
            {deal.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                {deal.venue.rating.toFixed(1)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {getTimeRemaining(deal.endAt)}
              </div>
            </div>
            <div>
              {deal.redeemedCount}/{deal.maxRedemptions} claimed
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href={`/deal/${deal.id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              View Deal
            </Link>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
