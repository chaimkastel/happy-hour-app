'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'glow-secondary' | 'glow-accent';
  animation?: 'none' | 'pulse' | 'bounce' | 'wiggle' | 'heartbeat' | 'tada' | 'swing';
  label?: string;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  description?: string;
  error?: string;
  success?: string;
  hint?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showIcon?: boolean;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  hintClassName?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      variant = 'default',
      gradient = 'none',
      rounded = 'full',
      shadow = 'none',
      animation = 'none',
      label,
      labelPosition = 'right',
      description,
      error,
      success,
      hint,
      disabled = false,
      loading = false,
      icon,
      iconPosition = 'left',
      showIcon = false,
      className,
      trackClassName,
      thumbClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      successClassName,
      hintClassName,
      id,
      ...props
    },
    ref
  ) => {
    const defaultId = useId();
    const switchId = id || defaultId;

    // Size classes
    const sizeClasses = {
      'sm': {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        icon: 'w-2 h-2',
        label: 'text-xs',
        description: 'text-xs',
      },
      'md': {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        icon: 'w-3 h-3',
        label: 'text-sm',
        description: 'text-sm',
      },
      'lg': {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        icon: 'w-4 h-4',
        label: 'text-base',
        description: 'text-sm',
      },
      'xl': {
        track: 'w-16 h-8',
        thumb: 'w-7 h-7',
        icon: 'w-5 h-5',
        label: 'text-lg',
        description: 'text-base',
      },
    };

    // Variant classes
    const variantClasses = {
      'default': 'bg-neutral-200 dark:bg-neutral-700',
      'primary': 'bg-primary-200 dark:bg-primary-800',
      'secondary': 'bg-secondary-200 dark:bg-secondary-800',
      'accent': 'bg-accent-200 dark:bg-accent-800',
      'success': 'bg-success-200 dark:bg-success-800',
      'warning': 'bg-warning-200 dark:bg-warning-800',
      'error': 'bg-error-200 dark:bg-error-800',
      'info': 'bg-blue-200 dark:bg-blue-800',
    };

    // Gradient classes
    const gradientClasses = {
      'none': '',
      'primary': 'bg-gradient-to-r from-primary-400 to-primary-600',
      'secondary': 'bg-gradient-to-r from-secondary-400 to-secondary-600',
      'accent': 'bg-gradient-to-r from-accent-400 to-accent-600',
      'warm': 'bg-gradient-to-r from-food-pizza to-food-pasta',
      'cool': 'bg-gradient-to-r from-secondary-400 to-accent-400',
      'sunset': 'bg-gradient-to-r from-food-pizza to-food-dessert',
      'ocean': 'bg-gradient-to-r from-food-fish to-accent-400',
      'forest': 'bg-gradient-to-r from-food-salad to-secondary-400',
      'fire': 'bg-gradient-to-r from-food-pizza to-food-meat',
      'royal': 'bg-gradient-to-r from-accent-400 to-food-wine',
      'tropical': 'bg-gradient-to-r from-food-dessert to-accent-400',
    };

    // Border radius classes
    const roundedClasses = {
      'none': 'rounded-none',
      'sm': 'rounded-sm',
      'md': 'rounded-md',
      'lg': 'rounded-lg',
      'xl': 'rounded-xl',
      '2xl': 'rounded-2xl',
      'full': 'rounded-full',
    };

    // Shadow classes
    const shadowClasses = {
      'none': 'shadow-none',
      'sm': 'shadow-sm',
      'md': 'shadow-md',
      'lg': 'shadow-lg',
      'xl': 'shadow-xl',
      'glow': 'shadow-glow',
      'glow-secondary': 'shadow-glow-secondary',
      'glow-accent': 'shadow-glow-accent',
    };

    // Animation classes
    const animationClasses = {
      'none': '',
      'pulse': 'animate-pulse',
      'bounce': 'animate-bounce',
      'wiggle': 'animate-wiggle',
      'heartbeat': 'animate-heartbeat',
      'tada': 'animate-tada',
      'swing': 'animate-swing',
    };

    // Active state classes
    const activeClasses = {
      'default': 'bg-neutral-600 dark:bg-neutral-400',
      'primary': 'bg-primary-600 dark:bg-primary-400',
      'secondary': 'bg-secondary-600 dark:bg-secondary-400',
      'accent': 'bg-accent-600 dark:bg-accent-400',
      'success': 'bg-success-600 dark:bg-success-400',
      'warning': 'bg-warning-600 dark:bg-warning-400',
      'error': 'bg-error-600 dark:bg-error-400',
      'info': 'bg-blue-600 dark:bg-blue-400',
    };

    const activeGradientClasses = {
      'none': '',
      'primary': 'bg-gradient-to-r from-primary-500 to-primary-700',
      'secondary': 'bg-gradient-to-r from-secondary-500 to-secondary-700',
      'accent': 'bg-gradient-to-r from-accent-500 to-accent-700',
      'warm': 'bg-gradient-to-r from-food-pizza to-food-pasta',
      'cool': 'bg-gradient-to-r from-secondary-500 to-accent-500',
      'sunset': 'bg-gradient-to-r from-food-pizza to-food-dessert',
      'ocean': 'bg-gradient-to-r from-food-fish to-accent-500',
      'forest': 'bg-gradient-to-r from-food-salad to-secondary-500',
      'fire': 'bg-gradient-to-r from-food-pizza to-food-meat',
      'royal': 'bg-gradient-to-r from-accent-500 to-food-wine',
      'tropical': 'bg-gradient-to-r from-food-dessert to-accent-500',
    };

    const trackClasses = cn(
      // Base styles
      'relative inline-flex items-center transition-all duration-300 ease-in-out',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-neutral-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Size
      sizeClasses[size].track,
      
      // Variant (only apply if no gradient)
      gradient === 'none' && variantClasses[variant],
      
      // Gradient
      gradient !== 'none' && gradientClasses[gradient],
      
      // Border radius
      roundedClasses[rounded],
      
      // Shadow
      shadowClasses[shadow],
      
      // Animation
      animationClasses[animation],
      
      trackClassName
    );

    const thumbClasses = cn(
      // Base styles
      'inline-block transition-all duration-300 ease-in-out transform',
      'bg-white dark:bg-neutral-100',
      'shadow-sm',
      
      // Size
      sizeClasses[size].thumb,
      
      // Border radius
      roundedClasses[rounded],
      
      // Position and transform
      'translate-x-0 peer-checked:translate-x-full',
      
      // Hover effect
      'hover:scale-110',
      
      thumbClassName
    );

    const labelClasses = cn(
      'font-medium text-neutral-900 dark:text-neutral-100',
      sizeClasses[size].label,
      labelClassName
    );

    const descriptionClasses = cn(
      'text-neutral-600 dark:text-neutral-400',
      sizeClasses[size].description,
      descriptionClassName
    );

    const errorClasses = cn(
      'text-error-600 dark:text-error-400',
      sizeClasses[size].description,
      errorClassName
    );

    const successClasses = cn(
      'text-success-600 dark:text-success-400',
      sizeClasses[size].description,
      successClassName
    );

    const hintClasses = cn(
      'text-neutral-500 dark:text-neutral-500',
      sizeClasses[size].description,
      hintClassName
    );

    // Layout classes based on label position
    const layoutClasses = {
      'left': 'flex-row-reverse',
      'right': 'flex-row',
      'top': 'flex-col',
      'bottom': 'flex-col-reverse',
    };

    const spacingClasses = {
      'left': 'mr-3',
      'right': 'ml-3',
      'top': 'mb-2',
      'bottom': 'mt-2',
    };

    const containerClasses = cn(
      'flex items-center',
      layoutClasses[labelPosition],
      className
    );

    const switchContainerClasses = cn(
      'flex items-center',
      spacingClasses[labelPosition]
    );

    return (
      <div className={containerClasses}>
        {/* Label */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label htmlFor={switchId} className={labelClasses}>
                {label}
              </label>
            )}
            {description && (
              <p className={cn('mt-1', descriptionClasses)}>
                {description}
              </p>
            )}
            {error && (
              <p className={cn('mt-1', errorClasses)}>
                {error}
              </p>
            )}
            {success && (
              <p className={cn('mt-1', successClasses)}>
                {success}
              </p>
            )}
            {hint && (
              <p className={cn('mt-1', hintClasses)}>
                {hint}
              </p>
            )}
          </div>
        )}

        {/* Switch */}
        <div className={switchContainerClasses}>
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              className="peer sr-only"
              disabled={disabled || loading}
              {...props}
            />
            
            <label
              htmlFor={switchId}
              className={cn(
                trackClasses,
                'peer-checked:bg-opacity-100',
                'peer-checked:bg-opacity-100',
                'cursor-pointer'
              )}
            >
              {/* Active state background */}
              <div
                className={cn(
                  'absolute inset-0 transition-all duration-300 ease-in-out opacity-0',
                  'peer-checked:opacity-100',
                  gradient === 'none' ? activeClasses[variant] : activeGradientClasses[gradient],
                  roundedClasses[rounded]
                )}
              />
              
              {/* Thumb */}
              <div className={thumbClasses}>
                {/* Icon */}
                {showIcon && icon && (
                  <div className={cn(
                    'flex items-center justify-center w-full h-full',
                    'peer-checked:opacity-100 opacity-0 transition-opacity duration-300',
                    sizeClasses[size].icon
                  )}>
                    {icon}
                  </div>
                )}
                
                {/* Loading spinner */}
                {loading && (
                  <div className={cn(
                    'flex items-center justify-center w-full h-full',
                    'animate-spin rounded-full border-2 border-current border-t-transparent',
                    sizeClasses[size].icon
                  )} />
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

// Switch group for multiple switches
export interface SwitchGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const SwitchGroup = React.forwardRef<HTMLDivElement, SwitchGroupProps>(
  ({ className, orientation = 'vertical', spacing = 'normal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex',
        {
          'flex-col': orientation === 'vertical',
          'flex-row flex-wrap': orientation === 'horizontal',
          'space-y-2': orientation === 'vertical' && spacing === 'tight',
          'space-y-3': orientation === 'vertical' && spacing === 'normal',
          'space-y-4': orientation === 'vertical' && spacing === 'loose',
          'space-x-2': orientation === 'horizontal' && spacing === 'tight',
          'space-x-3': orientation === 'horizontal' && spacing === 'normal',
          'space-x-4': orientation === 'horizontal' && spacing === 'loose',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

SwitchGroup.displayName = 'SwitchGroup';

// Switch item for group
export interface SwitchItemProps extends SwitchProps {
  label?: string;
  description?: string;
}

export const SwitchItem = React.forwardRef<HTMLInputElement, SwitchItemProps>(
  ({ className, label, description, ...props }, ref) => (
    <div className={cn('flex-1', className)}>
      <Switch
        ref={ref}
        label={label}
        description={description}
        {...props}
      />
    </div>
  )
);

SwitchItem.displayName = 'SwitchItem';

export { Switch };

