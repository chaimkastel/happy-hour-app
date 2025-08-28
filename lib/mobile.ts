'use client';

import { useState, useEffect } from 'react';

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, isHydrated };
}

export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function getMobileRedirectPath(pathname: string): string | null {
  // Map desktop routes to mobile routes
  const mobileRoutes: Record<string, string> = {
    '/explore': '/mobile/explore',
    '/favorites': '/mobile/favorites', 
    '/account': '/mobile/account',
    '/wallet': '/mobile/wallet',
    '/signup': '/mobile/signup',
    '/login': '/mobile/login',
    '/deals': '/mobile/explore', // deals redirects to explore
    '/about': '/mobile/about',
    '/contact': '/mobile/contact',
    '/privacy': '/mobile/privacy',
    '/terms': '/mobile/terms',
  };

  return mobileRoutes[pathname] || null;
}
