import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('place_id');

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.log('Google Places API key not configured, using fallback');
      // Return mock data for development
      const mockData = {
        mock_1: {
          place_id: 'mock_1',
          formatted_address: 'New York, NY, USA',
          address_components: [
            { long_name: 'New York', short_name: 'NY', types: ['locality', 'political'] },
            { long_name: 'New York', short_name: 'NY', types: ['administrative_area_level_1', 'political'] },
            { long_name: 'United States', short_name: 'US', types: ['country', 'political'] }
          ],
          geometry: {
            location: { lat: 40.7128, lng: -74.0060 }
          }
        },
        mock_2: {
          place_id: 'mock_2',
          formatted_address: 'Los Angeles, CA, USA',
          address_components: [
            { long_name: 'Los Angeles', short_name: 'LA', types: ['locality', 'political'] },
            { long_name: 'California', short_name: 'CA', types: ['administrative_area_level_1', 'political'] },
            { long_name: 'United States', short_name: 'US', types: ['country', 'political'] }
          ],
          geometry: {
            location: { lat: 34.0522, lng: -118.2437 }
          }
        },
        mock_3: {
          place_id: 'mock_3',
          formatted_address: 'Chicago, IL, USA',
          address_components: [
            { long_name: 'Chicago', short_name: 'Chicago', types: ['locality', 'political'] },
            { long_name: 'Illinois', short_name: 'IL', types: ['administrative_area_level_1', 'political'] },
            { long_name: 'United States', short_name: 'US', types: ['country', 'political'] }
          ],
          geometry: {
            location: { lat: 41.8781, lng: -87.6298 }
          }
        }
      };
      
      const mockResult = mockData[placeId as keyof typeof mockData];
      if (mockResult) {
        return NextResponse.json(mockResult);
      } else {
        return NextResponse.json(
          { error: 'Mock location not found' },
          { status: 404 }
        );
      }
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${encodeURIComponent(placeId)}&` +
      `fields=place_id,formatted_address,address_components,geometry&` +
      `key=${apiKey}`,
      {
        headers: {
          'User-Agent': 'HappyHour/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    // Handle API errors
    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { error: 'Address details not available' },
        { status: 404 }
      );
    }

    return NextResponse.json(data.result);

  } catch (error) {
    console.error('Address details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address details' },
      { status: 500 }
    );
  }
}
