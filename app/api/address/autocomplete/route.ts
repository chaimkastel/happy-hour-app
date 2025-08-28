import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.length < 3) {
      return NextResponse.json(
        { predictions: [], status: 'ZERO_RESULTS' },
        { status: 200 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.log('Google Places API key not configured, using fallback');
      // Return mock data for development
      return NextResponse.json({
        predictions: [
          {
            place_id: 'mock_1',
            description: 'New York, NY, USA',
            structured_formatting: {
              main_text: 'New York',
              secondary_text: 'NY, USA'
            }
          },
          {
            place_id: 'mock_2', 
            description: 'Los Angeles, CA, USA',
            structured_formatting: {
              main_text: 'Los Angeles',
              secondary_text: 'CA, USA'
            }
          },
          {
            place_id: 'mock_3',
            description: 'Chicago, IL, USA', 
            structured_formatting: {
              main_text: 'Chicago',
              secondary_text: 'IL, USA'
            }
          }
        ],
        status: 'OK'
      });
    }

    // Rate limiting check (basic implementation)
    const rateLimitKey = `autocomplete:${request.ip || 'unknown'}`;
    // In production, implement proper rate limiting with Redis or similar

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      `input=${encodeURIComponent(query)}&` +
      `types=address&` +
      `components=country:us&` +
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
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { error: 'Address service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Address autocomplete error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address suggestions' },
      { status: 500 }
    );
  }
}
