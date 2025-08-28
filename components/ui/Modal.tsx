'use client';

import React from 'react';
import { X, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  variant?: 'default' | 'centered' | 'side' | 'bottom' | 'fullscreen';
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'flip';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  closeButtonIcon?: LucideIcon;
  closeButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  overlayVariant?: 'default' | 'blur' | 'glass' | 'gradient';
  overlayColor?: 'default' | 'dark' | 'light' | 'transparent';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow' | 'glow-secondary' | 'glow-accent';
  gradient?: 'none' | 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'sunset' | 'ocean' | 'forest' | 'fire' | 'royal' | 'tropical';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = 'md',
      variant = 'default',
      animation = 'fade',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      closeButtonIcon: CloseButtonIcon = X,
      closeButtonPosition = 'top-right',
      overlayVariant = 'default',
      overlayColor = 'default',
      rounded = 'xl',
      shadow = 'xl',
      gradient = 'none',
      header,
      footer,
      className,
      overlayClassName,
      contentClassName,
      headerClassName,
      bodyClassName,
      footerClassName,
    },
    ref
  ) => {
    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, closeOnEscape, onClose]);

    // Handle overlay click
    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const sizeClasses = {
      'xs': 'max-w-xs',
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      'full': 'max-w-full mx-4',
    };

    const variantClasses = {
      'default': 'mx-4',
      'centered': 'mx-4',
      'side': 'ml-auto mr-0 h-full rounded-l-3xl',
      'bottom': 'mx-4 mb-0 rounded-b-none',
      'fullscreen': 'mx-0 my-0 h-full w-full rounded-none',
    };

    const animationClasses = {
      'none': '',
      'fade': 'animate-fade-in',
      'slide-up': 'animate-slide-in-up',
      'slide-down': 'animate-slide-in-down',
      'slide-left': 'animate-slide-in-left',
      'slide-right': 'animate-slide-in-right',
      'scale': 'animate-scale-in',
      'flip': 'animate-flip',
    };

    const overlayClasses = cn(
      // Base overlay styles
      'fixed inset-0 z-50 flex items-center justify-center',
      'transition-all duration-300',
      
      // Overlay variant
      {
        'backdrop-blur-sm': overlayVariant === 'blur',
        'backdrop-blur-xl': overlayVariant === 'glass',
        'backdrop-blur-2xl': overlayVariant === 'gradient',
      },
      
      // Overlay color
      {
        'bg-black/50': overlayColor === 'default',
        'bg-black/75': overlayColor === 'dark',
        'bg-white/50': overlayColor === 'light',
        'bg-transparent': overlayColor === 'transparent',
      },
      
      // Animation
      animationClasses[animation],
      
      overlayClassName
    );

    const contentClasses = cn(
      // Base content styles
      'relative bg-white dark:bg-surface-800 transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
      
      // Size
      sizeClasses[size],
      
      // Variant
      variantClasses[variant],
      
      // Border radius
      {
        'rounded-none': rounded === 'none',
        'rounded-sm': rounded === 'sm',
        'rounded-md': rounded === 'md',
        'rounded-lg': rounded === 'lg',
        'rounded-xl': rounded === 'xl',
        'rounded-2xl': rounded === '2xl',
        'rounded-3xl': rounded === '3xl',
        'rounded-full': rounded === 'full',
      },
      
      // Shadow
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
      
      // Gradient
      {
        'bg-gradient-to-br from-primary-500 to-primary-600 text-white': gradient === 'primary',
        'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white': gradient === 'secondary',
        'bg-gradient-to-br from-accent-500 to-accent-600 text-white': gradient === 'accent',
        'bg-gradient-to-br from-food-pizza to-food-pasta text-white': gradient === 'warm',
        'bg-gradient-to-br from-secondary-500 to-accent-500 text-white': gradient === 'cool',
        'bg-gradient-to-br from-food-pizza to-food-dessert text-white': gradient === 'sunset',
        'bg-gradient-to-br from-food-fish to-accent-500 text-white': gradient === 'ocean',
        'bg-gradient-to-br from-food-salad to-secondary-500 text-white': gradient === 'forest',
        'bg-gradient-to-br from-food-pizza to-food-meat text-white': gradient === 'fire',
        'bg-gradient-to-br from-accent-500 to-food-wine text-white': gradient === 'royal',
        'bg-gradient-to-br from-food-dessert to-accent-500 text-white': gradient === 'tropical',
      },
      
      contentClassName
    );

    const closeButtonClasses = cn(
      'absolute z-10 p-2 rounded-full transition-all duration-200',
      'hover:bg-black/10 dark:hover:bg-white/10',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
      {
        'top-4 right-4': closeButtonPosition === 'top-right',
        'top-4 left-4': closeButtonPosition === 'top-left',
        'bottom-4 right-4': closeButtonPosition === 'bottom-right',
        'bottom-4 left-4': closeButtonPosition === 'bottom-left',
      }
    );

    return (
      <div className={overlayClasses} onClick={handleOverlayClick}>
        <div
          ref={ref}
          className={contentClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              type="button"
              className={closeButtonClasses}
              onClick={onClose}
              aria-label="Close modal"
            >
              <CloseButtonIcon className="w-5 h-5" />
            </button>
          )}
          
          {/* Header */}
          {(header || title || description) && (
            <div className={cn(
              'px-6 py-4 border-b border-neutral-200 dark:border-neutral-700',
              headerClassName
            )}>
              {header || (
                <>
                  {title && (
                    <h2
                      id="modal-title"
                      className={cn(
                        'text-lg font-semibold',
                        gradient !== 'none' ? 'text-white' : 'text-neutral-900 dark:text-white'
                      )}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="modal-description"
                      className={cn(
                        'mt-1 text-sm',
                        gradient !== 'none' ? 'text-white/80' : 'text-neutral-600 dark:text-neutral-400'
                      )}
                    >
                      {description}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className={cn(
            'px-6 py-4',
            bodyClassName
          )}>
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className={cn(
              'px-6 py-4 border-t border-neutral-200 dark:border-neutral-700',
              footerClassName
            )}>
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

// Modal sub-components for easier composition
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'loose';
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, spacing = 'normal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-b border-neutral-200 dark:border-neutral-700',
        {
          'py-3': spacing === 'tight',
          'py-4': spacing === 'normal',
          'py-6': spacing === 'loose',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, size = 'md', children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'font-semibold leading-none tracking-tight',
        {
          'text-base': size === 'sm',
          'text-lg': size === 'md',
          'text-xl': size === 'lg',
          'text-2xl': size === 'xl',
        },
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
);

ModalTitle.displayName = 'ModalTitle';

export interface ModalDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const ModalDescription = React.forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
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

ModalDescription.displayName = 'ModalDescription';

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'loose';
}

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, spacing = 'normal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4',
        {
          'py-3': spacing === 'tight',
          'py-4': spacing === 'normal',
          'py-6': spacing === 'loose',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalBody.displayName = 'ModalBody';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'tight' | 'normal' | 'loose';
}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, spacing = 'normal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-t border-neutral-200 dark:border-neutral-700',
        'flex items-center justify-end gap-3',
        {
          'py-3': spacing === 'tight',
          'py-4': spacing === 'normal',
          'py-6': spacing === 'loose',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';

export { Modal };

