'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, X } from 'lucide-react';

export interface AddressComponents {
  street1: string;
  street2?: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  lat: number;
  lng: number;
  formatted_address: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: AddressComponents) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

interface Suggestion {
  id: string;
  description: string;
  place_id?: string;
}

export default function AddressAutocomplete({ 
  onSelect, 
  placeholder = "Enter address...", 
  className = "",
  initialValue = ""
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const searchAddresses = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Try Google Places API first if available
      if (process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY) {
        const response = await fetch(`/api/address/autocomplete?query=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.predictions || []);
          return;
        }
      }

      // Fallback to Nominatim (OpenStreetMap)
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
      );
      
      if (nominatimResponse.ok) {
        const data = await nominatimResponse.json();
        const formattedSuggestions = data.map((item: any, index: number) => ({
          id: `nominatim-${index}`,
          description: item.display_name,
          place_id: item.place_id,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address_components: item.address
        }));
        setSuggestions(formattedSuggestions);
      }
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      searchAddresses(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: Suggestion) => {
    setQuery(suggestion.description);
    setIsOpen(false);
    setSelectedIndex(-1);

    try {
      // Get detailed address information
      const response = await fetch(`/api/address/details?place_id=${suggestion.place_id || suggestion.id}`);
      if (response.ok) {
        const addressData = await response.json();
        onSelect(addressData);
      } else {
        // Fallback: create basic address structure
        const basicAddress: AddressComponents = {
          street1: suggestion.description.split(',')[0] || '',
          city: suggestion.description.split(',')[1]?.trim() || '',
          region: suggestion.description.split(',')[2]?.trim() || '',
          postal_code: '',
          country: 'US',
          lat: 0,
          lng: 0,
          formatted_address: suggestion.description
        };
        onSelect(basicAddress);
      }
    } catch (error) {
      console.error('Error getting address details:', error);
      // Still call onSelect with basic data
      const basicAddress: AddressComponents = {
        street1: suggestion.description.split(',')[0] || '',
        city: suggestion.description.split(',')[1]?.trim() || '',
        region: suggestion.description.split(',')[2]?.trim() || '',
        postal_code: '',
        country: 'US',
        lat: 0,
        lng: 0,
        formatted_address: suggestion.description
      };
      onSelect(basicAddress);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle manual entry (fallback)
  const handleManualEntry = () => {
    if (query.trim()) {
      const manualAddress: AddressComponents = {
        street1: query.trim(),
        city: '',
        region: '',
        postal_code: '',
        country: 'US',
        lat: 0,
        lng: 0,
        formatted_address: query.trim()
      };
      onSelect(manualAddress);
      setIsOpen(false);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          aria-label="Address search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear address"
          >
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Searching addresses...
            </div>
          ) : suggestions.length > 0 ? (
            <ul role="listbox" className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 ${
                    index === selectedIndex 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'hover:bg-gray-50 text-gray-900'
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm truncate">{suggestion.description}</span>
                </li>
              ))}
            </ul>
          ) : query.length >= 3 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm mb-2">No addresses found</p>
              <button
                type="button"
                onClick={handleManualEntry}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Use "{query}" as address
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
