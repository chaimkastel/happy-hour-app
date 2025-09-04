'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, MapPin } from 'lucide-react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';

interface AutoHideHeaderProps {
  onSearchFocus?: () => void;
  onLocationFocus?: () => void;
  onNotificationPress?: () => void;
  className?: string;
}

export default function AutoHideHeader({
  onSearchFocus,
  onLocationFocus,
  onNotificationPress,
  className = ''
}: AutoHideHeaderProps) {
  const { direction, isAtTop } = useScrollDirection({ threshold: 8 });
  const [isVisible, setIsVisible] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    return () => mediaQuery.removeEventListener('change', handleReducedMotionChange);
  }, []);

  useEffect(() => {
    // Show header when scrolling up or at top
    const shouldShow = direction === 'up' || isAtTop;
    setIsVisible(shouldShow);
  }, [direction, isAtTop]);

  const handleSearchFocus = () => {
    setIsVisible(true);
    onSearchFocus?.();
  };

  const handleLocationFocus = () => {
    setIsVisible(true);
    onLocationFocus?.();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-200 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        willChange: 'transform',
        ...(isReducedMotion && {
          transition: 'none'
        })
      }}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">HH</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Happy Hour</h1>
            <p className="text-xs text-gray-500">Find deals near you</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <button
            onClick={handleSearchFocus}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-target"
            aria-label="Search deals"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Location Button */}
          <button
            onClick={handleLocationFocus}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-target"
            aria-label="Change location"
          >
            <MapPin className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button
            onClick={onNotificationPress}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-target relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Shadow overlay for depth */}
      {isVisible && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      )}
    </header>
  );
}