'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, QrCode, Wallet, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/redeem', icon: QrCode, label: 'Redeem' },
  { href: '/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href as any}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-all ${
                isActive
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

