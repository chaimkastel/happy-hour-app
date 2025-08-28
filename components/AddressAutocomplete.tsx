'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { AddressAutocompleteProps, AddressData, GooglePlacesResponse } from '@/types/address';
import { parseGooglePlaceResult, validateAddressData, debounce } from '@/lib/address-validation';

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter address...",
  required = false,
  disabled = false,
  className = "",
  onError,
  onLoadingChange
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
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
      onLoadingChange?.(true);

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

        const data: GooglePlacesResponse = await response.json();
        
        if (data.status === 'OK') {
          setSuggestions(data.predictions);
          setIsOpen(true);
          setError(null);
        } else {
          setSuggestions([]);
          setIsOpen(false);
          setError('Unable to find addresses. Please try again.');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Address autocomplete error:', err);
          setError('Failed to load address suggestions. Please try again.');
          onError?.(err.message);
        }
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    }, 300),
    [onError, onLoadingChange]
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
  const handleSuggestionSelect = async (suggestion: any) => {
    setInputValue(suggestion.description);
    setIsOpen(false);
    setSelectedIndex(-1);
    setIsLoading(true);
    onLoadingChange?.(true);

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
        onError?.(validation.errors.join(', '));
      }
    } catch (err: any) {
      console.error('Address details error:', err);
      setError('Failed to load address details. Please try again.');
      onError?.(err.message);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
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
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
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
          required={required}
          disabled={disabled}
          className={`
            block w-full pl-10 pr-10 py-3 border rounded-lg
            focus:ring-2 focus:ring-orange-500 focus:border-orange-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error 
              ? 'border-red-300 bg-red-50' 
              : isValid 
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-white'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-text'}
          `}
          aria-label="Address input with autocomplete"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          aria-describedby={error ? "address-error" : undefined}
        />

        {/* Loading/Status Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : error ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : isValid ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p id="address-error" className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-label="Address suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.place_id}
              className={`
                px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0
                hover:bg-orange-50 focus:bg-orange-50
                ${selectedIndex === index ? 'bg-orange-50' : ''}
              `}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={selectedIndex === index}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-500">
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
        {isLoading && "Loading address suggestions..."}
        {suggestions.length > 0 && !isLoading && 
          `${suggestions.length} address suggestions available. Use arrow keys to navigate, Enter to select, Escape to close.`
        }
        {error && `Error: ${error}`}
      </div>
    </div>
  );
}