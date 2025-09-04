'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount?: number;
  percentOff?: number;
  venue: {
    name: string;
    address: string;
    cuisine?: string;
    businessType?: string;
    rating?: number;
    distance?: string;
    latitude?: number;
    longitude?: number;
  };
  image?: string;
  isOpen?: boolean;
  endTime?: string;
  originalPrice?: number;
  discountedPrice?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface MapViewProps {
  deals: Deal[];
  onDealSelect?: (deal: Deal) => void;
  className?: string;
}

export default function MapView({ deals, onDealSelect, className = '' }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Default location (Downtown)
  const defaultLocation = { lat: 40.7128, lng: -74.0060 };

  // Request user location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError('Unable to get your location. Using default location.');
        setUserLocation(defaultLocation);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (mapRef.current && !mapRef.current.innerHTML) {
      // Initialize map with default location
      setUserLocation(defaultLocation);
    }
  }, []);

  // Generate mock coordinates for deals if not provided
  const dealsWithCoordinates = deals.map((deal, index) => ({
    ...deal,
    coordinates: deal.coordinates || {
      lat: deal.venue.latitude || defaultLocation.lat + (Math.random() - 0.5) * 0.02,
      lng: deal.venue.longitude || defaultLocation.lng + (Math.random() - 0.5) * 0.02
    }
  }));

  return (
    <div className={`relative ${className}`}>
      {/* Location Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={requestLocation}
          disabled={isLoadingLocation}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Use current location"
        >
          {isLoadingLocation ? (
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-amber-600" />
          )}
          <span className="text-sm font-medium">My Location</span>
        </button>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden"
        role="img"
        aria-label="Map showing restaurant deals"
      >
        {/* Mock Map Content */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
            <p className="text-sm mb-4">
              {userLocation ? 'Showing deals near your location' : 'Click "My Location" to see nearby deals'}
            </p>
            {locationError && (
              <div className="flex items-center justify-center space-x-2 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{locationError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Deal Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {dealsWithCoordinates.map((deal, index) => (
            <button
              key={deal.id}
              onClick={() => onDealSelect?.(deal)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${30 + (index * 20) % 40}%`
              }}
              aria-label={`Deal: ${deal.percentOff || deal.discount || 0}% off at ${deal.venue.name}`}
            >
              <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-amber-700 transition-colors">
                <span className="text-xs font-bold">{deal.percentOff || deal.discount || 0}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deal List */}
      <div className="mt-4 space-y-2">
        <h4 className="font-semibold text-gray-900">Deals on Map ({deals.length})</h4>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {dealsWithCoordinates.map((deal) => (
            <div
              key={deal.id}
              onClick={() => onDealSelect?.(deal)}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
            >
              <img
                src={deal.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop&crop=center&auto=format&q=80'}
                alt={deal.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 truncate">{deal.title}</h5>
                <p className="text-sm text-gray-600 truncate">{deal.venue.name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{deal.venue.distance || '0.5 mi'}</span>
                  <span>•</span>
                  <span>{deal.venue.rating || 4.0}★</span>
                  <span>•</span>
                  <span className="text-amber-600 font-medium">{deal.percentOff || deal.discount || 0}% off</span>
                </div>
              </div>
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Privacy:</strong> Location data is only used to show nearby deals and is not stored or shared.
        </p>
      </div>
    </div>
  );
}
}

interface MapViewProps {
  deals: Deal[];
  onDealSelect?: (deal: Deal) => void;
  className?: string;
}

export default function MapView({ deals, onDealSelect, className = '' }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Default location (Downtown)
  const defaultLocation = { lat: 40.7128, lng: -74.0060 };

  // Request user location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError('Unable to get your location. Using default location.');
        setUserLocation(defaultLocation);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (mapRef.current && !mapRef.current.innerHTML) {
      // Initialize map with default location
      setUserLocation(defaultLocation);
    }
  }, []);

  // Generate mock coordinates for deals if not provided
  const dealsWithCoordinates = deals.map((deal, index) => ({
    ...deal,
    coordinates: deal.coordinates || {
      lat: deal.venue.latitude || defaultLocation.lat + (Math.random() - 0.5) * 0.02,
      lng: deal.venue.longitude || defaultLocation.lng + (Math.random() - 0.5) * 0.02
    }
  }));

  return (
    <div className={`relative ${className}`}>
      {/* Location Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={requestLocation}
          disabled={isLoadingLocation}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Use current location"
        >
          {isLoadingLocation ? (
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-amber-600" />
          )}
          <span className="text-sm font-medium">My Location</span>
        </button>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-96 bg-gray-100 rounded-lg relative overflow-hidden"
        role="img"
        aria-label="Map showing restaurant deals"
      >
        {/* Mock Map Content */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
            <p className="text-sm mb-4">
              {userLocation ? 'Showing deals near your location' : 'Click "My Location" to see nearby deals'}
            </p>
            {locationError && (
              <div className="flex items-center justify-center space-x-2 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{locationError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Deal Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {dealsWithCoordinates.map((deal, index) => (
            <button
              key={deal.id}
              onClick={() => onDealSelect?.(deal)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${30 + (index * 20) % 40}%`
              }}
              aria-label={`Deal: ${deal.percentOff || deal.discount || 0}% off at ${deal.venue.name}`}
            >
              <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-amber-700 transition-colors">
                <span className="text-xs font-bold">{deal.percentOff || deal.discount || 0}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Deal List */}
      <div className="mt-4 space-y-2">
        <h4 className="font-semibold text-gray-900">Deals on Map ({deals.length})</h4>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {dealsWithCoordinates.map((deal) => (
            <div
              key={deal.id}
              onClick={() => onDealSelect?.(deal)}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
            >
              <img
                src={deal.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop&crop=center&auto=format&q=80'}
                alt={deal.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 truncate">{deal.title}</h5>
                <p className="text-sm text-gray-600 truncate">{deal.venue.name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{deal.venue.distance || '0.5 mi'}</span>
                  <span>•</span>
                  <span>{deal.venue.rating || 4.0}★</span>
                  <span>•</span>
                  <span className="text-amber-600 font-medium">{deal.percentOff || deal.discount || 0}% off</span>
                </div>
              </div>
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Privacy:</strong> Location data is only used to show nearby deals and is not stored or shared.
        </p>
      </div>
    </div>
  );
}