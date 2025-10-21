'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { calculatePasswordStrength, validatePassword } from '@/lib/validation';

interface PasswordStrengthMeterProps {
  password: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  onChange: (password: string) => void;
  className?: string;
}

export default function PasswordStrengthMeter({ 
  password, 
  showPassword, 
  onToggleVisibility,
  onChange,
  className = '' 
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(() => {
    const result = calculatePasswordStrength(password);
    return {
      ...result,
      label: result.score <= 2 ? 'Weak' : result.score <= 4 ? 'Medium' : 'Strong',
      color: result.score <= 2 ? 'text-red-600' : result.score <= 4 ? 'text-yellow-600' : 'text-green-600'
    };
  });
  const [validation, setValidation] = useState(validatePassword(password));

  useEffect(() => {
    const result = calculatePasswordStrength(password);
    const newValidation = validatePassword(password);
    setStrength({
      ...result,
      label: result.score <= 2 ? 'Weak' : result.score <= 4 ? 'Medium' : 'Strong',
      color: result.score <= 2 ? 'text-red-600' : result.score <= 4 ? 'text-yellow-600' : 'text-green-600'
    });
    setValidation(newValidation);
  }, [password]);

  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /\d/.test(password) },
    { text: 'One special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Password Input with Toggle */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
          placeholder="Enter your password"
          aria-label="Password"
          aria-describedby="password-requirements"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Strength Indicator */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Password strength:</span>
            <span className={`text-sm font-medium ${strength.color}`}>
              {strength.label}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                strength.score <= 2 ? 'bg-red-500' :
                strength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${(strength.score / 6) * 100}%` }}
              role="progressbar"
              aria-valuenow={strength.score}
              aria-valuemin={0}
              aria-valuemax={6}
              aria-label={`Password strength: ${strength.label}`}
            />
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      <div id="password-requirements" className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Password requirements:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center space-x-2 text-sm">
              {req.met ? (
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
              ) : (
                <X className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
              )}
              <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                {req.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Error Messages */}
      {validation && !validation.isValid && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center space-x-1">
              <X className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}