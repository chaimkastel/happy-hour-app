'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Grid, Heart, Search, CreditCard, User } from 'lucide-react';

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const bottomNavItems: BottomNavItem[] = [
  {
    id: 'explore',
    label: 'Explore',
    icon: Grid,
    path: '/mobile'
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: Heart,
    path: '/mobile/favorites'
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    path: '/mobile/search'
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: CreditCard,
    path: '/wallet'
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    path: '/mobile/account'
  }
];

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    if (path === '/mobile') {
      return pathname === '/mobile' || pathname === '/mobile/explore';
    }
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 safe-area-pb z-50 md:hidden">
      <div className="flex items-center justify-around py-3">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-2 px-3 transition-all duration-200 ${
                active 
                  ? 'text-yellow-400 transform scale-110' 
                  : 'text-white/70 hover:text-white transform hover:scale-110'
              }`}
              aria-label={item.label}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                active 
                  ? 'bg-yellow-400/20' 
                  : 'bg-white/10'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${
                active ? 'font-bold' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
