'use client';

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Custom Cocktail Icon
export const CocktailIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2L15 8H18C18.6 8 19 8.4 19 9V11C19 11.6 18.6 12 18 12H6C5.4 12 5 11.6 5 11V9C5 8.4 5.4 8 6 8H9L12 2Z"
      fill="currentColor"
    />
    <path
      d="M7 14H17V16C17 16.6 16.6 17 16 17H8C7.4 17 7 16.6 7 16V14Z"
      fill="currentColor"
    />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
  </svg>
);

// Custom Clock Icon with Animation
export const AnimatedClockIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`${className} animate-spin`}
    style={{ animationDuration: '2s' }}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M12 6V12L16 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Location Pin with Pulse
export const PulsingLocationIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <div className="relative">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.6 4.1 5.4 5.8 3.8C7.5 2.1 9.7 1 12 1C14.3 1 16.5 2.1 18.2 3.8C19.9 5.4 21 7.6 21 10Z"
        fill="currentColor"
      />
      <circle cx="12" cy="10" r="3" fill="white" />
    </svg>
    <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-20"></div>
  </div>
);

// Custom Beer Mug Icon
export const BeerMugIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M6 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
      fill="currentColor"
    />
    <path
      d="M8 7H16V9H8V7Z"
      fill="white"
      opacity="0.8"
    />
    <path
      d="M8 11H16V13H8V11Z"
      fill="white"
      opacity="0.6"
    />
    <path
      d="M8 15H16V17H8V15Z"
      fill="white"
      opacity="0.4"
    />
    <rect x="20" y="8" width="2" height="8" fill="currentColor" />
  </svg>
);

// Custom Star with Glow
export const GlowingStarIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <div className="relative">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} drop-shadow-lg`}
    >
      <path
        d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
        fill="currentColor"
      />
    </svg>
    <div className="absolute inset-0 rounded-full bg-current animate-pulse opacity-30"></div>
  </div>
);

// Custom Heart with Beat Animation
export const BeatingHeartIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`${className} animate-pulse`}
    style={{ animationDuration: '1.5s' }}
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Wallet Icon
export const WalletIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M19 7H5C3.9 7 3 7.9 3 9V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9C21 7.9 20.1 7 19 7Z"
      fill="currentColor"
    />
    <path
      d="M16 15H18V17H16V15Z"
      fill="white"
    />
    <path
      d="M7 3H17V5H7V3Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Rocket Icon
export const RocketIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2L14 8H18L15 12L18 16H14L12 22L10 16H6L9 12L6 8H10L12 2Z"
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

// Custom Sparkles Icon
export const SparklesIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`${className} animate-spin`}
    style={{ animationDuration: '3s' }}
  >
    <path
      d="M12 2L13.5 6.5L18 8L13.5 9.5L12 14L10.5 9.5L6 8L10.5 6.5L12 2Z"
      fill="currentColor"
    />
    <path
      d="M20 4L21 6L23 7L21 8L20 10L19 8L17 7L19 6L20 4Z"
      fill="currentColor"
    />
    <path
      d="M4 16L5 18L7 19L5 20L4 22L3 20L1 19L3 18L4 16Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Badge Icon
export const BadgeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      d="M9 12L11 14L15 10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Streak Icon
export const StreakIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Notification Bell
export const NotificationBellIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <div className="relative">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M18 8C18 6.4 17.2 4.9 16 4C14.8 3.1 13.1 2.5 11.5 2.5C9.9 2.5 8.2 3.1 7 4C5.8 4.9 5 6.4 5 8C5 15 2 17 2 17H21C21 17 18 15 18 8Z"
        fill="currentColor"
      />
      <path
        d="M13.73 21C13.55 21.3 13.28 21.6 12.95 21.8C12.62 22 12.24 22.1 11.85 22.1C11.46 22.1 11.08 22 10.75 21.8C10.42 21.6 10.15 21.3 9.97 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
  </div>
);

// Custom Search Icon with Magnifying Glass
export const SearchIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M21 21L16.65 16.65"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Filter Icon
export const FilterIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Menu Icon
export const MenuIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M3 12H21M3 6H21M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Close Icon
export const CloseIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Arrow Right Icon
export const ArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M5 12H19M12 5L19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom User Icon
export const UserIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

// Custom Settings Icon
export const SettingsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M19.4 15C19.3 15.3 19.2 15.6 19.1 15.9L21.4 17.2C21.6 17.3 21.7 17.6 21.6 17.8L19.6 21.2C19.5 21.4 19.2 21.5 19 21.4L16.5 20.1C16 20.4 15.5 20.6 15 20.7L14.7 23.4C14.7 23.6 14.5 23.8 14.3 23.8H9.7C9.5 23.8 9.3 23.6 9.3 23.4L9 20.7C8.5 20.6 8 20.4 7.5 20.1L5 21.4C4.8 21.5 4.5 21.4 4.4 21.2L2.4 17.8C2.3 17.6 2.4 17.3 2.6 17.2L4.9 15.9C4.8 15.6 4.7 15.3 4.6 15L2.3 13.7C2.1 13.6 2 13.3 2.1 13.1L4.1 9.7C4.2 9.5 4.5 9.4 4.7 9.5L7.2 10.8C7.7 10.5 8.2 10.3 8.7 10.2L9 7.5C9 7.3 9.2 7.1 9.4 7.1H14.6C14.8 7.1 15 7.3 15 7.5L15.3 10.2C15.8 10.3 16.3 10.5 16.8 10.8L19.3 9.5C19.5 9.4 19.8 9.5 19.9 9.7L21.9 13.1C22 13.3 21.9 13.6 21.7 13.7L19.4 15Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Logout Icon
export const LogoutIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M9 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17L21 12L16 7M21 12H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Grid Icon
export const GridIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" fill="currentColor" />
    <rect x="14" y="3" width="7" height="7" fill="currentColor" />
    <rect x="3" y="14" width="7" height="7" fill="currentColor" />
    <rect x="14" y="14" width="7" height="7" fill="currentColor" />
  </svg>
);

// Custom List Icon
export const ListIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Map Icon
export const MapIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2V18M16 6V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Trending Up Icon
export const TrendingUpIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M23 6L13.5 15.5L8.5 10.5L1 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 6H23V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Award Icon
export const AwardIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M15.5 13.5L12 17L8.5 13.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Zap Icon
export const ZapIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Credit Card Icon
export const CreditCardIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M1 10H23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Building2 Icon
export const Building2Icon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M6 22V4C6 3.4 6.4 3 7 3H17C17.6 3 18 3.4 18 4V22L12 18L6 22Z"
      fill="currentColor"
    />
    <path
      d="M9 9H15M9 13H15M9 17H15"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Chevron Right Icon
export const ChevronRightIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Play Icon
export const PlayIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <polygon
      points="5,3 19,12 5,21"
      fill="currentColor"
    />
  </svg>
);

// Custom Shield Icon
export const ShieldIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 22S8 18 8 14V5L12 3L16 5V14C16 18 12 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Globe Icon
export const GlobeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M2 12H22M12 2C14.5 4.5 16 8.2 16 12S14.5 19.5 12 22C9.5 19.5 8 15.8 8 12S9.5 4.5 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Custom Gift Icon
export const GiftIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M20 12V22H4V12M2 7H22V12H2V7ZM12 22V7M12 7H7.5C6.7 7 6 6.3 6 5.5S6.7 4 7.5 4C8.3 4 9 4.7 9 5.5S8.3 7 7.5 7H12ZM12 7H16.5C17.3 7 18 6.3 18 5.5S17.3 4 16.5 4C15.7 4 15 4.7 15 5.5S15.7 7 16.5 7H12Z"
      fill="currentColor"
    />
  </svg>
);