'use client';

import { useState, useEffect } from 'react';
import { Grid, MapPin } from 'lucide-react';

interface ViewToggleProps {
  onViewChange?: (view: 'list' | 'map') => void;
  initialView?: 'list' | 'map';
  className?: string;
}

export default function ViewToggle({
  onViewChange,
  initialView = 'list',
  className = ''
}: ViewToggleProps) {
  const [currentView, setCurrentView] = useState<'list' | 'map'>(initialView);

  useEffect(() => {
    // Load saved view preference from localStorage
    const savedView = localStorage.getItem('hh:viewPreference');
    if (savedView && (savedView === 'list' || savedView === 'map')) {
      setCurrentView(savedView);
    }
  }, []);

  const handleViewChange = (view: 'list' | 'map') => {
    setCurrentView(view);
    localStorage.setItem('hh:viewPreference', view);
    onViewChange?.(view);
  };

  return (
    <div className={`flex bg-white/15 backdrop-blur-xl rounded-lg p-1 border border-white/30 ${className}`}>
      <button
        type="button"
        onClick={() => handleViewChange('list')}
        className={`p-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
          currentView === 'list' 
            ? 'bg-white/20 text-white shadow-lg' 
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        aria-label="List view"
      >
        <Grid className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">List</span>
      </button>
      <button
        type="button"
        onClick={() => handleViewChange('map')}
        className={`p-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
          currentView === 'map' 
            ? 'bg-white/20 text-white shadow-lg' 
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        aria-label="Map view"
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Map</span>
      </button>
    </div>
  );
}
