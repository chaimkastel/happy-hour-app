/**
 * Accessibility utilities for keyboard navigation and screen readers
 */

// Keyboard event handlers for clickable elements
export function handleKeyDown(
  event: React.KeyboardEvent,
  onClick: () => void,
  allowedKeys: string[] = ['Enter', ' ']
) {
  if (allowedKeys.includes(event.key)) {
    event.preventDefault();
    onClick();
  }
}

// Generate unique IDs for form elements
export function generateId(prefix: string = 'element'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// ARIA live region for announcements
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus management utilities
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

// Skip to main content link - moved to separate component file
// Screen reader only text - moved to separate component file

// Focus visible utility for better keyboard navigation
export function focusVisible() {
  return 'focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2';
}

// ARIA attributes helper
export function getAriaAttributes(props: {
  label?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}) {
  const attributes: Record<string, string | boolean> = {};
  
  if (props.label) attributes['aria-label'] = props.label;
  if (props.describedBy) attributes['aria-describedby'] = props.describedBy;
  if (props.expanded !== undefined) attributes['aria-expanded'] = props.expanded;
  if (props.selected !== undefined) attributes['aria-selected'] = props.selected;
  if (props.disabled) attributes['aria-disabled'] = props.disabled;
  if (props.required) attributes['aria-required'] = props.required;
  if (props.invalid) attributes['aria-invalid'] = props.invalid;
  
  return attributes;
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In production, use a proper color contrast library
  return 4.5; // Placeholder - implement proper calculation
}

// High contrast mode detection
export function isHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Touch target size validation
export function isValidTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // 44px minimum touch target
  
  return rect.width >= minSize && rect.height >= minSize;
}

// Announce page changes for single-page applications
export function announcePageChange(pageTitle: string) {
  announceToScreenReader(`Navigated to ${pageTitle}`);
}

// Form validation announcements
export function announceValidationError(fieldName: string, errorMessage: string) {
  announceToScreenReader(`${fieldName}: ${errorMessage}`);
}

// Loading state announcements
export function announceLoadingState(isLoading: boolean, context: string = 'content') {
  if (isLoading) {
    announceToScreenReader(`Loading ${context}`);
  } else {
    announceToScreenReader(`${context} loaded`);
  }
}
