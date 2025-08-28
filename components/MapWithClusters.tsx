'use client'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-blue-600 dark:text-blue-300">Loading map...</p>
    </div>
  )
});

interface Deal {
  id: string
  venue: {
    latitude: number
    longitude: number
    name: string
  }
  title?: string
  discount?: number
  percentOff?: number
}

interface MapWithClustersProps {
  deals: Deal[]
  userLocation?: { lat: number; lng: number } | null
}

export default function MapWithClusters({ deals, userLocation }: MapWithClustersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (deals.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            No Deals Available
          </h3>
          <p className="text-blue-600 dark:text-blue-300">
            Check back later for new deals in your area
          </p>
        </div>
      </div>
    );
  }

  // Calculate center point
  const center = userLocation || { 
    lat: deals[0].venue.latitude, 
    lng: deals[0].venue.longitude 
  };

  // Only render the map on the client side
  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-blue-600 dark:text-blue-300">Loading map...</p>
      </div>
    );
  }

  return <MapComponent deals={deals} center={center} />;
}
