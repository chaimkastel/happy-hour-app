'use client';

import { useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import AddressAutocomplete, { AddressComponents } from './AddressAutocomplete';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (address: AddressComponents) => void;
  currentLocation?: string;
}

export default function LocationPicker({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  currentLocation = "Brooklyn, New York" 
}: LocationPickerProps) {
  const [isGeolocating, setIsGeolocating] = useState(false);

  const handleAddressSelect = (address: AddressComponents) => {
    onLocationSelect(address);
    onClose();
  };

  const handleGeolocate = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGeolocating(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      if (response.ok) {
        const data = await response.json();
        const address: AddressComponents = {
          street1: data.address?.house_number ? 
            `${data.address.house_number} ${data.address.road}` : 
            data.address?.road || '',
          city: data.address?.city || data.address?.town || data.address?.village || '',
          region: data.address?.state || '',
          postal_code: data.address?.postcode || '',
          country: data.address?.country_code?.toUpperCase() || 'US',
          lat: latitude,
          lng: longitude,
          formatted_address: data.display_name
        };
        onLocationSelect(address);
        onClose();
      } else {
        // Fallback: use coordinates
        const address: AddressComponents = {
          street1: '',
          city: '',
          region: '',
          postal_code: '',
          country: 'US',
          lat: latitude,
          lng: longitude,
          formatted_address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        };
        onLocationSelect(address);
        onClose();
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      alert('Unable to get your location. Please try entering your address manually.');
    } finally {
      setIsGeolocating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Choose Location</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close location picker"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Location */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Current Location</p>
                <p className="text-sm text-gray-600">{currentLocation}</p>
              </div>
            </div>
          </div>

          {/* Geolocate Button */}
          <button
            type="button"
            onClick={handleGeolocate}
            disabled={isGeolocating}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Navigation size={20} />
            {isGeolocating ? 'Getting Location...' : 'Use Current Location'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Address Search */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Search for an address
            </label>
            <AddressAutocomplete
              onSelect={handleAddressSelect}
              placeholder="Enter address, city, or zip code..."
              className="w-full"
            />
          </div>

          {/* Manual Entry Note */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> You can enter any address, city, or zip code to find deals in that area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
