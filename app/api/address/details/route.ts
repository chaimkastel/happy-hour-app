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
      console.error('Google Places API key not configured');
      return NextResponse.json(
        { error: 'Address service not configured' },
        { status: 500 }
      );
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
