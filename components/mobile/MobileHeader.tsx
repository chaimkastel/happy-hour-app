'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface MobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  showLocation?: boolean;
  onSearchClick?: () => void;
  onLocationClick?: () => void;
  locationText?: string;
  rightElement?: React.ReactNode;
}

export default function MobileHeader({
  title,
  showSearch = true,
  showLocation = true,
  onSearchClick,
  onLocationClick,
  locationText = "Brooklyn, New York",
  rightElement
}: MobileHeaderProps) {
  return (
    <header 
      className="sticky top-0 z-50 bg-white border-b border-gray-200 md:hidden"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo or Back Button */}
          <div className="flex items-center">
            {title ? (
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  className="p-1 -ml-1"
                  aria-label="Go back"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
              </div>
            ) : (
              <BrandLogo size="md" />
            )}
          </div>

          {/* Right: Search, Location, or Custom Element */}
          <div className="flex items-center gap-2">
            {rightElement || (
              <>
                {showSearch && (
                  <button
                    type="button"
                    onClick={onSearchClick}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                )}
                {showLocation && (
                  <button
                    type="button"
                    onClick={onLocationClick}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Change location"
                  >
                    <MapPin size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 truncate max-w-24">
                      {locationText}
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}