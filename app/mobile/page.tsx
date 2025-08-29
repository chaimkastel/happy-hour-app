'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Heart, Star, Clock, Users } from 'lucide-react';

// Simple mobile header component
const MobileHeader = () => (
  <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 md:hidden">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">🍺</span>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Happy Hour</h1>
          <p className="text-xs text-gray-600">Find amazing deals</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button type="button" className="p-2 text-gray-600 hover:text-gray-900">
          <Search className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 text-gray-600 hover:text-gray-900">
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

// Simple deal card component
const DealCard = ({ deal }: { deal: any }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{deal.title}</h3>
        <p className="text-xs text-gray-600 mb-2">{deal.description}</p>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {deal.venue.name}
          </span>
          <span>•</span>
          <span>{deal.distance}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {deal.percentOff}% OFF
        </div>
        <div className="flex items-center mt-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs text-gray-600 ml-1">{deal.rating}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{deal.isOpen ? 'Open Now' : 'Closed'}</span>
      </div>
      <button 
        type="button"
        className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full hover:bg-orange-600"
      >
        View Deal
      </button>
    </div>
  </div>
);

// Simple bottom navigation
const MobileBottomNav = () => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
    <div className="flex items-center justify-around">
      <button type="button" className="flex flex-col items-center space-y-1 text-orange-500">
        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
          <Search className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium">Explore</span>
      </button>
      <button type="button" className="flex flex-col items-center space-y-1 text-gray-400">
        <Heart className="w-5 h-5" />
        <span className="text-xs">Favorites</span>
      </button>
      <button type="button" className="flex flex-col items-center space-y-1 text-gray-400">
        <MapPin className="w-5 h-5" />
        <span className="text-xs">Search</span>
      </button>
      <button type="button" className="flex flex-col items-center space-y-1 text-gray-400">
        <Users className="w-5 h-5" />
        <span className="text-xs">Wallet</span>
      </button>
      <button type="button" className="flex flex-col items-center space-y-1 text-gray-400">
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        <span className="text-xs">Account</span>
      </button>
    </div>
  </div>
);

// Main mobile page component
export default function MobilePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data that will always work
  const mockDeals = [
    {
      id: '1',
      title: 'Happy Hour Special',
      description: '50% off all drinks and appetizers during happy hour',
      percentOff: 50,
      venue: {
        name: 'The Local Pub',
        address: '123 Main St, Downtown'
      },
      distance: '0.3 mi',
      rating: 4.5,
      isOpen: true
    },
    {
      id: '2',
      title: 'Lunch Deal',
      description: '30% off lunch entrees and sides',
      percentOff: 30,
      venue: {
        name: 'Bella Vista',
        address: '456 Oak Ave, Midtown'
      },
      distance: '0.7 mi',
      rating: 4.2,
      isOpen: true
    },
    {
      id: '3',
      title: 'Dinner Special',
      description: 'Buy one get one free on select entrees',
      percentOff: 50,
      venue: {
        name: 'Spice Garden',
        address: '789 Pine St, Uptown'
      },
      distance: '1.2 mi',
      rating: 4.8,
      isOpen: false
    },
    {
      id: '4',
      title: 'Weekend Brunch',
      description: '25% off brunch items and bottomless mimosas',
      percentOff: 25,
      venue: {
        name: 'Sunrise Cafe',
        address: '321 Elm St, Riverside'
      },
      distance: '0.9 mi',
      rating: 4.3,
      isOpen: true
    },
    {
      id: '5',
      title: 'Late Night Bites',
      description: '40% off late night menu after 10pm',
      percentOff: 40,
      venue: {
        name: 'Midnight Diner',
        address: '654 Maple Ave, Eastside'
      },
      distance: '1.5 mi',
      rating: 4.1,
      isOpen: true
    }
  ];

  useEffect(() => {
    // Simulate loading and then show mock data
    const timer = setTimeout(() => {
      setDeals(mockDeals);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 md:hidden">
        <MobileHeader />
        <div className="px-4 py-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:hidden">
      <MobileHeader />
      
      <div className="px-4 py-6 pb-20">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Nearby Deals</h2>
          <p className="text-sm text-gray-600">Great deals near you</p>
        </div>
        
        <div className="space-y-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
      
      <MobileBottomNav />
    </div>
  );
}