'use client';

import { Search, Heart, MapPin, Users, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
}

const tabs: Tab[] = [
  { id: 'explore', label: 'Explore', icon: Search, href: '/mobile' },
  { id: 'favorites', label: 'Favorites', icon: Heart, href: '/mobile/favorites' },
  { id: 'search', label: 'Search', icon: MapPin, href: '/mobile/search' },
  { id: 'wallet', label: 'Wallet', icon: Users, href: '/mobile/wallet' },
  { id: 'account', label: 'Account', icon: User, href: '/mobile/account' }
];

interface MobileBottomNavProps {
  className?: string;
}

export default function MobileBottomNav({ className = '' }: MobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (href: string) => {
    router.push(href as any);
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden ${className}`}
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.id === 'explore' && pathname === '/mobile');
          
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.href)}
              className={`flex flex-col items-center gap-1 p-2 min-w-0 flex-1 transition-colors ${
                isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ minHeight: '44px', minWidth: '44px' }}
              aria-label={tab.label}
            >
              <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                isActive ? 'bg-orange-100' : ''
              }`}>
                <Icon size={isActive ? 18 : 16} />
              </div>
              <span className={`text-xs font-medium truncate ${
                isActive ? 'text-orange-500' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}