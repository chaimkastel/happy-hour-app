'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

interface Location {
  lat: number;
  lng: number;
  label: string;
  neighborhood: string;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location) => void;
  timeWindow: string;
  setTimeWindow: (window: string) => void;
  savedNeighborhoods: Location[];
  addSavedNeighborhood: (location: Location) => void;
  removeSavedNeighborhood: (label: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocationState] = useState<Location | null>(null);
  const [timeWindow, setTimeWindowState] = useState<string>('Now–7pm');
  const [savedNeighborhoods, setSavedNeighborhoods] = useState<Location[]>([]);

  // Load from storage on mount
  useEffect(() => {
    const savedLocation = storage.get<Location>('location');
    const savedTimeWindow = storage.get<string>('timeWindow', 'Now–7pm') || 'Now–7pm';
    const savedNeighborhoods = storage.get<Location[]>('savedNeighborhoods', []) || [];

    if (savedLocation) setLocationState(savedLocation);
    setTimeWindowState(savedTimeWindow);
    setSavedNeighborhoods(savedNeighborhoods);
  }, []);

  const setLocation = (loc: Location) => {
    setLocationState(loc);
    storage.set('location', loc);
  };

  const setTimeWindow = (window: string) => {
    setTimeWindowState(window);
    storage.set('timeWindow', window);
  };

  const addSavedNeighborhood = (loc: Location) => {
    const updated = [...savedNeighborhoods, loc];
    setSavedNeighborhoods(updated);
    storage.set('savedNeighborhoods', updated);
  };

  const removeSavedNeighborhood = (label: string) => {
    const updated = savedNeighborhoods.filter(n => n.label !== label);
    setSavedNeighborhoods(updated);
    storage.set('savedNeighborhoods', updated);
  };

  return (
    <LocationContext.Provider value={{
      location,
      setLocation,
      timeWindow,
      setTimeWindow,
      savedNeighborhoods,
      addSavedNeighborhood,
      removeSavedNeighborhood,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

