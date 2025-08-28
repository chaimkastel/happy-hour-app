'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'dashed' | 'dotted' | 'double' | 'gradient' | 'pattern';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  pattern?: 'dots' | 'lines' | 'circles' | 'squares' | 'triangles' | 'stars';
  spacing?: 'tight' | 'normal' | 'loose';
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
  labelSize?: 'sm' | 'md' | 'lg';
  labelColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  showLabel?: boolean;
  className?: string;
  lineClassName?: string;
  labelClassName?: string;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      size = 'md',
      variant = 'solid',
      color = 'neutral',
      gradient = 'none',
      pattern = 'dots',
      spacing = 'normal',
      label,
      labelPosition = 'center',
      labelSize = 'md',
      labelColor = 'neutral',
      showLabel = false,
      className,
      lineClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      'xs': {
        horizontal: 'h-px',
        vertical: 'w-px',
        label: 'text-xs',
        spacing: 'my-2',
      },
      'sm': {
        horizontal: 'h-0.5',
        vertical: 'w-0.5',
        label: 'text-sm',
        spacing: 'my-3',
      },
      'md': {
        horizontal: 'h-1',
        vertical: 'w-1',
        label: 'text-base',
        spacing: 'my-4',
      },
      'lg': {
        horizontal: 'h-1.5',
        vertical: 'w-1.5',
        label: 'text-lg',
        spacing: 'my-6',
      },
      'xl': {
        horizontal: 'h-2',
        vertical: 'w-2',
        label: 'text-xl',
        spacing: 'my-8',
      },
    };

    // Spacing classes
    const spacingClasses = {
      'tight': {
        horizontal: 'my-1',
        vertical: 'mx-1',
      },
      'normal': {
        horizontal: 'my-4',
        vertical: 'mx-4',
      },
      'loose': {
        horizontal: 'my-8',
        vertical: 'mx-8',
      },
    };

    // Variant classes
    const variantClasses = {
      'solid': '',
      'dashed': 'border-dashed',
      'dotted': 'border-dotted',
      'double': 'border-double',
      'gradient': '',
      'pattern': '',
    };

    // Color classes
    const colorClasses = {
      'primary': 'border-primary-300 dark:border-primary-600',
      'secondary': 'border-secondary-300 dark:border-secondary-600',
      'accent': 'border-accent-300 dark:border-accent-600',
      'success': 'border-success-300 dark:border-success-600',
      'warning': 'border-warning-300 dark:border-warning-600',
      'error': 'border-error-300 dark:border-error-600',
      'info': 'border-blue-300 dark:border-blue-600',
      'neutral': 'border-neutral-300 dark:border-neutral-600',
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

    // Pattern classes
    const patternClasses = {
      'dots': 'bg-repeat-x bg-[length:8px_8px] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)]',
      'lines': 'bg-repeat-x bg-[length:8px_8px] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px)]',
      'circles': 'bg-repeat-x bg-[length:12px_12px] bg-[radial-gradient(circle,currentColor_2px,transparent_2px)]',
      'squares': 'bg-repeat-x bg-[length:8px_8px] bg-[linear-gradient(45deg,currentColor_25%,transparent_25%,transparent_75%,currentColor_75%)]',
      'triangles': 'bg-repeat-x bg-[length:12px_12px] bg-[linear-gradient(45deg,transparent_30%,currentColor_30%,currentColor_70%,transparent_70%)]',
      'stars': 'bg-repeat-x bg-[length:16px_16px] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)]',
    };

    // Label color classes
    const labelColorClasses = {
      'primary': 'text-primary-600 dark:text-primary-400',
      'secondary': 'text-secondary-600 dark:text-secondary-400',
      'accent': 'text-accent-600 dark:text-accent-400',
      'success': 'text-success-600 dark:text-success-400',
      'warning': 'text-warning-600 dark:text-warning-400',
      'error': 'text-error-600 dark:text-error-400',
      'info': 'text-blue-600 dark:text-blue-400',
      'neutral': 'text-neutral-600 dark:text-neutral-400',
    };

    // Label position classes
    const labelPositionClasses = {
      'left': 'justify-start',
      'center': 'justify-center',
      'right': 'justify-end',
    };

    const containerClasses = cn(
      'flex items-center',
      {
        'flex-row': orientation === 'horizontal',
        'flex-col': orientation === 'vertical',
      },
      spacingClasses[spacing][orientation],
      className
    );

    const lineClasses = cn(
      // Base styles
      'flex-shrink-0',
      
      // Size
      orientation === 'horizontal' ? sizeClasses[size].horizontal : sizeClasses[size].vertical,
      
      // Variant
      variantClasses[variant],
      
      // Color (only apply if no gradient and no pattern)
      variant !== 'gradient' && variant !== 'pattern' && colorClasses[color],
      
      // Gradient
      variant === 'gradient' && gradientClasses[gradient],
      
      // Pattern
      variant === 'pattern' && patternClasses[pattern],
      
      // Border styles for non-gradient/pattern variants
      variant !== 'gradient' && variant !== 'pattern' && 'border-t',
      
      lineClassName
    );

    const labelClasses = cn(
      'px-3 font-medium',
      sizeClasses[size].label,
      labelColorClasses[labelColor],
      labelClassName
    );

    // Render horizontal divider
    if (orientation === 'horizontal') {
      if (showLabel && label) {
        return (
          <div ref={ref} className={containerClasses} {...props}>
            <div className={cn('flex-1', lineClasses)} />
            <span className={labelClasses}>{label}</span>
            <div className={cn('flex-1', lineClasses)} />
          </div>
        );
      }

      return (
        <div ref={ref} className={containerClasses} {...props}>
          <div className={cn('w-full', lineClasses)} />
        </div>
      );
    }

    // Render vertical divider
    if (showLabel && label) {
      return (
        <div ref={ref} className={containerClasses} {...props}>
          <div className={cn('flex-1', lineClasses)} />
          <span className={cn(labelClasses, 'py-2')}>{label}</span>
          <div className={cn('flex-1', lineClasses)} />
        </div>
      );
    }

    return (
      <div ref={ref} className={containerClasses} {...props}>
        <div className={cn('h-full', lineClasses)} />
      </div>
    );
  }
);

Divider.displayName = 'Divider';

// Divider with label component
export interface DividerWithLabelProps extends DividerProps {
  label: string;
  labelPosition?: 'left' | 'center' | 'right';
  labelSize?: 'sm' | 'md' | 'lg';
  labelColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export const DividerWithLabel = React.forwardRef<HTMLDivElement, DividerWithLabelProps>(
  ({ className, label, ...props }, ref) => (
    <Divider
      ref={ref}
      label={label}
      showLabel={true}
      className={className}
      {...props}
    />
  )
);

DividerWithLabel.displayName = 'DividerWithLabel';

// Divider group for multiple dividers
export interface DividerGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const DividerGroup = React.forwardRef<HTMLDivElement, DividerGroupProps>(
  ({ className, orientation = 'horizontal', spacing = 'normal', children, ...props }, ref) => {
    const spacingClasses = {
      'tight': {
        horizontal: 'space-y-1',
        vertical: 'space-x-1',
      },
      'normal': {
        horizontal: 'space-y-4',
        vertical: 'space-x-4',
      },
      'loose': {
        horizontal: 'space-y-8',
        vertical: 'space-x-8',
      },
    };

    const containerClasses = cn(
      'flex',
      {
        'flex-col': orientation === 'horizontal',
        'flex-row': orientation === 'vertical',
      },
      spacingClasses[spacing][orientation],
      className
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {children}
      </div>
    );
  }
);

DividerGroup.displayName = 'DividerGroup';

// Divider item for group
export interface DividerItemProps extends DividerProps {
  label?: string;
}

export const DividerItem = React.forwardRef<HTMLDivElement, DividerItemProps>(
  ({ className, label, ...props }, ref) => (
    <div className={cn('flex-1', className)}>
      <Divider
        ref={ref}
        label={label}
        showLabel={!!label}
        {...props}
      />
    </div>
  )
);

DividerItem.displayName = 'DividerItem';

// Section divider component
export interface SectionDividerProps extends DividerProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  iconClassName?: string;
  actionClassName?: string;
}

export const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  ({ 
    className, 
    titleClassName,
    subtitleClassName,
    iconClassName,
    actionClassName,
    title, 
    subtitle, 
    icon, 
    action, 
    ...props 
  }, ref) => {
    const containerClasses = cn(
      'flex items-center gap-4',
      className
    );

    const titleClasses = cn(
      'text-lg font-semibold text-neutral-900 dark:text-neutral-100',
      titleClassName
    );

    const subtitleClasses = cn(
      'text-sm text-neutral-600 dark:text-neutral-400',
      subtitleClassName
    );

    const iconClasses = cn(
      'text-neutral-400 dark:text-neutral-500',
      iconClassName
    );

    const actionClasses = cn(
      'ml-auto',
      actionClassName
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          {title && <h3 className={titleClasses}>{title}</h3>}
          {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
        </div>
        
        {action && (
          <div className={actionClasses}>
            {action}
          </div>
        )}
        
        <Divider className="flex-1" />
      </div>
    );
  }
);

SectionDivider.displayName = 'SectionDivider';

export { Divider };

