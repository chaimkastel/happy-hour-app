'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
    </div>
  );
}

export default function ClientOnly({ children, fallback = <LoadingFallback /> }: ClientOnlyProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Higher-order component for dynamic imports with SSR disabled
export function withClientOnly<T extends object>(
  Component: React.ComponentType<T>,
  options: { ssr?: boolean; loading?: () => React.ReactElement } = {}
) {
  const { ssr = false, loading: LoadingComponent = LoadingFallback } = options;
  
  return dynamic(() => Promise.resolve(Component), {
    ssr,
    loading: LoadingComponent,
  });
}
