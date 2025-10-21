import { z } from 'zod';

// Deal search validation
export const dealSearchSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

// Deal creation validation
export const createDealSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  type: z.enum(['HAPPY_HOUR', 'INSTANT']),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  percentOff: z.number().min(1, 'Percent off must be at least 1').max(100, 'Percent off cannot exceed 100').optional(),
  originalPrice: z.number().min(0, 'Price cannot be negative').optional(),
  discountedPrice: z.number().min(0, 'Price cannot be negative').optional(),
  startAt: z.string().datetime('Invalid start date'),
  endAt: z.string().datetime('Invalid end date'),
  daysOfWeek: z.array(z.string()).optional(),
  timeWindows: z.array(z.object({
    start: z.string(),
    end: z.string()
  })).optional(),
  conditions: z.array(z.string()).optional(),
  maxRedemptions: z.number().min(1, 'Max redemptions must be at least 1').optional(),
  perUserLimit: z.number().min(1, 'Per user limit must be at least 1').default(1),
  priority: z.number().default(1),
  active: z.boolean().default(true)
});

// User signup validation
export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .optional()
    .refine((phone) => {
      if (!phone) return true; // Optional field
      const cleaned = phone.replace(/[^\d+]/g, '');
      return /^(\+\d{7,15}|\d{7,15})$/.test(cleaned);
    }, 'Please enter a valid phone number (7-15 digits, optionally starting with +)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Merchant signup validation
export const merchantSignupSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(100, 'Business name too long'),
  contactName: z.string().min(1, 'Contact name is required').max(100, 'Contact name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .optional()
    .refine((phone) => {
      if (!phone) return true; // Optional field
      const cleaned = phone.replace(/[^\d+]/g, '');
      return /^(\+\d{7,15}|\d{7,15})$/.test(cleaned);
    }, 'Please enter a valid phone number (7-15 digits, optionally starting with +)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Venue creation validation
export const createVenueSchema = z.object({
  name: z.string().min(1, 'Venue name is required').max(100, 'Venue name too long'),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
  city: z.string().min(1, 'City is required').max(50, 'City name too long'),
  state: z.string().min(1, 'State is required').max(50, 'State name too long'),
  zip: z.string().min(5, 'Invalid ZIP code').max(10, 'Invalid ZIP code'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().default('America/New_York'),
  hours: z.record(z.string(), z.string()).optional(),
  priceTier: z.enum(['BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY']).default('MID_RANGE'),
});

// Email validation
export const emailSchema = z.string().email('Invalid email address');

// Phone validation - more flexible
export const phoneSchema = z.string()
  .optional()
  .refine((phone) => {
    if (!phone) return true; // Optional field
    // Remove all non-digit characters except + at the beginning
    const cleaned = phone.replace(/[^\d+]/g, '');
    // Must start with + or be 7-15 digits
    return /^(\+\d{7,15}|\d{7,15})$/.test(cleaned);
  }, 'Please enter a valid phone number (7-15 digits, optionally starting with +)');

// Password validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/(?=.*\d)/, 'Password must contain at least one number');

// Password strength calculation
export function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use at least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }

  if (password.length >= 12) {
    score += 1;
  }

  return { score, feedback };
}

// Password validation function
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generic ID validation
export const idSchema = z.string().min(1, 'ID is required');

// Pagination validation
export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

// Search query validation
export const searchQuerySchema = z.string()
  .min(1, 'Search query is required')
  .max(100, 'Search query too long')
  .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, 'Search query contains invalid characters');

// Rate limiting validation
export const rateLimitSchema = z.object({
  windowMs: z.number().min(1000, 'Window must be at least 1 second'),
  maxRequests: z.number().min(1, 'Max requests must be at least 1'),
});

// Utility function to validate request body
export function validateRequestBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation error: ${result.error.issues.map(e => e.message).join(', ')}`);
  }
  return result.data;
}

// Utility function to validate query parameters
export function validateQueryParams<T>(schema: z.ZodSchema<T>, params: URLSearchParams): T {
  const data = Object.fromEntries(params.entries());
  return validateRequestBody(schema, data);
}

// Generic form validation function
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  isValid: boolean;
  data?: T;
  errors: string[];
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return {
      isValid: true,
      data: result.data,
      errors: [],
    };
  } else {
    return {
      isValid: false,
      errors: result.error.issues.map(issue => issue.message),
    };
  }
}

// Alias for backward compatibility
export const validateRequest = validateRequestBody;

// Additional validation functions
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validateSearchQuery(query: string): boolean {
  return searchQuerySchema.safeParse(query).success;
}

// Export all schemas for convenience
export const schemas = {
  dealSearch: dealSearchSchema,
  createDeal: createDealSchema,
  signup: signupSchema,
  merchantSignup: merchantSignupSchema,
  createVenue: createVenueSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  id: idSchema,
  pagination: paginationSchema,
  searchQuery: searchQuerySchema,
  rateLimit: rateLimitSchema,
};