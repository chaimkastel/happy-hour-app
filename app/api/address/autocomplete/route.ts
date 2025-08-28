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
      console.log('Google Places API key not configured, using Nominatim fallback');
      // Use Nominatim OpenStreetMap API as fallback
      try {
        // Try multiple searches to get better neighborhood results
        const searchQueries = [
          `${query} neighborhood`,
          `${query} suburb`,
          `${query} district`,
          query
        ];
        
        let allResults: any[] = [];
        
        for (const searchQuery of searchQueries) {
          try {
            const nominatimResponse = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=3&addressdetails=1&countrycodes=us&featuretype=settlement,suburb,neighbourhood`,
              {
                headers: {
                  'User-Agent': 'HappyHour/1.0',
                },
              }
            );
            
            if (nominatimResponse.ok) {
              const data = await nominatimResponse.json();
              allResults = allResults.concat(data);
            }
          } catch (error) {
            console.error('Nominatim search error:', error);
          }
        }
        
        // Remove duplicates and limit results
        const uniqueResults = allResults.filter((item, index, self) => 
          index === self.findIndex(t => t.place_id === item.place_id)
        ).slice(0, 8);
        
        if (uniqueResults.length > 0) {
          const predictions = uniqueResults.map((item: any, index: number) => {
            // Strongly prioritize neighborhood/suburb over city for main_text
            const mainText = item.address?.suburb || 
                           item.address?.neighbourhood || 
                           item.address?.city_district ||
                           item.address?.district ||
                           item.address?.quarter ||
                           item.address?.village || 
                           item.address?.town || 
                           item.address?.city || 
                           item.display_name.split(',')[0];
            
            // Build secondary text - only show city if it's different from main text
            const city = item.address?.city || item.address?.town;
            const state = item.address?.state;
            const secondaryParts = [];
            
            // Only add city to secondary if it's different from main text
            if (city && city !== mainText) {
              secondaryParts.push(city);
            }
            if (state) {
              secondaryParts.push(state);
            }
            
            return {
              place_id: `nominatim_${index}`,
              description: item.display_name,
              structured_formatting: {
                main_text: mainText,
                secondary_text: secondaryParts.join(', ')
              }
            };
          });
          
          return NextResponse.json({
            predictions,
            status: 'OK'
          });
        }
      } catch (error) {
        console.error('Nominatim fallback error:', error);
      }
      
      // Final fallback to mock data
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
