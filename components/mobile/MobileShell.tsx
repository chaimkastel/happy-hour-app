'use client';

import { ReactNode } from 'react';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';

interface MobileShellProps {
  children: ReactNode;
  headerProps?: {
    title?: string;
    showSearch?: boolean;
    showLocation?: boolean;
    onSearchClick?: () => void;
    onLocationClick?: () => void;
    locationText?: string;
    rightElement?: React.ReactNode;
  };
  showBottomNav?: boolean;
  className?: string;
  forceMobile?: boolean; // When true, always show mobile UI regardless of viewport
}

export default function MobileShell({ 
  children, 
  headerProps = {},
  showBottomNav = true,
  className = '',
  forceMobile = false
}: MobileShellProps) {
  // When forceMobile is true, always show mobile UI regardless of viewport
  const containerClasses = forceMobile 
    ? `min-h-screen bg-gray-50 ${className}`
    : `min-h-screen bg-gray-50 md:hidden ${className}`;
    
  return (
    <div className={containerClasses}>
      {/* Mobile Header */}
      <MobileHeader {...headerProps} />
      
      {/* Main Content */}
      <main 
        className="relative"
        style={{ 
          paddingBottom: showBottomNav ? '80px' : '0',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      {showBottomNav && <MobileBottomNav />}
    </div>
  );
}
