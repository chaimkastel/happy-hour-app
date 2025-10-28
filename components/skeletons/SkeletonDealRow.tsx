'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export const SkeletonDealRow = () => {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 md:px-6 py-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px]">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="w-full aspect-[16/10] bg-gray-200" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
              </div>
              
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/3 bg-gray-200" />
                <Skeleton className="h-4 w-1/4 bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

