'use client';

import { Bell, Menu, X } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  showNotifications?: boolean;
  onMenuToggle?: () => void;
  onNotificationClick?: () => void;
  isMenuOpen?: boolean;
}

export default function MobileHeader({
  title,
  subtitle,
  showMenu = true,
  showNotifications = true,
  onMenuToggle,
  onNotificationClick,
  isMenuOpen = false
}: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 md:hidden">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🍺</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl drop-shadow-lg">{title}</h1>
              {subtitle && (
                <p className="text-white/70 text-xs">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {showNotifications && (
              <button 
                type="button"
                onClick={onNotificationClick}
                className="p-2 rounded-lg bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
            )}
            {showMenu && onMenuToggle && (
              <button 
                type="button"
                onClick={onMenuToggle}
                className="p-2 rounded-lg bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
