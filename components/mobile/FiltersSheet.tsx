'use client';

import { useState, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  categories: string[];
  priceRange: string;
  distance: number;
  timeWindow: string;
  isOpen: boolean;
}

interface FiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const categories = ['All', 'Food', 'Drinks', 'Brunch', 'Dessert', 'Fast Food'];
const priceRanges = ['All', '$', '$$', '$$$'];
const timeWindows = ['Now', '3-6 PM', '6-9 PM', '9-11 PM'];

export default function FiltersSheet({ isOpen, onClose, filters, onFiltersChange }: FiltersSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryToggle = (category: string) => {
    if (category === 'All') {
      setLocalFilters(prev => ({ ...prev, categories: ['All'] }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        categories: prev.categories.includes('All') 
          ? [category]
          : prev.categories.includes(category)
            ? prev.categories.filter(c => c !== category)
            : [...prev.categories.filter(c => c !== 'All'), category]
      }));
    }
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      categories: ['All'],
      priceRange: 'All',
      distance: 5,
      timeWindow: 'Now',
      isOpen: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localFilters.categories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="flex gap-2">
              {priceRanges.map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setLocalFilters(prev => ({ ...prev, priceRange: price }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localFilters.priceRange === price
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Distance: {localFilters.distance} miles
            </h3>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={localFilters.distance}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, distance: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5 mi</span>
              <span>10 mi</span>
            </div>
          </div>

          {/* Time Window */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Time Window</h3>
            <div className="flex flex-wrap gap-2">
              {timeWindows.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setLocalFilters(prev => ({ ...prev, timeWindow: time }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    localFilters.timeWindow === time
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Open Now Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.isOpen}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, isOpen: e.target.checked }))}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-900">Open now only</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-2 py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
