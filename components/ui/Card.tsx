'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'bordered' | 'flat';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: 'none' | 'lift' | 'glow' | 'scale' | 'rotate' | 'bounce';
  animation?: 'none' | 'fade-in' | 'slide-in-up' | 'slide-in-left' | 'scale-in' | 'bounce-in';
  delay?: number;
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow' | 'glow-secondary' | 'glow-accent';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  interactive?: boolean;
  loading?: boolean;
  skeleton?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      hover = 'none',
      animation = 'none',
      delay = 0,
      gradient = 'none',
      shadow = 'lg',
      rounded = 'xl',
      interactive = false,
      loading = false,
      skeleton = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'relative overflow-hidden transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
      
      // Size variants
      {
        'p-3': size === 'sm',
        'p-6': size === 'md',
        'p-8': size === 'lg',
        'p-10': size === 'xl',
      },
      
      // Variant styles
      {
        // Default variant
        'bg-white dark:bg-surface-800 border border-neutral-200/50 dark:border-neutral-700/50': variant === 'default',
        
        // Elevated variant
        'bg-white dark:bg-surface-800 border-0': variant === 'elevated',
        
        // Glass variant
        'bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl border border-white/30 dark:border-surface-700/30': variant === 'glass',
        
        // Gradient variant
        'border-0': variant === 'gradient',
        
        // Bordered variant
        'bg-transparent border-2 border-neutral-300 dark:border-neutral-600': variant === 'bordered',
        
        // Flat variant
        'bg-neutral-100 dark:bg-surface-700 border-0': variant === 'flat',
      },
      
      // Gradient styles
      {
        'bg-gradient-to-br from-primary-500 to-primary-600': gradient === 'primary',
        'bg-gradient-to-br from-secondary-500 to-secondary-600': gradient === 'secondary',
        'bg-gradient-to-br from-accent-500 to-accent-600': gradient === 'accent',
        'bg-gradient-to-br from-food-pizza to-food-pasta': gradient === 'warm',
        'bg-gradient-to-br from-secondary-500 to-accent-500': gradient === 'cool',
        'bg-gradient-to-br from-food-pizza to-food-dessert': gradient === 'sunset',
        'bg-gradient-to-br from-food-fish to-accent-500': gradient === 'ocean',
        'bg-gradient-to-br from-food-salad to-secondary-500': gradient === 'forest',
        'bg-gradient-to-br from-food-pizza to-food-meat': gradient === 'fire',
        'bg-gradient-to-br from-accent-500 to-food-wine': gradient === 'royal',
        'bg-gradient-to-br from-food-dessert to-accent-500': gradient === 'tropical',
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
      
      // Border radius
      {
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-xl': rounded === 'xl',
        'rounded-2xl': rounded === '2xl',
        'rounded-3xl': rounded === '3xl',
        'rounded-full': rounded === 'full',
      },
      
      // Hover effects
      {
        'hover:transform hover:-translate-y-1': hover === 'lift',
        'hover:shadow-glow': hover === 'glow',
        'hover:scale-105': hover === 'scale',
        'hover:rotate-1': hover === 'rotate',
        'hover:animate-bounce': hover === 'bounce',
      },
      
      // Interactive styles
      {
        'cursor-pointer': interactive,
        'hover:shadow-xl': interactive && shadow !== 'none',
      },
      
      // Animation variants
      {
        'animate-fade-in': animation === 'fade-in',
        'animate-slide-in-up': animation === 'slide-in-up',
        'animate-slide-in-left': animation === 'slide-in-left',
        'animate-scale-in': animation === 'scale-in',
        'animate-bounce-in': animation === 'bounce-in',
      },
      
      // Loading and skeleton states
      {
        'animate-pulse': loading || skeleton,
      },
      
      className
    );

    const animationDelay = delay > 0 ? { animationDelay: `${delay}ms` } : {};

    return (
      <div
        className={baseClasses}
        ref={ref}
        style={animationDelay}
        {...props}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          </div>
        )}
        
        {/* Skeleton loading */}
        {skeleton && (
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/6 animate-pulse" />
          </div>
        )}
        
        {/* Card content */}
        {!loading && !skeleton && children}
        
        {/* Interactive overlay */}
        {interactive && (
          <div className="absolute inset-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 pointer-events-none" />
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'loose';
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, spacing = 'normal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5',
        {
          'space-y-1': spacing === 'tight',
          'space-y-1.5': spacing === 'normal',
          'space-y-2': spacing === 'loose',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size = 'md', children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-semibold leading-none tracking-tight',
        {
          'text-sm': size === 'sm',
          'text-base': size === 'md',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
        },
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size = 'md', children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-neutral-600 dark:text-neutral-400',
        {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'loose';
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, spacing = 'normal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'pt-0',
        {
          'space-y-2': spacing === 'tight',
          'space-y-4': spacing === 'normal',
          'space-y-6': spacing === 'loose',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'loose';
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, spacing = 'normal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center pt-0',
        {
          'space-x-2': spacing === 'tight',
          'space-x-4': spacing === 'normal',
          'space-x-6': spacing === 'loose',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export { Card };

