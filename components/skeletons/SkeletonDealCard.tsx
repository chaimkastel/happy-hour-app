import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonDealCard = () => {
  return (
    <div className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-gray-100">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
        {/* Subtitle */}
        <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

