'use client';

export default function DealCardSkeleton() {
  return (
    <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-36 mb-4 rounded-xl overflow-hidden bg-white/10">
        <div className="absolute top-3 right-3">
          <div className="w-16 h-6 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-5 bg-white/20 rounded-full"></div>
            <div className="w-10 h-5 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Title skeleton */}
        <div>
          <div className="h-5 bg-white/20 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-white/15 rounded mb-1 w-1/2"></div>
          <div className="h-3 bg-white/10 rounded w-full"></div>
          <div className="h-3 bg-white/10 rounded w-2/3 mt-1"></div>
        </div>
        
        {/* Bottom row skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-3 bg-white/15 rounded w-12"></div>
            <div className="h-5 bg-white/20 rounded-full w-16"></div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
