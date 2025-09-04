export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password strength calculation
export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  if (score <= 2) {
    return { score, label: 'Weak', color: 'text-red-600' };
  } else if (score <= 4) {
    return { score, label: 'Medium', color: 'text-yellow-600' };
  } else {
    return { score, label: 'Strong', color: 'text-green-600' };
  }
};

// Name validation
export const validateName = (name: string, fieldName: string = 'Name'): string | null => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  
  if (name.trim().length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  
  return null;
};

// Phone validation
export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return null; // Phone is optional
  }
  
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return 'Please enter a valid phone number';
  }
  
  return null;
};

// Location validation
export const validateLocation = (location: string): string | null => {
  if (!location.trim()) {
    return null; // Location is optional
  }
  
  if (location.trim().length < 2) {
    return 'Location must be at least 2 characters long';
  }
  
  return null;
};

// Terms acceptance validation
export const validateTermsAcceptance = (accepted: boolean): string | null => {
  if (!accepted) {
    return 'You must accept the Terms of Service and Privacy Policy';
  }
  
  return null;
};

// Form validation helper
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => string | null>): ValidationResult => {
  const errors: ValidationError[] = [];
  
  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get error message for a specific field
export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find(e => e.field === field);
  return error ? error.message : null;
};

// Search query validation
export const validateSearchQuery = (query: string): string | null => {
  if (!query || query.trim().length === 0) {
    return 'Search query is required';
  }
  
  if (query.trim().length < 2) {
    return 'Search query must be at least 2 characters long';
  }
  
  if (query.trim().length > 100) {
    return 'Search query must be less than 100 characters';
  }
  
  return null;
};

// Request validation schemas
export const schemas = {
  dealSearch: {
    q: validateSearchQuery,
    location: (value: string) => value ? null : null, // Optional
    cuisine: (value: string) => value ? null : null, // Optional
    distance: (value: number) => value && value > 0 && value <= 100 ? null : 'Distance must be between 1 and 100 miles',
    priceRange: (value: string) => value ? null : null, // Optional
    rating: (value: number) => value && value >= 0 && value <= 5 ? null : 'Rating must be between 0 and 5'
  }
};

// Generic request validation
export const validateRequest = (schema: Record<string, (value: any) => string | null>, data: Record<string, any>): ValidationResult => {
  return validateForm(data, schema);
};