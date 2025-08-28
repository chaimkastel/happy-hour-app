'use client';

import React, { forwardRef, useId } from 'react';
import { Check, Minus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
  indeterminate?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  hintClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      variant = 'default',
      gradient = 'none',
      rounded = 'md',
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
      indeterminate = false,
      showIcon = true,
      icon,
      className,
      inputClassName,
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
    const checkboxId = id || defaultId;

    // Size classes
    const sizeClasses = {
      'sm': {
        checkbox: 'w-4 h-4',
        icon: 'w-2.5 h-2.5',
        label: 'text-xs',
        description: 'text-xs',
      },
      'md': {
        checkbox: 'w-5 h-5',
        icon: 'w-3 h-3',
        label: 'text-sm',
        description: 'text-sm',
      },
      'lg': {
        checkbox: 'w-6 h-6',
        icon: 'w-4 h-4',
        label: 'text-base',
        description: 'text-sm',
      },
      'xl': {
        checkbox: 'w-7 h-7',
        icon: 'w-5 h-5',
        label: 'text-lg',
        description: 'text-base',
      },
    };

    // Variant classes
    const variantClasses = {
      'default': 'border-neutral-300 dark:border-neutral-600',
      'primary': 'border-primary-300 dark:border-primary-600',
      'secondary': 'border-secondary-300 dark:border-secondary-600',
      'accent': 'border-accent-300 dark:border-accent-600',
      'success': 'border-success-300 dark:border-success-600',
      'warning': 'border-warning-300 dark:border-warning-600',
      'error': 'border-error-300 dark:border-error-600',
      'info': 'border-blue-300 dark:border-blue-600',
    };

    // Gradient classes
    const gradientClasses = {
      'none': '',
      'primary': 'border-primary-400',
      'secondary': 'border-secondary-400',
      'accent': 'border-accent-400',
      'warm': 'border-food-pizza',
      'cool': 'border-secondary-400',
      'sunset': 'border-food-pizza',
      'ocean': 'border-food-fish',
      'forest': 'border-food-salad',
      'fire': 'border-food-pizza',
      'royal': 'border-accent-400',
      'tropical': 'border-food-dessert',
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
      'default': 'bg-neutral-600 dark:bg-neutral-400 border-neutral-600 dark:border-neutral-400',
      'primary': 'bg-primary-600 dark:bg-primary-400 border-primary-600 dark:border-primary-400',
      'secondary': 'bg-secondary-600 dark:bg-secondary-400 border-secondary-600 dark:border-secondary-400',
      'accent': 'bg-accent-600 dark:bg-accent-400 border-accent-600 dark:border-accent-400',
      'success': 'bg-success-600 dark:bg-success-400 border-success-600 dark:border-success-400',
      'warning': 'bg-warning-600 dark:bg-warning-400 border-warning-600 dark:border-warning-400',
      'error': 'bg-error-600 dark:bg-error-400 border-error-600 dark:border-error-400',
      'info': 'bg-blue-600 dark:bg-blue-400 border-blue-600 dark:border-blue-400',
    };

    const activeGradientClasses = {
      'none': '',
      'primary': 'bg-gradient-to-br from-primary-500 to-primary-700 border-primary-500',
      'secondary': 'bg-gradient-to-br from-secondary-500 to-secondary-700 border-secondary-500',
      'accent': 'bg-gradient-to-br from-accent-500 to-accent-700 border-accent-500',
      'warm': 'bg-gradient-to-br from-food-pizza to-food-pasta border-food-pizza',
      'cool': 'bg-gradient-to-br from-secondary-500 to-accent-500 border-secondary-500',
      'sunset': 'bg-gradient-to-br from-food-pizza to-food-dessert border-food-pizza',
      'ocean': 'bg-gradient-to-br from-food-fish to-accent-500 border-food-fish',
      'forest': 'bg-gradient-to-br from-food-salad to-secondary-500 border-food-salad',
      'fire': 'bg-gradient-to-br from-food-pizza to-food-meat border-food-pizza',
      'royal': 'bg-gradient-to-br from-accent-500 to-food-wine border-accent-500',
      'tropical': 'bg-gradient-to-br from-food-dessert to-accent-500 border-food-dessert',
    };

    const checkboxClasses = cn(
      // Base styles
      'relative inline-flex items-center justify-center transition-all duration-200 ease-in-out',
      'border-2 bg-white dark:bg-neutral-800',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-neutral-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'peer',
      
      // Size
      sizeClasses[size].checkbox,
      
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
      
      // Hover states
      'hover:border-primary-400 dark:hover:border-primary-500',
      'hover:shadow-md',
      
      // Checked states
      'peer-checked:border-transparent',
      'peer-checked:shadow-lg',
      
      // Indeterminate states
      'peer-indeterminate:border-transparent',
      'peer-indeterminate:shadow-lg',
      
      inputClassName
    );

    const labelClasses = cn(
      'font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer select-none',
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
      'flex items-start',
      layoutClasses[labelPosition],
      className
    );

    const checkboxContainerClasses = cn(
      'flex-shrink-0',
      spacingClasses[labelPosition]
    );

    const labelContainerClasses = cn(
      'flex-1',
      {
        'text-right': labelPosition === 'left',
        'text-center': labelPosition === 'top' || labelPosition === 'bottom',
      }
    );

    return (
      <div className={containerClasses}>
        {/* Checkbox */}
        <div className={checkboxContainerClasses}>
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="peer sr-only"
              disabled={disabled || loading}
              {...props}
            />
            
            <label
              htmlFor={checkboxId}
              className={cn(
                checkboxClasses,
                'cursor-pointer',
                'peer-checked:bg-opacity-100',
                'peer-indeterminate:bg-opacity-100'
              )}
            >
              {/* Active state background */}
              <div
                className={cn(
                  'absolute inset-0 transition-all duration-200 ease-in-out opacity-0',
                  'peer-checked:opacity-100 peer-indeterminate:opacity-100',
                  gradient === 'none' ? activeClasses[variant] : activeGradientClasses[gradient],
                  roundedClasses[rounded]
                )}
              />
              
              {/* Icon */}
              {showIcon && (
                <div className={cn(
                  'relative z-10 text-white transition-all duration-200',
                  'peer-checked:opacity-100 peer-indeterminate:opacity-100 opacity-0',
                  sizeClasses[size].icon
                )}>
                  {indeterminate ? (
                    <Minus className="w-full h-full" />
                  ) : icon ? (
                    icon
                  ) : (
                    <Check className="w-full h-full" />
                  )}
                </div>
              )}
              
              {/* Loading spinner */}
              {loading && (
                <div className={cn(
                  'absolute inset-0 flex items-center justify-center',
                  'peer-checked:opacity-100 peer-indeterminate:opacity-100 opacity-0',
                  sizeClasses[size].icon
                )}>
                  <Loader2 className="w-full h-full animate-spin text-white" />
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Label and description */}
        {(label || description) && (
          <div className={labelContainerClasses}>
            {label && (
              <label htmlFor={checkboxId} className={labelClasses}>
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
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Checkbox group for multiple checkboxes
export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
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

CheckboxGroup.displayName = 'CheckboxGroup';

// Checkbox item for group
export interface CheckboxItemProps extends CheckboxProps {
  label?: string;
  description?: string;
}

export const CheckboxItem = React.forwardRef<HTMLInputElement, CheckboxItemProps>(
  ({ className, label, description, ...props }, ref) => (
    <div className={cn('flex-1', className)}>
      <Checkbox
        ref={ref}
        label={label}
        description={description}
        {...props}
      />
    </div>
  )
);

CheckboxItem.displayName = 'CheckboxItem';

export { Checkbox };

