'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow' | 'glow-secondary' | 'glow-accent';
  animation?: 'none' | 'pulse' | 'bounce' | 'float' | 'wiggle' | 'heartbeat' | 'tada' | 'swing';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      rounded = 'xl',
      shadow = 'lg',
      animation = 'none',
      gradient = 'none',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center font-semibold transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'transform hover:scale-105 active:scale-95',
      
      // Size variants
      {
        'px-2 py-1 text-xs': size === 'xs',
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
        'px-8 py-4 text-xl': size === 'xl',
        'px-10 py-5 text-2xl': size === '2xl',
      },
      
      // Width
      {
        'w-full': fullWidth,
      },
      
      // Border radius
      {
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-xl': rounded === 'xl',
        'rounded-2xl': rounded === '2xl',
        'rounded-full': rounded === 'full',
      },
      
      // Shadow variants
      {
        'shadow-none': shadow === 'none',
        'shadow-sm': shadow === 'sm',
        'shadow-md': shadow === 'md',
        'shadow-lg': shadow === 'lg',
        'shadow-xl': shadow === 'xl',
        'shadow-2xl': shadow === '2xl',
        'shadow-glow': shadow === 'glow',
        'shadow-glow-secondary': shadow === 'glow-secondary',
        'shadow-glow-accent': shadow === 'glow-accent',
      },
      
      // Animation variants
      {
        'animate-none': animation === 'none',
        'animate-pulse': animation === 'pulse',
        'animate-bounce': animation === 'bounce',
        'animate-float': animation === 'float',
        'animate-wiggle': animation === 'wiggle',
        'animate-heartbeat': animation === 'heartbeat',
        'animate-tada': animation === 'tada',
        'animate-swing': animation === 'swing',
      },
      
      // Gradient variants
      {
        'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700': gradient === 'primary',
        'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700': gradient === 'secondary',
        'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700': gradient === 'accent',
        'bg-gradient-to-r from-food-pizza to-food-pasta hover:from-food-meat hover:to-food-fish': gradient === 'warm',
        'bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600': gradient === 'cool',
        'bg-gradient-to-r from-food-pizza to-food-dessert hover:from-food-wine hover:to-food-cocktail': gradient === 'sunset',
        'bg-gradient-to-r from-food-fish to-accent-500 hover:from-food-fish hover:to-secondary-500': gradient === 'ocean',
        'bg-gradient-to-r from-food-salad to-secondary-500 hover:from-secondary-600 hover:to-success-600': gradient === 'forest',
        'bg-gradient-to-r from-food-pizza to-food-meat hover:from-food-meat hover:to-error-600': gradient === 'fire',
        'bg-gradient-to-r from-accent-500 to-food-wine hover:from-food-coffee hover:to-food-wine': gradient === 'royal',
        'bg-gradient-to-r from-food-dessert to-accent-500 hover:from-accent-600 hover:to-food-dessert': gradient === 'tropical',
      },
      
      // Variant styles (only apply if no gradient)
      gradient === 'none' && {
        // Primary variant
        'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500': variant === 'primary',
        
        // Secondary variant
        'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500': variant === 'secondary',
        
        // Accent variant
        'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500': variant === 'accent',
        
        // Outline variant
        'border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white focus:ring-primary-500': variant === 'outline',
        
        // Ghost variant
        'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-surface-800': variant === 'ghost',
        
        // Danger variant
        'bg-error-500 hover:bg-error-600 text-white focus:ring-error-500': variant === 'danger',
        
        // Success variant
        'bg-success-500 hover:bg-success-600 text-white focus:ring-success-500': variant === 'success',
        
        // Warning variant
        'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500': variant === 'warning',
      },
      
      // Hover effects
      'hover:shadow-xl hover:shadow-primary-500/25',
      
      className
    );

    return (
      <button
        className={baseClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        
        {/* Left icon */}
        {LeftIcon && !loading && (
          <LeftIcon className={cn(
            'mr-2',
            {
              'h-3 w-3': size === 'xs',
              'h-4 w-4': size === 'sm',
              'h-5 w-5': size === 'md',
              'h-6 w-6': size === 'lg',
              'h-7 w-7': size === 'xl',
              'h-8 w-8': size === '2xl',
            }
          )} />
        )}
        
        {/* Button content */}
        {children}
        
        {/* Right icon */}
        {RightIcon && !loading && (
          <RightIcon className={cn(
            'ml-2',
            {
              'h-3 w-3': size === 'xs',
              'h-4 w-4': size === 'sm',
              'h-5 w-5': size === 'md',
              'h-6 w-6': size === 'lg',
              'h-7 w-7': size === 'xl',
              'h-8 w-8': size === '2xl',
            }
          )} />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

