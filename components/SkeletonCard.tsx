'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
}

export default function SkeletonCard({ 
  className = '',
  showImage = true,
  showTitle = true,
  showDescription = true,
  showActions = true
}: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {showImage && (
        <div className="w-full h-48 bg-gray-200 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {showTitle && (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        )}
        
        {showDescription && (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        )}
        
        {showActions && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12" />
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function SkeletonGrid({ count = 6, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard 
          key={index} 
          showImage={false}
          className="flex items-center gap-4"
        />
      ))}
    </div>
  );
}

export function SkeletonMap({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-96 bg-gray-200 rounded-lg animate-pulse ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}

export function SkeletonHeader({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
    </div>
  );
}