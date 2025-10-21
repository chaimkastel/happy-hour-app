// Feature flags for production controls
export const flags = {
  // Demo/Test features
  ENABLE_DEMO_BANNER: process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEMO_BANNER === 'true',
  ENABLE_TEST_CREDENTIALS: process.env.NODE_ENV !== 'production' && process.env.ENABLE_TEST_CREDENTIALS === 'true',
  
  // Core features
  ENABLE_MERCHANT_SIGNUP: process.env.ENABLE_MERCHANT_SIGNUP !== 'false', // Default enabled
  ENABLE_BILLING: process.env.ENABLE_BILLING !== 'false', // Default enabled
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION !== 'false', // Default enabled
  
  // Experimental features
  ENABLE_LOCATION_SERVICES: process.env.ENABLE_LOCATION_SERVICES === 'true',
  ENABLE_PUSH_NOTIFICATIONS: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',
  ENABLE_SOCIAL_LOGIN: process.env.ENABLE_SOCIAL_LOGIN === 'true',
  
  // Maintenance mode
  MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true',
  
  // Rate limiting
  ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false', // Default enabled
  
  // Analytics
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
  ENABLE_SENTRY: process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN,
} as const;

export type FeatureFlag = keyof typeof flags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flags[flag] === true;
}

export function getFeatureFlag(flag: FeatureFlag): boolean {
  return flags[flag] === true;
}
