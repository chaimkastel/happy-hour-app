'use client';

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  autoComplete,
  'aria-describedby': ariaDescribedby,
  ...props
}, ref) => {
  const hasError = !!error;
  const helperTextId = helperText ? `${id}-helper` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedby, helperTextId, errorId].filter(Boolean).join(' ');

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError}
          aria-required={required}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-amber-500'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          {...props}
        />
        
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {helperText && !hasError && (
        <p id={helperTextId} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
      
      {hasError && (
        <p id={errorId} className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
