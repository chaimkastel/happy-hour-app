import { SkeletonGrid } from '@/components/SkeletonCard';

export default function DealLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="w-full h-64 lg:h-96 bg-gray-200 rounded-lg animate-pulse" />
          
          {/* Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
            
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            </div>
            
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
