import { z } from 'zod';

// Common validation schemas
export const schemas = {
  // Address validation
  address: z.object({
    query: z.string().min(3).max(100).regex(/^[a-zA-Z0-9\s,.-]+$/, 'Invalid characters in address'),
    place_id: z.string().optional()
  }),

  // Deal search validation
  dealSearch: z.object({
    search: z.string().max(100).optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0),
    cuisine: z.string().max(50).optional(),
    maxDistance: z.coerce.number().min(0).max(100).default(10),
    minDiscount: z.coerce.number().min(0).max(100).default(0),
    openNow: z.coerce.boolean().default(false)
  }),

  // User authentication validation
  auth: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  }),

  // Deal creation validation
  deal: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    percentOff: z.number().min(1).max(100),
    venueId: z.string().uuid(),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    maxRedemptions: z.number().min(1).max(1000).optional(),
    minSpend: z.number().min(0).optional(),
    inPersonOnly: z.boolean().default(false)
  }),

  // Venue validation
  venue: z.object({
    name: z.string().min(1).max(100),
    address: z.string().min(1).max(200),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    businessType: z.array(z.string()).min(1),
    priceTier: z.enum(['BUDGET', 'MODERATE', 'PREMIUM']),
    rating: z.number().min(0).max(5).optional()
  })
};

// Validation helper function
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate and sanitize search query
export function validateSearchQuery(query: string): string {
  const sanitized = sanitizeInput(query);
  if (sanitized.length < 3) {
    throw new Error('Search query must be at least 3 characters');
  }
  if (sanitized.length > 100) {
    throw new Error('Search query must be less than 100 characters');
  }
  return sanitized;
}

// Export individual schemas for backward compatibility
export const dealSchema = schemas.deal;
export const venueSchema = schemas.venue;
export const addressSchema = schemas.address;
export const authSchema = schemas.auth;
export const dealSearchSchema = schemas.dealSearch;

// Alias for middleware compatibility
export const validateInput = validateRequest;