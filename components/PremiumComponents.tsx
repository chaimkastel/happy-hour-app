import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Filter, 
  Grid, 
  List, 
  Users, 
  CreditCard,
  Bell,
  Settings,
  ChevronRight,
  X,
  Menu,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  Gift
} from 'lucide-react';
import { Button, Card, Input, Badge, Avatar, Spinner } from './DesignSystem';
import { cn } from '../lib/utils';

// Premium Search Bar Component
interface PremiumSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const PremiumSearchBar: React.FC<PremiumSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search restaurants, cuisines...",
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={cn("relative", className)}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all duration-300 shadow-lg"
        />
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-gray-600" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Premium Quick Action Button
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  className
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200",
        isActive 
          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
          : "bg-white/10 backdrop-blur-md text-gray-300 hover:bg-white/20 hover:text-white border border-white/20",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
};

// Premium Deal Card Component
interface Deal {
  id: string;
  title: string;
  venue: {
    name: string;
    image?: string;
  };
  discount: number;
  cuisine: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  isFavorite?: boolean;
}

interface PremiumDealCardProps {
  deal: Deal;
  onFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export const PremiumDealCard: React.FC<PremiumDealCardProps> = ({
  deal,
  onFavorite,
  onClick,
  className
}) => {
  const [isLiked, setIsLiked] = useState(deal.isFavorite || false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onFavorite?.(deal.id);
  };

  return (
    <motion.div
      className={cn("group cursor-pointer", className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.(deal.id)}
    >
      <Card variant="elevated" className="overflow-hidden">
        <div className="relative">
          {/* Venue Image */}
          <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-4 right-4">
              <motion.button
                onClick={handleFavorite}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                  )} 
                />
              </motion.button>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge variant="success" size="sm">
                {deal.discount}% OFF
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                  {deal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{deal.venue.name}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="default" size="sm">
                    {deal.cuisine}
                  </Badge>
                </div>
              </div>
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{deal.distance.toFixed(1)} mi</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className={cn("w-4 h-4", deal.isOpen ? "text-green-500" : "text-red-500")} />
                  <span className={deal.isOpen ? "text-green-600" : "text-red-600"}>
                    {deal.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{deal.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Premium Bottom Navigation
interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

interface PremiumBottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export const PremiumBottomNav: React.FC<PremiumBottomNavProps> = ({
  items,
  className
}) => {
  return (
    <motion.div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 safe-area-pb",
        className
      )}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200",
              item.isActive 
                ? "text-orange-600 bg-orange-50" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-6 flex items-center justify-center mb-1">
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Premium Header Component
interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  className?: string;
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  title,
  subtitle,
  onMenuClick,
  onNotificationClick,
  className
}) => {
  return (
    <motion.div
      className={cn(
        "sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onMenuClick}
              className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5 text-white" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          <motion.button
            onClick={onNotificationClick}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Premium Side Menu
interface SideMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface PremiumSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: SideMenuItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  className?: string;
}

export const PremiumSideMenu: React.FC<PremiumSideMenuProps> = ({
  isOpen,
  onClose,
  items,
  user,
  className
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50",
              className
            )}
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>

              {user && (
                <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-xl">
                  <Avatar src={user.avatar} fallback={user.name.charAt(0)} size="md" />
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      item.onClick();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-4 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
