import { AddressData, GooglePlaceResult } from '@/types/address';

/**
 * Parse Google Places API result into structured address data
 */
export function parseGooglePlaceResult(place: GooglePlaceResult): AddressData {
  const components = place.address_components.reduce((acc, component) => {
    const types = component.types;
    
    if (types.includes('street_number')) {
      acc.streetNumber = component.long_name;
    } else if (types.includes('route')) {
      acc.route = component.long_name;
    } else if (types.includes('subpremise')) {
      acc.street2 = component.long_name;
    } else if (types.includes('locality')) {
      acc.city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      acc.state = component.short_name;
    } else if (types.includes('postal_code')) {
      acc.postalCode = component.long_name;
    } else if (types.includes('country')) {
      acc.country = component.short_name;
    }
    
    return acc;
  }, {} as any);

  // Build street1 from street number and route
  const street1 = [components.streetNumber, components.route]
    .filter(Boolean)
    .join(' ');

  return {
    formatted: place.formatted_address,
    components: {
      street1: street1 || '',
      street2: components.street2 || undefined,
      city: components.city || '',
      state: components.state || '',
      postalCode: components.postalCode || '',
      country: components.country || 'US'
    },
    coordinates: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    },
    placeId: place.place_id
  };
}

/**
 * Validate address data completeness
 */
export function validateAddressData(address: AddressData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!address.components.street1.trim()) {
    errors.push('Street address is required');
  }
  
  if (!address.components.city.trim()) {
    errors.push('City is required');
  }
  
  if (!address.components.state.trim()) {
    errors.push('State is required');
  }
  
  if (!address.components.postalCode.trim()) {
    errors.push('Postal code is required');
  }
  
  if (!address.coordinates.lat || !address.coordinates.lng) {
    errors.push('Valid coordinates are required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format address for display
 */
export function formatAddressForDisplay(address: AddressData): string {
  const { components } = address;
  return `${components.street1}, ${components.city}, ${components.state} ${components.postalCode}`;
}
