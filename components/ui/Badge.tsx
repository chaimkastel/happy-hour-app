'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
  interactive?: boolean;
  animation?: 'none' | 'pulse' | 'bounce' | 'wiggle' | 'heartbeat' | 'tada';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'glow' | 'glow-secondary' | 'glow-accent';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      rounded = 'full',
      icon: Icon,
      iconPosition = 'left',
      removable = false,
      onRemove,
      interactive = false,
      animation = 'none',
      gradient = 'none',
      shadow = 'none',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
      
      // Size variants
      {
        'px-1.5 py-0.5 text-xs': size === 'xs',
        'px-2 py-1 text-xs': size === 'sm',
        'px-2.5 py-1 text-sm': size === 'md',
        'px-3 py-1.5 text-base': size === 'lg',
        'px-4 py-2 text-lg': size === 'xl',
      },
      
      // Border radius
      {
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-xl': rounded === 'xl',
        'rounded-full': rounded === 'full',
      },
      
      // Shadow variants
      {
        'shadow-none': shadow === 'none',
        'shadow-sm': shadow === 'sm',
        'shadow-md': shadow === 'md',
        'shadow-lg': shadow === 'lg',
        'shadow-glow': shadow === 'glow',
        'shadow-glow-secondary': shadow === 'glow-secondary',
        'shadow-glow-accent': shadow === 'glow-accent',
      },
      
      // Animation variants
      {
        'animate-none': animation === 'none',
        'animate-pulse': animation === 'pulse',
        'animate-bounce': animation === 'bounce',
        'animate-wiggle': animation === 'wiggle',
        'animate-heartbeat': animation === 'heartbeat',
        'animate-tada': animation === 'tada',
      },
      
      // Interactive styles
      {
        'cursor-pointer hover:scale-105': interactive,
        'hover:shadow-lg': interactive && shadow !== 'none',
      },
      
      // Gradient variants
      {
        'bg-gradient-to-r from-primary-500 to-primary-600 text-white': gradient === 'primary',
        'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white': gradient === 'secondary',
        'bg-gradient-to-r from-accent-500 to-accent-600 text-white': gradient === 'accent',
        'bg-gradient-to-r from-food-pizza to-food-pasta text-white': gradient === 'warm',
        'bg-gradient-to-r from-secondary-500 to-accent-500 text-white': gradient === 'cool',
        'bg-gradient-to-r from-food-pizza to-food-dessert text-white': gradient === 'sunset',
        'bg-gradient-to-r from-food-fish to-accent-500 text-white': gradient === 'ocean',
        'bg-gradient-to-r from-food-salad to-secondary-500 text-white': gradient === 'forest',
        'bg-gradient-to-r from-food-pizza to-food-meat text-white': gradient === 'fire',
        'bg-gradient-to-r from-accent-500 to-food-wine text-white': gradient === 'royal',
        'bg-gradient-to-r from-food-dessert to-accent-500 text-white': gradient === 'tropical',
      },
      
      // Variant styles (only apply if no gradient)
      gradient === 'none' && {
        // Primary variant
        'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800': variant === 'primary',
        
        // Secondary variant
        'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800': variant === 'secondary',
        
        // Accent variant
        'bg-accent-100 text-accent-700 dark:bg-accent-900/20 dark:text-accent-300 border border-accent-200 dark:border-accent-800': variant === 'accent',
        
        // Success variant
        'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300 border border-success-200 dark:border-success-800': variant === 'success',
        
        // Warning variant
        'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300 border border-warning-200 dark:border-warning-800': variant === 'warning',
        
        // Error variant
        'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-300 border border-error-200 dark:border-error-800': variant === 'error',
        
        // Info variant
        'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800': variant === 'info',
        
        // Neutral variant
        'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/20 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800': variant === 'neutral',
      },
      
      className
    );

    const iconSize = {
      'xs': 'w-3 h-3',
      'sm': 'w-3 h-3',
      'md': 'w-4 h-4',
      'lg': 'w-5 h-5',
      'xl': 'w-6 h-6',
    }[size];

    const removeButtonSize = {
      'xs': 'w-3 h-3',
      'sm': 'w-3 h-3',
      'md': 'w-4 h-4',
      'lg': 'w-5 h-5',
      'xl': 'w-6 h-6',
    }[size];

    return (
      <span
        className={baseClasses}
        ref={ref}
        {...props}
      >
        {/* Left icon */}
        {Icon && iconPosition === 'left' && (
          <Icon className={cn('mr-1.5', iconSize)} />
        )}
        
        {/* Badge content */}
        {children}
        
        {/* Right icon */}
        {Icon && iconPosition === 'right' && (
          <Icon className={cn('ml-1.5', iconSize)} />
        )}
        
        {/* Remove button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              'ml-1.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1'
            )}
            aria-label="Remove badge"
          >
            <svg
              className={cn('text-current', removeButtonSize)}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
