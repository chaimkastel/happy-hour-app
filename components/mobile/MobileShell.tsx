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
}

export default function MobileShell({ 
  children, 
  headerProps = {},
  showBottomNav = true,
  className = ''
}: MobileShellProps) {
  return (
    <div className={`min-h-screen bg-gray-50 md:hidden ${className}`}>
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
