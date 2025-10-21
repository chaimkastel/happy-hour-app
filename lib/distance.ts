/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

/**
 * Check if a venue is open based on current time and business hours
 * @param hours Business hours object
 * @param timezone Venue timezone (IANA format)
 * @returns Boolean indicating if venue is open
 */
export function isVenueOpen(
  hours: { [key: string]: { open: string; close: string } } | null,
  timezone: string = 'UTC'
): boolean {
  if (!hours) return true; // Assume open if no hours provided

  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { 
    weekday: 'long',
    timeZone: timezone 
  }).toLowerCase();

  const todayHours = hours[dayOfWeek];
  if (!todayHours) return false;

  const currentTime = now.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit'
  });

  return currentTime >= todayHours.open && currentTime <= todayHours.close;
}

/**
 * Get time until venue opens/closes
 * @param hours Business hours object
 * @param timezone Venue timezone
 * @returns Object with next event and time remaining
 */
export function getNextVenueEvent(
  hours: { [key: string]: { open: string; close: string } } | null,
  timezone: string = 'UTC'
): { event: 'open' | 'close' | 'unknown'; timeRemaining: string } | null {
  if (!hours) return null;

  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { 
    weekday: 'long',
    timeZone: timezone 
  }).toLowerCase();

  const todayHours = hours[dayOfWeek];
  if (!todayHours) return null;

  const currentTime = now.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit'
  });

  if (currentTime < todayHours.open) {
    // Venue opens later today
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    
    const openTime = new Date();
    openTime.setHours(openHour, openMin, 0, 0);
    
    const currentTimeDate = new Date();
    currentTimeDate.setHours(currentHour, currentMin, 0, 0);
    
    const diffMs = openTime.getTime() - currentTimeDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      event: 'open',
      timeRemaining: `${diffHours}h ${diffMins}m`
    };
  } else if (currentTime < todayHours.close) {
    // Venue closes later today
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    
    const closeTime = new Date();
    closeTime.setHours(closeHour, closeMin, 0, 0);
    
    const currentTimeDate = new Date();
    currentTimeDate.setHours(currentHour, currentMin, 0, 0);
    
    const diffMs = closeTime.getTime() - currentTimeDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      event: 'close',
      timeRemaining: `${diffHours}h ${diffMins}m`
    };
  }

  return null;
}

/**
 * Sort deals by distance from user location
 * @param deals Array of deals with venue coordinates
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @returns Sorted deals array
 */
export function sortDealsByDistance<T extends { venue: { latitude: number; longitude: number } }>(
  deals: T[],
  userLat: number,
  userLng: number
): (T & { distance: number })[] {
  return deals
    .map(deal => ({
      ...deal,
      distance: calculateDistance(
        userLat,
        userLng,
        deal.venue.latitude,
        deal.venue.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Filter deals within a certain radius
 * @param deals Array of deals with venue coordinates
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @param maxDistance Maximum distance in kilometers
 * @returns Filtered deals array
 */
export function filterDealsByDistance<T extends { venue: { latitude: number; longitude: number } }>(
  deals: T[],
  userLat: number,
  userLng: number,
  maxDistance: number
): (T & { distance: number })[] {
  return deals
    .map(deal => ({
      ...deal,
      distance: calculateDistance(
        userLat,
        userLng,
        deal.venue.latitude,
        deal.venue.longitude
      )
    }))
    .filter(deal => deal.distance <= maxDistance);
}

