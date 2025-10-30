'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, Wallet, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname?.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href as any}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-orange-600'
                  : 'text-gray-400'
              }`}
              data-testid={`nav-${label.toLowerCase()}`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-orange-50' : ''} transition-all`}>
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              </div>
              <span className="text-xs font-medium mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

