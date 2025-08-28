'use client';

import { useMobileDetection, getMobileRedirectPath } from '../lib/mobile';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface MobileWrapperProps {
  children: React.ReactNode;
}

export default function MobileWrapper({ children }: MobileWrapperProps) {
  const { isMobile, isHydrated } = useMobileDetection();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    
    if (isMobile) {
      const mobilePath = getMobileRedirectPath(pathname);
      if (mobilePath && pathname !== mobilePath) {
        router.replace(mobilePath);
      }
    }
  }, [isMobile, isHydrated, pathname, router]);

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 text-white">🍺</div>
          </div>
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If mobile and we have a mobile route, show loading while redirecting
  if (isMobile && getMobileRedirectPath(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 text-white">🍺</div>
          </div>
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Redirecting to mobile view...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
