'use client';

import { useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function ConsentCheckbox({
  checked,
  onChange,
  error,
  disabled = false,
  className = ''
}: ConsentCheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            id="consent"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
            aria-describedby={error ? 'consent-error' : undefined}
            aria-invalid={!!error}
          />
          <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled}
            className={`
              w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200
              ${checked 
                ? 'bg-amber-600 border-amber-600 text-white' 
                : 'border-gray-300 hover:border-amber-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isHovered && !checked ? 'bg-amber-50' : ''}
            `}
            aria-label="Accept terms and privacy policy"
          >
            {checked && <Check className="w-3 h-3" />}
          </button>
        </div>
        
        <label 
          htmlFor="consent" 
          className="text-sm text-gray-700 cursor-pointer select-none"
        >
          I agree to the{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
            aria-label="Read Terms of Service (opens in new tab)"
          >
            Terms of Service
            <ExternalLink className="inline w-3 h-3 ml-1" aria-hidden="true" />
          </a>
          {' '}and{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
            aria-label="Read Privacy Policy (opens in new tab)"
          >
            Privacy Policy
            <ExternalLink className="inline w-3 h-3 ml-1" aria-hidden="true" />
          </a>
        </label>
      </div>
      
      {error && (
        <p id="consent-error" className="text-sm text-red-600 flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}


import { useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function ConsentCheckbox({
  checked,
  onChange,
  error,
  disabled = false,
  className = ''
}: ConsentCheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            id="consent"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
            aria-describedby={error ? 'consent-error' : undefined}
            aria-invalid={!!error}
          />
          <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled}
            className={`
              w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200
              ${checked 
                ? 'bg-amber-600 border-amber-600 text-white' 
                : 'border-gray-300 hover:border-amber-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isHovered && !checked ? 'bg-amber-50' : ''}
            `}
            aria-label="Accept terms and privacy policy"
          >
            {checked && <Check className="w-3 h-3" />}
          </button>
        </div>
        
        <label 
          htmlFor="consent" 
          className="text-sm text-gray-700 cursor-pointer select-none"
        >
          I agree to the{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
            aria-label="Read Terms of Service (opens in new tab)"
          >
            Terms of Service
            <ExternalLink className="inline w-3 h-3 ml-1" aria-hidden="true" />
          </a>
          {' '}and{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700 underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
            aria-label="Read Privacy Policy (opens in new tab)"
          >
            Privacy Policy
            <ExternalLink className="inline w-3 h-3 ml-1" aria-hidden="true" />
          </a>
        </label>
      </div>
      
      {error && (
        <p id="consent-error" className="text-sm text-red-600 flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
