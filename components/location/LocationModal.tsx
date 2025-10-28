'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Clock, Search, Star } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal = ({ isOpen, onClose }: LocationModalProps) => {
  const { location, setLocation, timeWindow, setTimeWindow, savedNeighborhoods, addSavedNeighborhood } = useLocation();
  const [activeTab, setActiveTab] = useState<'nearby' | 'saved' | 'search'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Mock search results
  const mockResults = [
    { lat: 40.6782, lng: -73.9442, label: 'Brooklyn, NY', neighborhood: 'Brooklyn' },
    { lat: 40.7831, lng: -73.9712, label: 'Manhattan, NY', neighborhood: 'Manhattan' },
    { lat: 40.7282, lng: -73.7949, label: 'Queens, NY', neighborhood: 'Queens' },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockResults.filter(r => 
        r.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const mockLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Your Location',
          neighborhood: 'Your Area',
        };
        setLocation(mockLocation);
        setIsLocating(false);
        onClose();
      },
      (error) => {
        setGeoError("We'll never track you without asking. Pick a spot manually or allow location.");
        setIsLocating(false);
      }
    );
  };

  const timeOptions = ['Now–7pm', 'Later today', 'Tomorrow', 'Custom'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Location & Time</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex border-b mb-4">
                  {['Nearby', 'Saved', 'Search'].map((tab) => (
                    <button key={tab} className="flex-1 py-2 text-sm font-semibold border-b-2 border-orange-600">
                      {tab}
                    </button>
                  ))}
                </div>
                {activeTab === 'nearby' && (
                  <button onClick={handleUseMyLocation} disabled={isLocating}
                    className="w-full flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold">{isLocating ? 'Getting location...' : 'Use my location'}</span>
                  </button>
                )}
                {geoError && <p className="mt-3 text-sm text-gray-600">{geoError}</p>}
              </div>
              <div className="p-6 border-t bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">Time Window</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {timeOptions.map(option => (
                    <button key={option} onClick={() => setTimeWindow(option)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white hover:bg-gray-100">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

