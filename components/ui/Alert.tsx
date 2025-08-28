'use client';

import React, { forwardRef, useState } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'glow-secondary' | 'glow-accent';
  animation?: 'none' | 'pulse' | 'bounce' | 'wiggle' | 'heartbeat' | 'tada' | 'swing' | 'slide-in' | 'fade-in';
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  showIcon?: boolean;
  showBorder?: boolean;
  showBackground?: boolean;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
  dismissButtonClassName?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'default',
      size = 'md',
      color = 'primary',
      gradient = 'none',
      rounded = 'lg',
      shadow = 'none',
      animation = 'none',
      icon,
      title,
      description,
      action,
      dismissible = false,
      onDismiss,
      autoDismiss = false,
      autoDismissDelay = 5000,
      showIcon = true,
      showBorder = true,
      showBackground = true,
      className,
      iconClassName,
      titleClassName,
      descriptionClassName,
      actionClassName,
      dismissButtonClassName,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    // Size classes
    const sizeClasses = {
      'sm': {
        container: 'p-3',
        icon: 'w-4 h-4',
        title: 'text-sm',
        description: 'text-xs',
        action: 'text-xs',
      },
      'md': {
        container: 'p-4',
        icon: 'w-5 h-5',
        title: 'text-base',
        description: 'text-sm',
        action: 'text-sm',
      },
      'lg': {
        container: 'p-6',
        icon: 'w-6 h-6',
        title: 'text-lg',
        description: 'text-base',
        action: 'text-base',
      },
    };

    // Variant classes
    const variantClasses = {
      'default': {
        icon: <Info className="w-5 h-5" />,
        color: 'info',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        iconColor: 'text-blue-500 dark:text-blue-400',
      },
      'info': {
        icon: <Info className="w-5 h-5" />,
        color: 'info',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        iconColor: 'text-blue-500 dark:text-blue-400',
      },
      'success': {
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'success',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        iconColor: 'text-green-500 dark:text-green-400',
      },
      'warning': {
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'warning',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-800 dark:text-yellow-200',
        iconColor: 'text-yellow-500 dark:text-yellow-400',
      },
      'error': {
        icon: <XCircle className="w-5 h-5" />,
        color: 'error',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        iconColor: 'text-red-500 dark:text-red-400',
      },
      'destructive': {
        icon: <XCircle className="w-5 h-5" />,
        color: 'error',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        iconColor: 'text-red-500 dark:text-red-400',
      },
    };

    // Color classes
    const colorClasses = {
      'primary': {
        bg: 'bg-primary-50 dark:bg-primary-900/20',
        border: 'border-primary-200 dark:border-primary-800',
        text: 'text-primary-800 dark:text-primary-200',
        iconColor: 'text-primary-500 dark:text-primary-400',
      },
      'secondary': {
        bg: 'bg-secondary-50 dark:bg-secondary-900/20',
        border: 'border-secondary-200 dark:border-secondary-800',
        text: 'text-secondary-800 dark:text-secondary-200',
        iconColor: 'text-secondary-500 dark:text-secondary-400',
      },
      'accent': {
        bg: 'bg-accent-50 dark:bg-accent-900/20',
        border: 'border-accent-200 dark:border-accent-800',
        text: 'text-accent-800 dark:text-accent-200',
        iconColor: 'text-accent-500 dark:text-accent-400',
      },
      'success': {
        bg: 'bg-success-50 dark:bg-success-900/20',
        border: 'border-success-200 dark:border-success-800',
        text: 'text-success-800 dark:text-success-200',
        iconColor: 'text-success-500 dark:text-success-400',
      },
      'warning': {
        bg: 'bg-warning-50 dark:bg-warning-900/20',
        border: 'border-warning-200 dark:border-warning-800',
        text: 'text-warning-800 dark:text-warning-200',
        iconColor: 'text-warning-500 dark:text-warning-400',
      },
      'error': {
        bg: 'bg-error-50 dark:bg-error-900/20',
        border: 'border-error-200 dark:border-error-800',
        text: 'text-error-800 dark:text-error-200',
        iconColor: 'text-error-500 dark:text-error-400',
      },
      'info': {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        iconColor: 'text-blue-500 dark:text-blue-400',
      },
      'neutral': {
        bg: 'bg-neutral-50 dark:bg-neutral-900/20',
        border: 'border-neutral-200 dark:border-neutral-800',
        text: 'text-neutral-800 dark:text-neutral-200',
        iconColor: 'text-neutral-500 dark:text-neutral-400',
      },
    };

    // Gradient classes
    const gradientClasses = {
      'none': '',
      'primary': 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20',
      'secondary': 'bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20',
      'accent': 'bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20',
      'warm': 'bg-gradient-to-r from-food-pizza/10 to-food-pasta/10 dark:from-food-pizza/20 dark:to-food-pasta/20',
      'cool': 'bg-gradient-to-r from-secondary-50 to-accent-50 dark:from-secondary-900/20 dark:to-accent-900/20',
      'sunset': 'bg-gradient-to-r from-food-pizza/10 to-food-dessert/10 dark:from-food-pizza/20 dark:to-food-dessert/20',
      'ocean': 'bg-gradient-to-r from-food-fish/10 to-accent-50 dark:from-food-fish/20 dark:to-accent-900/20',
      'forest': 'bg-gradient-to-r from-food-salad/10 to-secondary-50 dark:from-food-salad/20 dark:to-secondary-900/20',
      'fire': 'bg-gradient-to-r from-food-pizza/10 to-food-meat/10 dark:from-food-pizza/20 dark:to-food-meat/20',
      'royal': 'bg-gradient-to-r from-accent-50 to-food-wine/10 dark:from-accent-900/20 dark:to-food-wine/20',
      'tropical': 'bg-gradient-to-r from-food-dessert/10 to-accent-50 dark:from-food-dessert/20 dark:to-accent-900/20',
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
      'slide-in': 'animate-slide-in',
      'fade-in': 'animate-fade-in',
    };

    // Get current variant data
    const currentVariant = variantClasses[variant];
    const currentColor = colorClasses[color];

    // Auto-dismiss functionality
    React.useEffect(() => {
      if (autoDismiss && autoDismissDelay > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, autoDismissDelay);

        return () => clearTimeout(timer);
      }
    }, [autoDismiss, autoDismissDelay]);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    const containerClasses = cn(
      // Base styles
      'relative flex items-start gap-3 transition-all duration-200',
      
      // Size
      sizeClasses[size].container,
      
      // Background
      showBackground && (
        gradient === 'none' 
          ? (variant === 'default' ? currentColor.bg : currentVariant.bg)
          : gradientClasses[gradient]
      ),
      
      // Border
      showBorder && (
        gradient === 'none'
          ? (variant === 'default' ? currentColor.border : currentVariant.border)
          : 'border border-neutral-200 dark:border-neutral-700'
      ),
      
      // Border radius
      roundedClasses[rounded],
      
      // Shadow
      shadowClasses[shadow],
      
      // Animation
      animationClasses[animation],
      
      className
    );

    const iconClasses = cn(
      'flex-shrink-0',
      sizeClasses[size].icon,
      gradient === 'none'
        ? (variant === 'default' ? currentColor.iconColor : currentVariant.iconColor)
        : 'text-neutral-500 dark:text-neutral-400',
      iconClassName
    );

    const titleClasses = cn(
      'font-semibold',
      sizeClasses[size].title,
      gradient === 'none'
        ? (variant === 'default' ? currentColor.text : currentVariant.text)
        : 'text-neutral-900 dark:text-neutral-100',
      titleClassName
    );

    const descriptionClasses = cn(
      'mt-1',
      sizeClasses[size].description,
      gradient === 'none'
        ? (variant === 'default' ? currentColor.text : currentVariant.text)
        : 'text-neutral-700 dark:text-neutral-300',
      descriptionClassName
    );

    const actionClasses = cn(
      'mt-3',
      sizeClasses[size].action,
      actionClassName
    );

    const dismissButtonClasses = cn(
      'flex-shrink-0 p-1 rounded-md transition-colors duration-200',
      'hover:bg-black/10 dark:hover:bg-white/10',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current',
      dismissButtonClassName
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {/* Icon */}
        {showIcon && (
          <div className={iconClasses}>
            {icon || currentVariant.icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={titleClasses}>{title}</h4>
          )}
          {description && (
            <p className={descriptionClasses}>{description}</p>
          )}
          {action && (
            <div className={actionClasses}>
              {action}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            className={dismissButtonClasses}
            onClick={handleDismiss}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

// Alert group for multiple alerts
export interface AlertGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const AlertGroup = React.forwardRef<HTMLDivElement, AlertGroupProps>(
  ({ className, orientation = 'vertical', spacing = 'normal', children, ...props }, ref) => {
    const spacingClasses = {
      'tight': {
        horizontal: 'space-x-2',
        vertical: 'space-y-2',
      },
      'normal': {
        horizontal: 'space-x-4',
        vertical: 'space-y-4',
      },
      'loose': {
        horizontal: 'space-x-6',
        vertical: 'space-y-6',
      },
    };

    const containerClasses = cn(
      'flex',
      {
        'flex-row': orientation === 'horizontal',
        'flex-col': orientation === 'vertical',
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

AlertGroup.displayName = 'AlertGroup';

// Alert item for group
export interface AlertItemProps extends AlertProps {
  className?: string;
}

export const AlertItem = React.forwardRef<HTMLDivElement, AlertItemProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('flex-1', className)}>
      <Alert ref={ref} {...props} />
    </div>
  )
);

AlertItem.displayName = 'AlertItem';

// Alert with title component
export interface AlertWithTitleProps extends AlertProps {
  title: string;
  description?: string;
}

export const AlertWithTitle = React.forwardRef<HTMLDivElement, AlertWithTitleProps>(
  ({ className, title, description, ...props }, ref) => (
    <Alert
      ref={ref}
      title={title}
      description={description}
      className={className}
      {...props}
    />
  )
);

AlertWithTitle.displayName = 'AlertWithTitle';

// Alert with action component
export interface AlertWithActionProps extends AlertProps {
  action: React.ReactNode;
}

export const AlertWithAction = React.forwardRef<HTMLDivElement, AlertWithActionProps>(
  ({ className, action, ...props }, ref) => (
    <Alert
      ref={ref}
      action={action}
      className={className}
      {...props}
    />
  )
);

AlertWithAction.displayName = 'AlertWithAction';

// Alert with dismiss button component
export interface AlertWithDismissProps extends AlertProps {
  onDismiss: () => void;
}

export const AlertWithDismiss = React.forwardRef<HTMLDivElement, AlertWithDismissProps>(
  ({ className, onDismiss, ...props }, ref) => (
    <Alert
      ref={ref}
      dismissible={true}
      onDismiss={onDismiss}
      className={className}
      {...props}
    />
  )
);

AlertWithDismiss.displayName = 'AlertWithDismiss';

export { Alert };

