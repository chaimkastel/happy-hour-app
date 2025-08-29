'use client';

import { useState } from 'react';
import { X, MapPin, DollarSign, Clock, Filter } from 'lucide-react';

interface FilterState {
  category: string;
  priceRange: string;
  distance: number;
  timeWindow: string;
}

interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const categories = [
  'All',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Mediterranean',
  'American',
  'French',
  'Thai',
  'Korean'
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '$', label: '$ (Under $15)' },
  { value: '$$', label: '$$ ($15-30)' },
  { value: '$$$', label: '$$$ ($30+)' }
];

const timeWindows = [
  { value: 'now', label: 'Now' },
  { value: '3-6pm', label: '3-6 PM' },
  { value: '6-9pm', label: '6-9 PM' },
  { value: '9-11pm', label: '9-11 PM' }
];

export default function FiltersBottomSheet({
  isOpen,
  onClose,
  onApply,
  initialFilters = {
    category: 'All',
    priceRange: 'all',
    distance: 5,
    timeWindow: 'now'
  }
}: FiltersBottomSheetProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      category: 'All',
      priceRange: 'all',
      distance: 5,
      timeWindow: 'now'
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute bottom-0 left-0 right-0 bg-white/15 backdrop-blur-xl border-t border-white/30 rounded-t-3xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Filter className="w-6 h-6 text-white" />
              <h2 className="text-white text-xl font-bold">Filters</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Category */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-3">Cuisine Type</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, category }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.category === category
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                        : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Price Range
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, priceRange: range.value }))}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      filters.priceRange === range.value
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border border-yellow-400/30'
                        : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Distance: {filters.distance} miles
              </h3>
              <div className="px-4">
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={filters.distance}
                  onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-white/70 text-sm mt-2">
                  <span>1 mi</span>
                  <span>25 mi</span>
                </div>
              </div>
            </div>

            {/* Time Window */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Time Window
              </h3>
              <div className="space-y-2">
                {timeWindows.map((window) => (
                  <button
                    key={window.value}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, timeWindow: window.value }))}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      filters.timeWindow === window.value
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border border-yellow-400/30'
                        : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/25'
                    }`}
                  >
                    {window.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/20 bg-white/5 backdrop-blur-sm">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-white/15 backdrop-blur-xl text-white py-3 px-4 rounded-xl font-semibold border border-white/30 hover:bg-white/25 transition-all duration-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
