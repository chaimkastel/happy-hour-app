'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { User, Camera, Edit3, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  variant?: 'default' | 'outline' | 'filled' | 'glass' | 'gradient';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow' | 'glow-secondary' | 'glow-accent';
  animation?: 'none' | 'pulse' | 'bounce' | 'wiggle' | 'heartbeat' | 'tada' | 'swing' | 'float' | 'spin';
  src?: string;
  alt?: string;
  fallback?: string | React.ReactNode;
  fallbackIcon?: React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'dnd';
  statusColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  statusSize?: 'sm' | 'md' | 'lg';
  statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  editable?: boolean;
  onEdit?: () => void;
  loading?: boolean;
  error?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  statusClassName?: string;
  editButtonClassName?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      size = 'md',
      variant = 'default',
      color = 'primary',
      gradient = 'none',
      rounded = 'full',
      shadow = 'none',
      animation = 'none',
      src,
      alt,
      fallback,
      fallbackIcon,
      status,
      statusColor = 'success',
      statusSize = 'md',
      statusPosition = 'bottom-right',
      editable = false,
      onEdit,
      loading = false,
      error = false,
      className,
      imageClassName,
      fallbackClassName,
      statusClassName,
      editButtonClassName,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(!!src);
    const avatarRef = useRef<HTMLDivElement>(null);

    // Size classes
    const sizeClasses = {
      'xs': 'w-6 h-6',
      'sm': 'w-8 h-8',
      'md': 'w-12 h-12',
      'lg': 'w-16 h-16',
      'xl': 'w-20 h-20',
      '2xl': 'w-24 h-24',
      '3xl': 'w-32 h-32',
    };

    const statusSizeClasses = {
      'sm': 'w-2 h-2',
      'md': 'w-3 h-3',
      'lg': 'w-4 h-4',
    };

    const editButtonSizeClasses = {
      'xs': 'w-4 h-4',
      'sm': 'w-5 h-5',
      'md': 'w-6 h-6',
      'lg': 'w-8 h-8',
      'xl': 'w-10 h-10',
      '2xl': 'w-12 h-12',
      '3xl': 'w-16 h-16',
    };

    const fallbackSizeClasses = {
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    };

    // Variant classes
    const variantClasses = {
      'default': 'bg-white dark:bg-neutral-800',
      'outline': 'bg-transparent border-2 border-neutral-300 dark:border-neutral-600',
      'filled': 'bg-neutral-100 dark:bg-neutral-700',
      'glass': 'bg-white/20 dark:bg-neutral-800/20 backdrop-blur-sm border border-white/30 dark:border-neutral-700/30',
      'gradient': 'bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800',
    };

    // Color classes
    const colorClasses = {
      'primary': 'text-primary-600 dark:text-primary-400',
      'secondary': 'text-secondary-600 dark:text-secondary-400',
      'accent': 'text-accent-600 dark:text-accent-400',
      'success': 'text-success-600 dark:text-success-400',
      'warning': 'text-warning-600 dark:text-warning-400',
      'error': 'text-error-600 dark:text-error-400',
      'info': 'text-blue-600 dark:text-blue-400',
      'neutral': 'text-neutral-600 dark:text-neutral-400',
    };

    // Gradient classes
    const gradientClasses = {
      'none': '',
      'primary': 'bg-gradient-to-br from-primary-400 to-primary-600',
      'secondary': 'bg-gradient-to-br from-secondary-400 to-secondary-600',
      'accent': 'bg-gradient-to-br from-accent-400 to-accent-600',
      'warm': 'bg-gradient-to-br from-food-pizza to-food-pasta',
      'cool': 'bg-gradient-to-br from-secondary-400 to-accent-400',
      'sunset': 'bg-gradient-to-br from-food-pizza to-food-dessert',
      'ocean': 'bg-gradient-to-br from-food-fish to-accent-400',
      'forest': 'bg-gradient-to-br from-food-salad to-secondary-400',
      'fire': 'bg-gradient-to-br from-food-pizza to-food-meat',
      'royal': 'bg-gradient-to-br from-accent-400 to-food-wine',
      'tropical': 'bg-gradient-to-br from-food-dessert to-accent-400',
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
      'float': 'animate-float',
      'spin': 'animate-spin',
    };

    // Status color classes
    const statusColorClasses = {
      'primary': 'bg-primary-500',
      'secondary': 'bg-secondary-500',
      'accent': 'bg-accent-500',
      'success': 'bg-success-500',
      'warning': 'bg-warning-500',
      'error': 'bg-error-500',
      'info': 'bg-blue-500',
      'neutral': 'bg-neutral-500',
    };

    // Status position classes
    const statusPositionClasses = {
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
    };

    const avatarClasses = cn(
      // Base styles
      'relative inline-flex items-center justify-center overflow-hidden transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900',
      
      // Size
      sizeClasses[size],
      
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
      
      className
    );

    const imageClasses = cn(
      'w-full h-full object-cover transition-all duration-200',
      roundedClasses[rounded],
      imageClassName
    );

    const fallbackClasses = cn(
      'flex items-center justify-center w-full h-full font-semibold',
      gradient === 'none' ? colorClasses[color] : 'text-white',
      fallbackSizeClasses[size],
      fallbackClassName
    );

    const statusClasses = cn(
      'absolute border-2 border-white dark:border-neutral-800 rounded-full',
      statusColorClasses[statusColor],
      statusSizeClasses[statusSize],
      statusPositionClasses[statusPosition],
      statusClassName
    );

    const editButtonClasses = cn(
      'absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer',
      roundedClasses[rounded],
      editButtonClassName
    );

    // Handle image loading
    useEffect(() => {
      if (src) {
        setImageLoading(true);
        setImageError(false);
      }
    }, [src]);

    const handleImageLoad = () => {
      setImageLoading(false);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageLoading(false);
      setImageError(true);
    };

    // Generate fallback text
    const getFallbackText = () => {
      if (fallback) return fallback;
      if (alt) {
        return alt
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }
      return 'U';
    };

    // Show fallback if no image, image error, or loading
    const showFallback = !src || imageError || error;

    return (
      <div ref={ref} className={avatarClasses} {...props}>
        {/* Image */}
        {src && !imageError && !error && (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={imageClasses}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Fallback */}
        {showFallback && (
          <div className={fallbackClasses}>
            {fallbackIcon || <User className="w-full h-full" />}
            {typeof getFallbackText() === 'string' && (
              <span className="sr-only">{getFallbackText()}</span>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-800/80">
            <Loader2 className={cn('animate-spin', colorClasses[color])} />
          </div>
        )}

        {/* Status indicator */}
        {status && (
          <div className={statusClasses} />
        )}

        {/* Edit button */}
        {editable && onEdit && (
          <button
            type="button"
            className={editButtonClasses}
            onClick={onEdit}
            aria-label="Edit avatar"
          >
            <Camera className={editButtonSizeClasses[size]} />
          </button>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar group for multiple avatars
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  max?: number;
  spacing?: 'tight' | 'normal' | 'loose';
  overlap?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, size = 'md', max, spacing = 'normal', overlap = 'normal', children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const displayCount = max ? Math.min(childrenArray.length, max) : childrenArray.length;
    const remainingCount = max ? Math.max(0, childrenArray.length - max) : 0;

    // Spacing classes
    const spacingClasses = {
      'tight': '-space-x-1',
      'normal': '-space-x-2',
      'loose': '-space-x-3',
    };

    // Overlap classes
    const overlapClasses = {
      'tight': 'ring-1',
      'normal': 'ring-2',
      'loose': 'ring-4',
    };

    const containerClasses = cn(
      'flex items-center',
      spacingClasses[spacing],
      className
    );

    const avatarClasses = cn(
      'ring-white dark:ring-neutral-800',
      overlapClasses[overlap]
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {childrenArray.slice(0, displayCount).map((child, index) => (
          <div key={index} className={avatarClasses}>
            {React.isValidElement(child) && React.cloneElement(child, {
              size,
              ...child.props,
            })}
          </div>
        ))}
        
        {/* Remaining count indicator */}
        {remainingCount > 0 && (
          <div className={cn(
            'flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 font-semibold',
            'ring-white dark:ring-neutral-800',
            overlapClasses[overlap],
            size === 'xs' ? 'w-6 h-6 text-xs' :
            size === 'sm' ? 'w-8 h-8 text-sm' :
            size === 'md' ? 'w-12 h-12 text-base' :
            size === 'lg' ? 'w-16 h-16 text-lg' :
            size === 'xl' ? 'w-20 h-20 text-xl' :
            size === '2xl' ? 'w-24 h-24 text-2xl' :
            'w-32 h-32 text-3xl'
          )}>
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

// Avatar item for group
export interface AvatarItemProps extends AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string | React.ReactNode;
}

export const AvatarItem = React.forwardRef<HTMLDivElement, AvatarItemProps>(
  ({ className, src, alt, fallback, ...props }, ref) => (
    <Avatar
      ref={ref}
      src={src}
      alt={alt}
      fallback={fallback}
      className={className}
      {...props}
    />
  )
);

AvatarItem.displayName = 'AvatarItem';

// Avatar with text
export interface AvatarWithTextProps extends AvatarProps {
  name?: string;
  description?: string;
  textPosition?: 'left' | 'right';
  textSize?: 'sm' | 'md' | 'lg';
  className?: string;
  textClassName?: string;
}

export const AvatarWithText = React.forwardRef<HTMLDivElement, AvatarWithTextProps>(
  ({ 
    className, 
    textClassName,
    name, 
    description, 
    textPosition = 'right', 
    textSize = 'md',
    ...props 
  }, ref) => {
    const textSizeClasses = {
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
    };

    const containerClasses = cn(
      'flex items-center gap-3',
      {
        'flex-row': textPosition === 'right',
        'flex-row-reverse': textPosition === 'left',
      },
      className
    );

    const textClasses = cn(
      'flex flex-col',
      textSizeClasses[textSize],
      textClassName
    );

    return (
      <div ref={ref} className={containerClasses}>
        <Avatar {...props} />
        {(name || description) && (
          <div className={textClasses}>
            {name && (
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {name}
              </span>
            )}
            {description && (
              <span className="text-neutral-600 dark:text-neutral-400">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

AvatarWithText.displayName = 'AvatarWithText';

export { Avatar };

