// Central configuration for Happy Hour app

export const IS_PROD = process.env.NODE_ENV === 'production';

export const API_BASE = IS_PROD 
  ? 'https://orderhappyhour.com' 
  : 'http://localhost:3000';

// Defaults
export const DEFAULT_RADIUS_MILES = 3;
export const DEFAULT_TIME_WINDOW = 'Now–7pm';

// Environment variables
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

// API endpoints
export const API_ENDPOINTS = {
  DEALS: '/api/deals',
  DEAL: (id: string) => `/api/deals/${id}`,
  FAVORITES: '/api/favorite',
  REDEEM: '/api/wallet/claim',
  SEARCH: '/api/deals/search',
} as const;

// Image settings
export const IMAGE_ASPECT_RATIO = '16/10';
export const IMAGE_WIDTH = 800;
export const IMAGE_HEIGHT = 600;

