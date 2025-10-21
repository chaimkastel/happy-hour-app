'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import MobileShell from '@/components/mobile/MobileShell';
import DealCard from '@/components/mobile/DealCard';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  venue: {
    name: string;
    address: string;
  };
  distance: string;
  rating: number;
  isOpen: boolean;
  category: string;
  imageUrl?: string;
  validUntil?: string;
}

// No mock data - fetch from API
const recentSearches: string[] = [];
const trendingCuisines = ['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean'];

export default function MobileSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Deal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowSuggestions(true);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);

    // Search API call
    const searchDeals = async () => {
      try {
        const response = await fetch(`/api/deals/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.deals || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error searching deals:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchDeals();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      handleSearch(value);
    } else {
      setResults([]);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowSuggestions(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleViewDeal = (dealId: string) => {
    window.location.href = `/deal/${dealId}`;
  };

  return (
    <MobileShell
      headerProps={{
        title: 'Search',
        rightElement: (
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-blue-500 font-medium"
          >
            Cancel
          </button>
        )
      }}
    >
      <div className="p-4 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for deals, restaurants, cuisines..."
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <X size={20} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {!showSuggestions && (
          <div>
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {results.length} results for "{query}"
                </h3>
                <div className="space-y-4">
                  {results.map((deal) => (
                    <DealCard 
                      key={deal.id} 
                      deal={deal} 
                      onView={handleViewDeal}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try searching for "sushi", "tacos", or "happy hour"
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(search)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Cuisines */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Trending Cuisines</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingCuisines.map((cuisine, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(cuisine)}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Search Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Try "happy hour" for drink specials</li>
                <li>• Search by cuisine: "sushi", "pizza", "tacos"</li>
                <li>• Look for specific deals: "50% off", "buy one get one"</li>
                <li>• Search by restaurant name</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}