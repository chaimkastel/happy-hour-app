'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
  variant?: 'default' | 'filled' | 'outline' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'none' | 'fade' | 'scale' | 'slide' | 'bounce' | 'flip';
  delay?: number;
  showArrow?: boolean;
  arrowSize?: 'sm' | 'md' | 'lg';
  maxWidth?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'glow-secondary' | 'glow-accent';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  interactive?: boolean;
  showOnHover?: boolean;
  showOnFocus?: boolean;
  showOnClick?: boolean;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      position = 'top',
      variant = 'default',
      size = 'md',
      animation = 'fade',
      delay = 200,
      showArrow = true,
      arrowSize = 'md',
      maxWidth = '200px',
      shadow = 'lg',
      gradient = 'none',
      rounded = 'lg',
      className,
      contentClassName,
      disabled = false,
      interactive = false,
      showOnHover = true,
      showOnFocus = true,
      showOnClick = false,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Show tooltip with delay
    const showTooltip = () => {
      if (disabled) return;
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        setIsMounted(true);
      }, delay);
    };

    // Hide tooltip immediately
    const hideTooltip = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(false);
      setTimeout(() => setIsMounted(false), 300); // Wait for exit animation
    };

    // Handle mouse events
    const handleMouseEnter = () => {
      if (showOnHover) showTooltip();
    };

    const handleMouseLeave = () => {
      if (showOnHover && !interactive) hideTooltip();
    };

    // Handle focus events
    const handleFocus = () => {
      if (showOnFocus) showTooltip();
    };

    const handleBlur = () => {
      if (showOnFocus) hideTooltip();
    };

    // Handle click events
    const handleClick = () => {
      if (showOnClick) {
        if (isVisible) {
          hideTooltip();
        } else {
          showTooltip();
        }
      }
    };

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isVisible) {
          hideTooltip();
        }
      };

      if (isVisible) {
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isVisible]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    if (disabled) {
      return <div className={className}>{children}</div>;
    }

    const positionClasses = {
      'top': 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      'top-start': 'bottom-full left-0 mb-2',
      'top-end': 'bottom-full right-0 mb-2',
      'bottom': 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      'bottom-start': 'top-full left-0 mt-2',
      'bottom-end': 'top-full right-0 mt-2',
      'left': 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      'left-start': 'right-full top-0 mr-2',
      'left-end': 'right-full bottom-0 mr-2',
      'right': 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      'right-start': 'left-full top-0 ml-2',
      'right-end': 'left-full bottom-0 ml-2',
    };

    const arrowPositionClasses = {
      'top': 'top-full left-1/2 transform -translate-x-1/2 border-t border-current',
      'top-start': 'top-full left-4 border-t border-current',
      'top-end': 'top-full right-4 border-t border-current',
      'bottom': 'bottom-full left-1/2 transform -translate-x-1/2 border-b border-current',
      'bottom-start': 'bottom-full left-4 border-b border-current',
      'bottom-end': 'bottom-full right-4 border-b border-current',
      'left': 'left-full top-1/2 transform -translate-y-1/2 border-l border-current',
      'left-start': 'left-full top-4 border-l border-current',
      'left-end': 'left-full bottom-4 border-l border-current',
      'right': 'right-full top-1/2 transform -translate-y-1/2 border-r border-current',
      'right-start': 'right-full top-4 border-r border-current',
      'right-end': 'right-full bottom-4 border-r border-current',
    };

    const arrowSizeClasses = {
      'sm': 'w-2 h-2',
      'md': 'w-3 h-3',
      'lg': 'w-4 h-4',
    };

    const sizeClasses = {
      'sm': 'px-2 py-1 text-xs',
      'md': 'px-3 py-1.5 text-sm',
      'lg': 'px-4 py-2 text-base',
      'xl': 'px-5 py-3 text-lg',
    };

    const animationClasses = {
      'none': '',
      'fade': 'animate-fade-in',
      'scale': 'animate-scale-in',
      'slide': 'animate-slide-in-up',
      'bounce': 'animate-bounce-in',
      'flip': 'animate-flip',
    };

    const baseClasses = cn(
      // Base styles
      'absolute z-50 pointer-events-none transition-all duration-300',
      'max-w-xs',
      
      // Size
      sizeClasses[size],
      
      // Variant styles
      {
        // Default variant
        'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900': variant === 'default',
        
        // Filled variant
        'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900': variant === 'filled',
        
        // Outline variant
        'bg-transparent border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100': variant === 'outline',
        
        // Glass variant
        'bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl border border-white/20 dark:border-neutral-700/20 text-neutral-900 dark:text-neutral-100': variant === 'glass',
        
        // Gradient variant
        'border-0 text-white': variant === 'gradient',
      },
      
      // Gradient styles
      {
        'bg-gradient-to-r from-primary-500 to-primary-600': gradient === 'primary',
        'bg-gradient-to-r from-secondary-500 to-secondary-600': gradient === 'secondary',
        'bg-gradient-to-r from-accent-500 to-accent-600': gradient === 'accent',
        'bg-gradient-to-r from-food-pizza to-food-pasta': gradient === 'warm',
        'bg-gradient-to-r from-secondary-500 to-accent-500': gradient === 'cool',
        'bg-gradient-to-r from-food-pizza to-food-dessert': gradient === 'sunset',
        'bg-gradient-to-r from-food-fish to-accent-500': gradient === 'ocean',
        'bg-gradient-to-r from-food-salad to-secondary-500': gradient === 'forest',
        'bg-gradient-to-r from-food-pizza to-food-meat': gradient === 'fire',
        'bg-gradient-to-r from-accent-500 to-food-wine': gradient === 'royal',
        'bg-gradient-to-r from-food-dessert to-accent-500': gradient === 'tropical',
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
      
      // Shadow
      {
        'shadow-none': shadow === 'none',
        'shadow-sm': shadow === 'sm',
        'shadow-md': shadow === 'md',
        'shadow-lg': shadow === 'lg',
        'shadow-xl': shadow === 'xl',
        'shadow-glow': shadow === 'glow',
        'shadow-glow-secondary': shadow === 'glow-secondary',
        'shadow-glow-accent': shadow === 'glow-accent',
      },
      
      // Animation
      animationClasses[animation],
      
      // Visibility
      {
        'opacity-100 scale-100': isVisible,
        'opacity-0 scale-95': !isVisible,
      },
      
      // Position
      positionClasses[position],
      
      contentClassName
    );

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
      >
        {/* Trigger element */}
        <div ref={triggerRef} tabIndex={showOnFocus ? 0 : undefined}>
          {children}
        </div>
        
        {/* Tooltip content */}
        {isMounted && (
          <div
            ref={tooltipRef}
            className={baseClasses}
            style={{ maxWidth }}
            role="tooltip"
            aria-hidden={!isVisible}
          >
            {content}
            
            {/* Arrow */}
            {showArrow && (
              <div
                className={cn(
                  'absolute border-transparent',
                  arrowPositionClasses[position],
                  arrowSizeClasses[arrowSize]
                )}
                style={{
                  borderColor: gradient !== 'none' ? 'transparent' : undefined,
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

// Hook for managing tooltip state
export const useTooltip = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const showTooltip = (x: number, y: number) => {
    setPosition({ x, y });
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    position,
    showTooltip,
    hideTooltip,
  };
};

export { Tooltip };

