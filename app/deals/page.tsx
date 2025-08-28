'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DealsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified explore page
    router.replace('/explore');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Redirecting to explore page...</p>
      </div>
    </div>
  );
}