import { z } from 'zod'

// Common validation schemas
export const venueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  cuisine: z.array(z.string()).optional(),
  priceTier: z.enum(['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY']).optional(),
  hours: z.record(z.string(), z.any()).optional(),
  rating: z.number().min(0).max(5).optional(),
  photos: z.array(z.string().url()).optional(),
  isVerified: z.boolean().optional(),
})

export const dealSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  percentOff: z.number().int().min(5, 'Minimum 5% off').max(50, 'Maximum 50% off'),
  startAt: z.string().datetime('Invalid start date'),
  endAt: z.string().datetime('Invalid end date'),
  maxRedemptions: z.number().int().min(0, 'Max redemptions must be non-negative').optional(),
  minSpend: z.number().min(0, 'Min spend must be non-negative').optional(),
  dineInOnly: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'LIVE', 'PAUSED', 'EXPIRED']).optional(),
})

export const businessHoursSchema = z.object({
  monday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean()
  }),
  tuesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean()
  }),
  wednesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean()
  }),
  thursday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean()
  }),
  friday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean()
  }),
  saturday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean()
  }),
  sunday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean()
  })
})

export const quietWindowSchema = z.object({
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
  reason: z.string().optional()
})

export const settingsSchema = z.object({
  businessHours: businessHoursSchema.optional(),
  quietWindows: z.array(quietWindowSchema).optional(),
  defaultRules: z.object({
    maxDealDuration: z.number().int().min(1).max(365).optional(),
    minDealPercentOff: z.number().int().min(1).max(100).optional(),
    maxDealPercentOff: z.number().int().min(1).max(100).optional(),
    requireMinSpend: z.boolean().optional(),
    defaultMinSpend: z.number().min(0).optional(),
    autoPauseExpired: z.boolean().optional(),
    allowDineInOnly: z.boolean().optional(),
    allowTakeaway: z.boolean().optional(),
  }).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    dealExpiryReminder: z.boolean().optional(),
    lowInventoryAlert: z.boolean().optional(),
    weeklyReport: z.boolean().optional(),
  }).optional(),
  payoutSettings: z.object({
    autoPayout: z.boolean().optional(),
    payoutThreshold: z.number().min(0).optional(),
    payoutSchedule: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
    payoutDay: z.number().int().min(1).max(31).optional(),
  }).optional(),
})

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ['Validation failed'] }
  }
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}
