'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  Heart,
  User,
  MapPin,
  Bell,
  Menu,
  X,
  Plus,
  Star,
  Wallet,
  Settings,
  LogOut,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { 
      href: '/', 
      icon: Home, 
      label: 'Home', 
      active: pathname === '/',
      color: 'text-orange-500'
    },
    { 
      href: '/explore', 
      icon: Search, 
      label: 'Explore', 
      active: pathname.startsWith('/explore'),
      color: 'text-blue-500'
    },
    { 
      href: '/favorites', 
      icon: Heart, 
      label: 'Favorites', 
      active: pathname.startsWith('/favorites'),
      color: 'text-pink-500'
    },
    { 
      href: '/wallet', 
      icon: Wallet, 
      label: 'Wallet', 
      active: pathname.startsWith('/wallet'),
      color: 'text-green-500'
    },
    { 
      href: '/account', 
      icon: User, 
      label: 'Account', 
      active: pathname.startsWith('/account'),
      color: 'text-purple-500'
    },
  ];

  const menuItems = [
    {
      title: 'For Customers',
      items: [
        { href: '/explore', label: 'Explore Deals', icon: Search },
        { href: '/favorites', label: 'My Favorites', icon: Heart },
        { href: '/wallet', label: 'My Wallet', icon: Wallet },
        { href: '/account', label: 'My Account', icon: User },
      ]
    },
    {
      title: 'For Restaurants',
      items: [
        { href: '/merchant/signup', label: 'List Your Restaurant', icon: Plus },
        { href: '/merchant', label: 'Merchant Portal', icon: Settings },
      ]
    },
    {
      title: 'Support',
      items: [
        { href: '/help', label: 'Help Center', icon: Star },
        { href: '/contact', label: 'Contact Us', icon: MapPin },
      ]
    }
  ];

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Top Navigation Bar */}
      <motion.header
        className={cn(
          'transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg'
            : 'bg-white/90 backdrop-blur-sm border-b border-gray-200/30'
        )}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🍺</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Happy Hour</span>
              <div className="text-xs text-gray-500 -mt-1">Premium Deals</div>
            </div>
          </motion.div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-10 h-10 hover:bg-orange-50"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {notifications}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {[
                            { text: 'New deal near you: 50% off at Brooklyn Bistro', time: '2m ago' },
                            { text: 'Your favorite restaurant has a happy hour starting soon', time: '1h ago' },
                            { text: 'Instant deal activated nearby', time: '3h ago' },
                          ].map((item, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer">
                              <p className="text-sm text-gray-900">{item.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign In / Sign Out Button */}
            {status === 'unauthenticated' && (
              <Link href="/login">
                <Button
                  size="sm"
                  className="h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 hover:bg-orange-50"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-40 shadow-lg"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Link href={item.href as any} className="block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'flex flex-col items-center space-y-1 h-12 w-full rounded-xl transition-all duration-300',
                      item.active
                        ? `${item.color} bg-orange-50 shadow-sm`
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', item.active && 'scale-110')} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-20 right-4 z-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
            onClick={() => window.location.href = '/explore'}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl z-50 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg font-bold">🍺</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                    <p className="text-sm text-gray-500">Premium Deals</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-8 overflow-y-auto h-full pb-20">
                {menuItems.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={itemIndex}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href={item.href as any}
                              className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon className="w-7 h-7 text-orange-600" />
                              </div>
                              <span className="text-gray-900 font-semibold text-base">
                                {item.label}
                              </span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* User Profile & Sign Out Section */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  {session ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{session.user?.name || session.user?.email}</div>
                          <div className="text-sm text-gray-600">{session.user?.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 w-full text-left"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <LogOut className="w-7 h-7 text-red-600" />
                        </div>
                        <span className="text-gray-900 font-semibold text-base">
                          Sign Out
                        </span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 group bg-gradient-to-r from-orange-500 to-pink-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <LogIn className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-white font-semibold text-base">
                        Sign In
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileLayout;