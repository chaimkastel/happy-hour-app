'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

export const LocationButton = ({ onEdit }: { onEdit: () => void }) => {
  const { location, timeWindow } = useLocation();

  const neighborhood = location?.neighborhood || 'Brooklyn';

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onEdit}
      className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full hover:border-orange-500/50 hover:bg-white transition-all shadow-sm"
      aria-label="Change location"
    >
      <MapPin className="w-4 h-4 text-orange-600" />
      <span className="text-sm font-medium text-slate-900">
        {neighborhood}
      </span>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-slate-400">•</span>
      <span className="text-sm font-medium text-slate-600">{timeWindow}</span>
    </motion.button>
  );
};

