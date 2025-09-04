'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onLocationChange?: (location: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

interface SearchFilters {
  cuisine?: string;
  distance?: number;
  priceRange?: string;
  rating?: number;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'cuisine' | 'location' | 'restaurant';
}

export default function SearchBar({ 
  onSearch, 
  onLocationChange,
  placeholder = "Search restaurants, cuisines, or deals...",
  className = "",
  showSuggestions = true
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('Downtown');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Static suggestions for better UX
  const staticSuggestions: SearchSuggestion[] = [
    { id: 'pizza', text: 'Pizza', type: 'cuisine' },
    { id: 'sushi', text: 'Sushi', type: 'cuisine' },
    { id: 'italian', text: 'Italian', type: 'cuisine' },
    { id: 'mexican', text: 'Mexican', type: 'cuisine' },
    { id: 'chinese', text: 'Chinese', type: 'cuisine' },
    { id: 'happy-hour', text: 'Happy Hour', type: 'cuisine' },
    { id: 'brunch', text: 'Brunch', type: 'cuisine' },
    { id: 'cocktails', text: 'Cocktails', type: 'cuisine' },
  ];

  // Handle search input changes
  const handleInputChange = async (value: string) => {
    setQuery(value);
    
    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestionsList(false);
      return;
    }

    if (showSuggestions) {
      // Filter static suggestions
      const filteredSuggestions = staticSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestionsList(true);
    }
  };

  // Handle search submission
  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setShowSuggestionsList(false);

    try {
      // Call the search API
      const response = await fetch('/api/deals/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          location: location,
          limit: 20
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSearch(searchQuery, {});
      } else {
        console.error('Search failed:', response.statusText);
        // Fallback to local search or show error
        onSearch(searchQuery, {});
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      onSearch(searchQuery, {});
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestionsList(false);
    handleSearch(suggestion.text);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestionsList(false);
    }
  };

  // Handle location permission
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Reverse geocode to get location name
          const { latitude, longitude } = position.coords;
          // You can implement reverse geocoding here
          setLocation('Current Location');
          onLocationChange?.('Current Location');
        },
        (error) => {
          console.error('Location error:', error);
          // Fallback to default location
        }
      );
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search for restaurants, cuisines or deals
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setShowSuggestionsList(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
            aria-label="Search for restaurants, cuisines or deals"
            aria-describedby="search-help"
            aria-expanded={showSuggestionsList}
            aria-haspopup="listbox"
            role="combobox"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setShowSuggestionsList(false);
                onSearch('');
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Location Button */}
        <button
          onClick={requestLocation}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-sm text-gray-600 hover:text-amber-600 transition-colors"
          aria-label="Use current location"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{location}</span>
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestionsList && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
              role="option"
              aria-selected="false"
            >
              <div className="flex items-center space-x-3">
                <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span className="text-gray-900">{suggestion.text}</span>
                <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
        </div>
      )}

      <p id="search-help" className="sr-only">
        Search for restaurants, cuisines, or deals near you. Use the location button to search near your current location.
      </p>
    </div>
  );
}


import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onLocationChange?: (location: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

interface SearchFilters {
  cuisine?: string;
  distance?: number;
  priceRange?: string;
  rating?: number;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'cuisine' | 'location' | 'restaurant';
}

export default function SearchBar({ 
  onSearch, 
  onLocationChange,
  placeholder = "Search restaurants, cuisines, or deals...",
  className = "",
  showSuggestions = true
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('Downtown');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Static suggestions for better UX
  const staticSuggestions: SearchSuggestion[] = [
    { id: 'pizza', text: 'Pizza', type: 'cuisine' },
    { id: 'sushi', text: 'Sushi', type: 'cuisine' },
    { id: 'italian', text: 'Italian', type: 'cuisine' },
    { id: 'mexican', text: 'Mexican', type: 'cuisine' },
    { id: 'chinese', text: 'Chinese', type: 'cuisine' },
    { id: 'happy-hour', text: 'Happy Hour', type: 'cuisine' },
    { id: 'brunch', text: 'Brunch', type: 'cuisine' },
    { id: 'cocktails', text: 'Cocktails', type: 'cuisine' },
  ];

  // Handle search input changes
  const handleInputChange = async (value: string) => {
    setQuery(value);
    
    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestionsList(false);
      return;
    }

    if (showSuggestions) {
      // Filter static suggestions
      const filteredSuggestions = staticSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestionsList(true);
    }
  };

  // Handle search submission
  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setShowSuggestionsList(false);

    try {
      // Call the search API
      const response = await fetch('/api/deals/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: searchQuery,
          location: location,
          limit: 20
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSearch(searchQuery, {});
      } else {
        console.error('Search failed:', response.statusText);
        // Fallback to local search or show error
        onSearch(searchQuery, {});
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      onSearch(searchQuery, {});
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestionsList(false);
    handleSearch(suggestion.text);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestionsList(false);
    }
  };

  // Handle location permission
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Reverse geocode to get location name
          const { latitude, longitude } = position.coords;
          // You can implement reverse geocoding here
          setLocation('Current Location');
          onLocationChange?.('Current Location');
        },
        (error) => {
          console.error('Location error:', error);
          // Fallback to default location
        }
      );
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search for restaurants, cuisines or deals
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setShowSuggestionsList(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-500"
            aria-label="Search for restaurants, cuisines or deals"
            aria-describedby="search-help"
            aria-expanded={showSuggestionsList}
            aria-haspopup="listbox"
            role="combobox"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setShowSuggestionsList(false);
                onSearch('');
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Location Button */}
        <button
          onClick={requestLocation}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-sm text-gray-600 hover:text-amber-600 transition-colors"
          aria-label="Use current location"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{location}</span>
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestionsList && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
              role="option"
              aria-selected="false"
            >
              <div className="flex items-center space-x-3">
                <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span className="text-gray-900">{suggestion.text}</span>
                <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
        </div>
      )}

      <p id="search-help" className="sr-only">
        Search for restaurants, cuisines, or deals near you. Use the location button to search near your current location.
      </p>
    </div>
  );
}
