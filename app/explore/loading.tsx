import { SkeletonGrid, SkeletonMap, SkeletonHeader } from '@/components/SkeletonCard';

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <SkeletonHeader />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48" />
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32" />
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-24" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-1">
            <SkeletonMap />
          </div>
          
          {/* Deals Grid */}
          <div className="lg:col-span-2">
            <SkeletonGrid count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}

