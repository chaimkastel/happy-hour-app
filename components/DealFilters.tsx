'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Clock, 
  MapPin, 
  Star, 
  DollarSign,
  Utensils,
  Wine,
  Coffee,
  Pizza,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export interface DealFilters {
  search: string;
  openNow: boolean;
  cuisine: string[];
  minDiscount: number;
  maxDistance: number;
  sortBy: 'distance' | 'discount' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
}

interface DealFiltersProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
}

const cuisineOptions = [
  { id: 'pizza', label: 'Pizza', icon: Pizza },
  { id: 'italian', label: 'Italian', icon: Utensils },
  { id: 'mexican', label: 'Mexican', icon: Utensils },
  { id: 'asian', label: 'Asian', icon: Utensils },
  { id: 'american', label: 'American', icon: Utensils },
  { id: 'seafood', label: 'Seafood', icon: Utensils },
  { id: 'bar', label: 'Bar', icon: Wine },
  { id: 'cafe', label: 'Cafe', icon: Coffee },
];

const sortOptions = [
  { id: 'distance', label: 'Distance', icon: MapPin },
  { id: 'discount', label: 'Discount %', icon: DollarSign },
  { id: 'rating', label: 'Rating', icon: Star },
  { id: 'newest', label: 'Newest', icon: Clock },
];

export default function DealFilters({ 
  filters, 
  onFiltersChange, 
  userLocation,
  className = '' 
}: DealFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<DealFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilters = (updates: Partial<DealFilters>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleCuisine = (cuisineId: string) => {
    const newCuisine = localFilters.cuisine.includes(cuisineId)
      ? localFilters.cuisine.filter(c => c !== cuisineId)
      : [...localFilters.cuisine, cuisineId];
    updateFilters({ cuisine: newCuisine });
  };

  const clearFilters = () => {
    const defaultFilters: DealFilters = {
      search: '',
      openNow: false,
      cuisine: [],
      minDiscount: 0,
      maxDistance: 50,
      sortBy: 'distance',
      sortOrder: 'asc',
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = 
    localFilters.search ||
    localFilters.openNow ||
    localFilters.cuisine.length > 0 ||
    localFilters.minDiscount > 0 ||
    localFilters.maxDistance < 50 ||
    localFilters.sortBy !== 'distance';

  return (
    <div className={cn('relative', className)}>
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2',
            hasActiveFilters && 'border-blue-500 text-blue-600'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {localFilters.cuisine.length + (localFilters.openNow ? 1 : 0) + (localFilters.minDiscount > 0 ? 1 : 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search restaurants, cuisines, or deals..."
          value={localFilters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {localFilters.openNow && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                <Clock className="w-3 h-3" />
                Open Now
                <button
                  onClick={() => updateFilters({ openNow: false })}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {localFilters.cuisine.map((cuisineId) => {
              const cuisine = cuisineOptions.find(c => c.id === cuisineId);
              return (
                <span
                  key={cuisineId}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  {cuisine?.icon && <cuisine.icon className="w-3 h-3" />}
                  {cuisine?.label}
                  <button
                    onClick={() => toggleCuisine(cuisineId)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {localFilters.minDiscount > 0 && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                <DollarSign className="w-3 h-3" />
                {localFilters.minDiscount}%+ off
                <button
                  onClick={() => updateFilters({ minDiscount: 0 })}
                  className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {localFilters.maxDistance < 50 && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                <MapPin className="w-3 h-3" />
                Within {localFilters.maxDistance}km
                <button
                  onClick={() => updateFilters({ maxDistance: 50 })}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
          >
            <div className="space-y-4">
              {/* Open Now Filter */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.openNow}
                    onChange={(e) => updateFilters({ openNow: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Open Now</span>
                </label>
              </div>

              {/* Cuisine Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <button
                      key={cuisine.id}
                      onClick={() => toggleCuisine(cuisine.id)}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg border text-sm transition-colors',
                        localFilters.cuisine.includes(cuisine.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <cuisine.icon className="w-4 h-4" />
                      {cuisine.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Discount: {localFilters.minDiscount}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={localFilters.minDiscount}
                  onChange={(e) => updateFilters({ minDiscount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Distance Filter */}
              {userLocation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Distance: {localFilters.maxDistance}km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={localFilters.maxDistance}
                    onChange={(e) => updateFilters({ maxDistance: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({ 
                      sortOrder: localFilters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                    className="px-2"
                  >
                    {localFilters.sortOrder === 'asc' ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

