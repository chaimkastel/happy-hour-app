// Geocoding service for converting addresses to coordinates
// This service provides fallback options for geocoding

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
  place_id?: string;
}

export interface GeocodingError {
  error: string;
  message: string;
}

// Free geocoding service using OpenStreetMap Nominatim
export async function geocodeAddress(address: string): Promise<GeocodingResult | GeocodingError> {
  try {
    // Clean and format the address
    const cleanAddress = address.trim().replace(/\s+/g, '+');
    
    // Use OpenStreetMap Nominatim (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'HappyHourApp/1.0' // Required by Nominatim
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding service error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      // Fallback to a default location (Sydney, Australia)
      console.warn(`No geocoding results for address: ${address}`);
      return {
        latitude: -33.8688,
        longitude: 151.2093,
        formatted_address: address
      };
    }

    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      formatted_address: result.display_name,
      place_id: result.place_id
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    
    // Return a default location as fallback
    return {
      latitude: -33.8688, // Sydney, Australia
      longitude: 151.2093,
      formatted_address: address
    };
  }
}

// Batch geocoding for multiple addresses
export async function geocodeAddresses(addresses: string[]): Promise<(GeocodingResult | GeocodingError)[]> {
  const results = await Promise.allSettled(
    addresses.map(address => geocodeAddress(address))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Geocoding failed for address ${index}:`, result.reason);
      return {
        error: 'geocoding_failed',
        message: result.reason?.message || 'Unknown geocoding error'
      } as GeocodingError;
    }
  });
}

// Reverse geocoding - convert coordinates to address
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult | GeocodingError> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'HappyHourApp/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding service error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.display_name) {
      throw new Error('No reverse geocoding results found');
    }

    return {
      latitude,
      longitude,
      formatted_address: data.display_name,
      place_id: data.place_id
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      error: 'reverse_geocoding_failed',
      message: error instanceof Error ? error.message : 'Unknown reverse geocoding error'
    } as GeocodingError;
  }
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Validate coordinates
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
}

// Get coordinates for major cities (fallback data)
export const MAJOR_CITIES: Record<string, { latitude: number; longitude: number }> = {
  'sydney': { latitude: -33.8688, longitude: 151.2093 },
  'melbourne': { latitude: -37.8136, longitude: 144.9631 },
  'brisbane': { latitude: -27.4698, longitude: 153.0251 },
  'perth': { latitude: -31.9505, longitude: 115.8605 },
  'adelaide': { latitude: -34.9285, longitude: 138.6007 },
  'new york': { latitude: 40.7128, longitude: -74.0060 },
  'london': { latitude: 51.5074, longitude: -0.1278 },
  'tokyo': { latitude: 35.6762, longitude: 139.6503 },
  'paris': { latitude: 48.8566, longitude: 2.3522 },
  'los angeles': { latitude: 34.0522, longitude: -118.2437 },
  'chicago': { latitude: 41.8781, longitude: -87.6298 },
  'houston': { latitude: 29.7604, longitude: -95.3698 },
  'phoenix': { latitude: 33.4484, longitude: -112.0740 },
  'philadelphia': { latitude: 39.9526, longitude: -75.1652 },
  'san antonio': { latitude: 29.4241, longitude: -98.4936 },
  'san diego': { latitude: 32.7157, longitude: -117.1611 },
  'dallas': { latitude: 32.7767, longitude: -96.7970 },
  'san jose': { latitude: 37.3382, longitude: -121.8863 },
  'austin': { latitude: 30.2672, longitude: -97.7431 },
  'jacksonville': { latitude: 30.3322, longitude: -81.6557 }
};

// Smart geocoding with city fallback
export async function smartGeocode(address: string): Promise<GeocodingResult> {
  // First try normal geocoding
  const result = await geocodeAddress(address);
  
  // If geocoding failed, try to match against major cities
  if ('error' in result) {
    const lowerAddress = address.toLowerCase();
    
    for (const [city, coords] of Object.entries(MAJOR_CITIES)) {
      if (lowerAddress.includes(city)) {
        console.log(`Using fallback coordinates for city: ${city}`);
        return {
          latitude: coords.latitude,
          longitude: coords.longitude,
          formatted_address: address
        };
      }
    }
    
    // Final fallback to Sydney
    console.warn(`Using default coordinates for address: ${address}`);
    return {
      latitude: -33.8688,
      longitude: 151.2093,
      formatted_address: address
    };
  }
  
  return result;
}
