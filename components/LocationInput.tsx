'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import FormField from './FormField';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function LocationInput({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = ''
}: LocationInputProps) {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsRequestingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get location name
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          const locationName = `${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision || data.countryName || 'Unknown'}`;
          onChange(locationName);
        } else {
          // Fallback to coordinates
          onChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (geocodeError) {
        // Fallback to coordinates
        onChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error: any) {
      console.error('Location error:', error);
      setLocationError('Unable to get your location. Please enter it manually.');
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleFocus = () => {
    // Request location permission when user focuses on the field
    if (!value && !isRequestingLocation) {
      requestLocation();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <FormField
        ref={inputRef}
        label="Location (Optional)"
        id="location"
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={handleFocus}
        placeholder="Enter your city, state or use current location"
        error={error}
        helperText="We'll use this to show you nearby deals"
        disabled={disabled}
        autoComplete="address-level1"
      />
      
      {/* Location Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={requestLocation}
          disabled={disabled || isRequestingLocation}
          className="flex items-center space-x-2 text-sm text-amber-600 hover:text-amber-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          aria-label="Use current location"
        >
          {isRequestingLocation ? (
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>
            {isRequestingLocation ? 'Getting location...' : 'Use current location'}
          </span>
        </button>
        
        {locationError && (
          <div className="flex items-center space-x-1 text-sm text-amber-600">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{locationError}</span>
          </div>
        )}
      </div>
      
      {/* Privacy Notice */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Privacy:</strong> Location data is only used to show nearby deals and is not stored or shared.
        </p>
      </div>
    </div>
  );
}
