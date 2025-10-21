'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { generateId, getAriaAttributes } from '@/lib/accessibility';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface AccessibleFormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  success?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
}

export default function AccessibleFormField({
  label,
  type = 'text',
  placeholder,
  value = '',
  onChange,
  onBlur,
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  inputClassName = '',
  labelClassName = '',
  id,
  name,
  min,
  max,
  step,
  pattern,
  maxLength,
  minLength,
}: AccessibleFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const fieldId = id || generateId('field');
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  const successId = `${fieldId}-success`;
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const ariaAttributes = getAriaAttributes({
    required,
    disabled,
    invalid: !!error,
  });
  
  const describedBy = [
    error && errorId,
    success && successId,
    helperText && helperId,
  ].filter(Boolean).join(' ');
  
  if (describedBy) {
    ariaAttributes['aria-describedby'] = describedBy;
  }
  
  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className={cn(
          'block text-sm font-medium text-gray-700',
          error && 'text-red-700',
          success && 'text-green-700',
          disabled && 'text-gray-400',
          labelClassName
        )}
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
          id={fieldId}
          name={name}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          maxLength={maxLength}
          minLength={minLength}
          className={cn(
            'block w-full px-3 py-2 border rounded-md shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : success
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
            type === 'password' && 'pr-10',
            inputClassName
          )}
          {...ariaAttributes}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
        
        {(error || success) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {error && <AlertCircle className="h-4 w-4 text-red-500" />}
            {success && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        )}
      </div>
      
      {helperText && !error && !success && (
        <p id={helperId} className="text-sm text-gray-600">
          {helperText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {success && (
        <p id={successId} className="text-sm text-green-600">
          {success}
        </p>
      )}
    </div>
  );
}

