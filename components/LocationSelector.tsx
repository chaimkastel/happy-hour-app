'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Crosshair, Loader2, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { AddressData } from '@/types/address';
import { parseGooglePlaceResult, validateAddressData, debounce } from '@/lib/address-validation';

interface LocationSelectorProps {
  value: string;
  onChange: (address: AddressData) => void;
  onMyLocationClick: () => void;
  isResolvingLocation?: boolean;
  className?: string;
  placeholder?: string;
}

interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function LocationSelector({
  value,
  onChange,
  onMyLocationClick,
  isResolvingLocation = false,
  className = "",
  placeholder = "Search for a location..."
}: LocationSelectorProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 3) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/address/autocomplete?query=${encodeURIComponent(query)}`,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'OK') {
          setSuggestions(data.predictions);
          setIsOpen(true);
          setError(null);
        } else {
          setSuggestions([]);
          setIsOpen(false);
          setError('Unable to find locations. Please try again.');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Location search error:', err);
          setError('Failed to load location suggestions. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    setError(null);
    setIsValid(false);
    
    if (newValue.trim()) {
      debouncedSearch(newValue);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: LocationSuggestion) => {
    setInputValue(suggestion.description);
    setIsOpen(false);
    setSelectedIndex(-1);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/address/details?place_id=${suggestion.place_id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const placeDetails = await response.json();
      const addressData = parseGooglePlaceResult(placeDetails);
      const validation = validateAddressData(addressData);

      if (validation.isValid) {
        setIsValid(true);
        setError(null);
        onChange(addressData);
      } else {
        setError(validation.errors.join(', '));
      }
    } catch (err: any) {
      console.error('Location details error:', err);
      setError('Failed to load location details. Please try again.');
    } finally {
      setIsLoading(false);
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
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      {/* Location Input Field */}
      <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-slate-900/30">
        <div className="w-8 h-8 bg-white/20 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30 dark:border-slate-600/40 shadow-md">
          <MapPin className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1 tracking-wide uppercase">Location</p>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              placeholder={placeholder}
              className={`
                w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400
                ${error ? 'text-red-600 dark:text-red-400' : ''}
              `}
              aria-label="Location input with autocomplete"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              role="combobox"
              aria-describedby={error ? "location-error" : undefined}
            />
            
            {/* Loading/Status Icons */}
            <div className="absolute right-0 top-0 h-full flex items-center">
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-slate-500 dark:text-slate-400 animate-spin" />
              ) : error ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : null}
            </div>
          </div>
        </div>
        
        <button
          onClick={onMyLocationClick}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 backdrop-blur-sm border ${
            isResolvingLocation 
              ? 'bg-slate-200/50 text-slate-600 cursor-not-allowed border-slate-300/50' 
              : 'bg-white/20 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/60 border-white/30 dark:border-slate-600/40 hover:shadow-lg hover:scale-105'
          }`}
          title="Use my location"
          aria-label="Use my current location"
          disabled={isResolvingLocation}
        >
          <Crosshair className="w-4 h-4" />
          {isResolvingLocation ? 'Locating…' : 'My Location'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p id="location-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-2xl max-h-60 overflow-auto"
          role="listbox"
          aria-label="Location suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.place_id}
              className={`
                px-5 py-4 cursor-pointer border-b border-white/20 dark:border-slate-700/30 last:border-b-0 transition-all duration-200
                hover:bg-white/20 dark:hover:bg-slate-800/30 focus:bg-white/20 dark:focus:bg-slate-800/30
                ${selectedIndex === index ? 'bg-white/20 dark:bg-slate-800/30' : ''}
              `}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={selectedIndex === index}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30 dark:border-slate-600/40">
                  <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Screen Reader Instructions */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading && "Loading location suggestions..."}
        {suggestions.length > 0 && !isLoading && 
          `${suggestions.length} location suggestions available. Use arrow keys to navigate, Enter to select, Escape to close.`
        }
        {error && `Error: ${error}`}
      </div>
    </div>
  );
}
