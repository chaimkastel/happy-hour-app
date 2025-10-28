// Deal-related utilities

import { API_BASE } from './config';

export interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  originalPrice?: number;
  discountedPrice?: number;
  startAt: string;
  endAt: string;
  image?: string;
  status: string;
  venue: {
    id: string;
    name: string;
    address: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
    businessType?: string[];
  };
}

/**
 * Fetch a deal by ID from the API
 */
export async function fetchDeal(id: string): Promise<Deal | null> {
  try {
    const response = await fetch(`${API_BASE}/api/deals/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch deal: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching deal:', error);
    return null;
  }
}

/**
 * Get deal by route parameter (supports both id and slug)
 * This is a placeholder - in a real app, you'd have a slug→id mapping
 */
export async function getDealByRouteParam(param: string): Promise<Deal | null> {
  // For now, treat the param as an ID
  // In the future, you could add slug resolution logic here
  return fetchDeal(param);
}

/**
 * Check if a deal is currently active (within time window)
 */
export function isDealActive(deal: Deal): boolean {
  if (deal.status !== 'ACTIVE') return false;
  
  const now = new Date();
  const start = new Date(deal.startAt);
  const end = new Date(deal.endAt);
  
  return now >= start && now <= end;
}

