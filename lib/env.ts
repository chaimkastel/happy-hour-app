// Environment variable utilities

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

export function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

export function getEnvWithDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export function isFeatureEnabled(feature: string): boolean {
  const value = process.env[`FEATURE_${feature.toUpperCase()}`];
  return value === 'true' || value === '1';
}

export function getFeatureFlag(feature: string, defaultValue: boolean = false): boolean {
  const value = process.env[`FEATURE_${feature.toUpperCase()}`];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

export function getEmailConfig() {
  return {
    apiKey: getRequiredEnv('RESEND_API_KEY'),
    fromEmail: getEnvWithDefault('FROM_EMAIL', 'noreply@orderhappyhour.com'),
    fromName: getEnvWithDefault('FROM_NAME', 'OrderHappyHour'),
  };
}