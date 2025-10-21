// Design System - Apple/Uber Eats Level Quality
export const designSystem = {
  // Color Palette - Modern, accessible, brand-focused
  colors: {
    // Primary Brand Colors - Orange/Pink gradient theme
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Main brand color
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    // Secondary Colors - Blue/Purple gradient theme
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Accent Colors - Pink/Purple gradient theme
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    // Neutral Colors - Sophisticated grays
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    // Status Colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  // Typography - Apple-inspired hierarchy
  typography: {
    fontFamily: {
      sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  // Spacing - 8px grid system
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem',    // 256px
  },
  // Border Radius - Consistent rounded corners
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  // Shadows - Depth and elevation
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '3xl': '0 35px 60px -12px rgb(0 0 0 / 0.3)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },
  // Animation - Smooth, delightful interactions
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  // Breakpoints - Mobile-first responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  // Z-Index - Layering system
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Component Variants
export const componentVariants = {
  button: {
    primary: {
      base: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl',
      hover: 'hover:from-orange-600 hover:to-pink-600',
      active: 'active:from-orange-700 active:to-pink-700',
      disabled: 'disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none',
    },
    secondary: {
      base: 'bg-white text-orange-500 border border-orange-500 shadow-sm hover:shadow-md',
      hover: 'hover:bg-orange-50',
      active: 'active:bg-orange-100',
      disabled: 'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-300',
    },
    ghost: {
      base: 'bg-transparent text-orange-500 border-0',
      hover: 'hover:bg-orange-50',
      active: 'active:bg-orange-100',
      disabled: 'disabled:text-neutral-400',
    },
    danger: {
      base: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl',
      hover: 'hover:from-red-600 hover:to-pink-600',
      active: 'active:from-red-700 active:to-pink-700',
      disabled: 'disabled:bg-neutral-300 disabled:text-neutral-500',
    },
    success: {
      base: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl',
      hover: 'hover:from-green-600 hover:to-emerald-600',
      active: 'active:from-green-700 active:to-emerald-700',
      disabled: 'disabled:bg-neutral-300 disabled:text-neutral-500',
    },
  },
  input: {
    base: 'w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md',
    error: 'border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:ring-green-500',
  },
  card: {
    base: 'bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300',
    elevated: 'bg-white rounded-2xl border border-neutral-200 shadow-lg hover:shadow-xl',
    interactive: 'bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl',
  },
} as const;

// Gradient Presets
export const gradients = {
  primary: 'bg-gradient-to-r from-orange-500 to-pink-500',
  secondary: 'bg-gradient-to-r from-blue-500 to-purple-500',
  accent: 'bg-gradient-to-r from-pink-500 to-purple-500',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500',
  warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  error: 'bg-gradient-to-r from-red-500 to-pink-500',
  neutral: 'bg-gradient-to-r from-gray-500 to-gray-600',
  sunset: 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600',
  ocean: 'bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500',
  forest: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500',
} as const;

// Glassmorphism Presets
export const glassmorphism = {
  light: 'bg-white/10 backdrop-blur-xl border border-white/20',
  medium: 'bg-white/20 backdrop-blur-xl border border-white/30',
  strong: 'bg-white/30 backdrop-blur-xl border border-white/40',
  dark: 'bg-black/10 backdrop-blur-xl border border-black/20',
} as const;