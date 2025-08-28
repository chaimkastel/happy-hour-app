'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock, Star, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  id: string;
  type: 'deal' | 'restaurant' | 'category' | 'location';
  title: string;
  subtitle: string;
  icon: string;
  popularity?: number;
  distance?: string;
  discount?: number;
}

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  // Mock AI-powered suggestions based on query
  const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
    const queryLower = searchQuery.toLowerCase();
    
    // Smart suggestions based on common patterns
    const allSuggestions: SearchSuggestion[] = [
      // Deal suggestions
      { id: '1', type: 'deal', title: 'Happy Hour Specials', subtitle: '50% off drinks at 50+ restaurants', icon: '🍺', popularity: 95, discount: 50 },
      { id: '2', type: 'deal', title: 'Lunch Deals', subtitle: 'Quick lunch specials near you', icon: '🍽️', popularity: 88, discount: 30 },
      { id: '3', type: 'deal', title: 'Weekend Brunch', subtitle: 'Bottomless mimosas & breakfast deals', icon: '🥞', popularity: 82, discount: 25 },
      
      // Restaurant suggestions
      { id: '4', type: 'restaurant', title: 'Pizza Palace', subtitle: 'Best pizza in town • 4.8★ • 0.3mi', icon: '🍕', distance: '0.3mi' },
      { id: '5', type: 'restaurant', title: 'Sushi Zen', subtitle: 'Fresh sushi & sake • 4.9★ • 0.5mi', icon: '🍣', distance: '0.5mi' },
      { id: '6', type: 'restaurant', title: 'Burger Barn', subtitle: 'Gourmet burgers • 4.7★ • 0.2mi', icon: '🍔', distance: '0.2mi' },
      
      // Category suggestions
      { id: '7', type: 'category', title: 'Italian Food', subtitle: 'Pasta, pizza & more Italian cuisine', icon: '🍝', popularity: 76 },
      { id: '8', type: 'category', title: 'Asian Fusion', subtitle: 'Chinese, Japanese, Thai & more', icon: '🥢', popularity: 71 },
      { id: '9', type: 'category', title: 'Mexican Food', subtitle: 'Tacos, burritos & authentic flavors', icon: '🌮', popularity: 68 },
      
      // Location suggestions
      { id: '10', type: 'location', title: 'Downtown District', subtitle: 'Trendy restaurants & bars', icon: '🏙️', popularity: 85 },
      { id: '11', type: 'location', title: 'Waterfront Area', subtitle: 'Scenic dining with ocean views', icon: '🌊', popularity: 79 },
      { id: '12', type: 'location', title: 'University District', subtitle: 'Student-friendly deals & eats', icon: '🎓', popularity: 73 }
    ];

    if (!searchQuery) {
      return allSuggestions.slice(0, 6); // Show top 6 when no query
    }

    // Filter and rank suggestions based on query
    const filtered = allSuggestions.filter(suggestion => 
      suggestion.title.toLowerCase().includes(queryLower) ||
      suggestion.subtitle.toLowerCase().includes(queryLower)
    );

    // Sort by relevance and popularity
    return filtered
      .sort((a, b) => {
        const aRelevance = a.title.toLowerCase().startsWith(queryLower) ? 2 : 1;
        const bRelevance = b.title.toLowerCase().startsWith(queryLower) ? 2 : 1;
        const aScore = aRelevance + (a.popularity || 0) / 100;
        const bScore = bRelevance + (b.popularity || 0) / 100;
        return bScore - aScore;
      })
      .slice(0, 8);
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for AI suggestions
    debounceRef.current = setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        const newSuggestions = generateSuggestions(newQuery);
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
        setSelectedIndex(-1);
        setIsLoading(false);
      }, 300); // Simulate AI processing time
    }, 200);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Navigate based on suggestion type
    if (suggestion.type === 'deal' || suggestion.type === 'category') {
      router.push(`/explore?search=${encodeURIComponent(suggestion.title)}`);
    } else if (suggestion.type === 'restaurant') {
      router.push(`/restaurant/${suggestion.id}`);
    } else if (suggestion.type === 'location') {
      router.push(`/explore?location=${encodeURIComponent(suggestion.title)}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

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
        } else if (query.trim()) {
          // Search with current query
          router.push(`/explore?search=${encodeURIComponent(query)}`);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/explore?search=${encodeURIComponent(query)}`);
    }
  };

  // Clear suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get suggestion icon
  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'deal':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'restaurant':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'category':
        return <Star className="w-4 h-4 text-purple-500" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search for deals, restaurants, or cuisines..."
          className="w-full pl-14 pr-16 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-900 placeholder-slate-500 text-lg font-medium shadow-xl transition-all duration-300"
        />
        
        <button
          onClick={handleSearch}
          className="absolute inset-y-0 right-0 pr-2 flex items-center"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg">
            <span className="font-semibold">Search</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* AI Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-white/30 rounded-2xl shadow-2xl max-h-96 overflow-y-auto"
        >
          {/* Top 3 Suggestions */}
          <div className="p-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors rounded-xl ${
                  index === selectedIndex ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getSuggestionIcon(suggestion)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{suggestion.icon}</span>
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {suggestion.title}
                      </div>
                      {suggestion.discount && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">
                          {suggestion.discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 truncate">
                      {suggestion.subtitle}
                    </div>
                  </div>
                  {suggestion.popularity && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <TrendingUp className="w-3 h-3" />
                      {suggestion.popularity}%
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* See More Button */}
          {suggestions.length > 3 && (
            <div className="border-t border-slate-200 p-2">
              <button
                onClick={() => {
                  setShowSuggestions(false);
                  router.push(`/explore?search=${encodeURIComponent(query)}`);
                }}
                className="w-full px-4 py-3 text-center hover:bg-slate-50 transition-colors rounded-xl flex items-center justify-center gap-2 text-indigo-600 font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                See more suggestions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
