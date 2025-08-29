'use client';

import { useState, useEffect } from 'react';
import { MapPin, Crosshair, X } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { AddressData } from '@/types/address';

interface LocationSelectorProps {
  onLocationChange?: (addressData: AddressData) => void;
  onMyLocationClick?: () => void;
  isResolvingLocation?: boolean;
  placeholder?: string;
  className?: string;
}

export default function LocationSelector({
  onLocationChange,
  onMyLocationClick,
  isResolvingLocation = false,
  placeholder = "Enter your location...",
  className = ""
}: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<AddressData | null>(null);
  const [showLocationSheet, setShowLocationSheet] = useState(false);

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem('hh:lastLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setSelectedLocation(location);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  const handleLocationSelect = (addressData: AddressData) => {
    setSelectedLocation(addressData);
    localStorage.setItem('hh:lastLocation', JSON.stringify(addressData));
    onLocationChange?.(addressData);
    setShowLocationSheet(false);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
      return;
    }
    
    onMyLocationClick?.();
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Create a basic address data object
        const addressData: AddressData = {
          formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          coordinates: { lat, lng },
          components: {
            street1: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          placeId: ''
        };
        
        handleLocationSelect(addressData);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <>
      {/* Location Pill */}
      <button
        type="button"
        onClick={() => setShowLocationSheet(true)}
        className={`flex items-center space-x-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2 hover:bg-white/25 transition-all duration-200 ${className}`}
        aria-label="Select location"
      >
        <MapPin className="w-4 h-4 text-white/80" />
        <span className="text-white text-sm font-medium truncate max-w-32">
          {selectedLocation?.formatted || 'Select location'}
        </span>
        <Crosshair className="w-4 h-4 text-white/60" />
      </button>

      {/* Location Selection Bottom Sheet */}
      {showLocationSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute bottom-0 left-0 right-0 bg-white/15 backdrop-blur-xl border-t border-white/30 rounded-t-3xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-white" />
                  <h2 className="text-white text-xl font-bold">Select Location</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocationSheet(false)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  aria-label="Close location selector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* My Location Button */}
                <button
                  type="button"
                  onClick={handleMyLocation}
                  disabled={isResolvingLocation}
                  className="w-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white py-4 px-4 rounded-xl font-semibold border border-yellow-400/30 hover:bg-gradient-to-r hover:from-yellow-400/30 hover:to-orange-500/30 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  <Crosshair className="w-5 h-5" />
                  <span>{isResolvingLocation ? 'Getting location...' : 'Use My Location'}</span>
                </button>

                {/* Divider */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-white/60 text-sm">or</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* Address Autocomplete */}
                <div className="space-y-2">
                  <label className="text-white font-medium text-sm">Enter address manually</label>
                  <AddressAutocomplete
                    value={selectedLocation?.formatted || ''}
                    onChange={handleLocationSelect}
                    placeholder={placeholder}
                    className="w-full"
                    onError={(error) => console.error('Address autocomplete error:', error)}
                  />
                </div>

                {/* Recent Locations */}
                {selectedLocation && (
                  <div className="space-y-2">
                    <label className="text-white font-medium text-sm">Current Location</label>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-white/80" />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{selectedLocation.formatted}</p>
                          <p className="text-white/60 text-xs">
                            {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
