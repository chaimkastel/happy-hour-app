import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { smartGeocode } from '@/lib/geocoding';

// Type assertion for session
type SessionWithUser = {
  user: {
    email: string;
    [key: string]: any;
  };
};

// GET /api/merchant/venues - Get merchant's venues
export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return sample venues if no session
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      // Demo mode - return sample venues
      const sampleVenues = [
        {
          id: 'demo-1',
          name: 'Demo Restaurant',
          address: '123 Demo Street, New York, NY',
          businessType: '["Restaurant"]',
          priceTier: 'MODERATE',
          rating: 4.5,
          isVerified: true,
          photos: '[]',
          hours: '{}',
          latitude: 40.7128,
          longitude: -74.0060
        }
      ];
      
      return NextResponse.json({ 
        venues: sampleVenues,
        total: sampleVenues.length 
      });
    }

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } },
      include: { venues: true }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      venues: merchant.venues,
      total: merchant.venues.length 
    });
  } catch (error) {
    console.error('Error fetching merchant venues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/merchant/venues - Create new venue
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      // Demo mode - simulate venue creation
      const venueData = await request.json();
      
      const demoVenue = {
        id: `demo-${Date.now()}`,
        name: venueData.name,
        address: venueData.address,
        businessType: JSON.stringify(venueData.businessType || []),
        priceTier: venueData.priceTier || 'MODERATE',
        rating: 0,
        isVerified: false,
        photos: '[]',
        hours: '{}',
        latitude: 40.7128,
        longitude: -74.0060,
        createdAt: new Date().toISOString()
      };
      
      return NextResponse.json({ 
        venue: demoVenue,
        message: 'Demo venue created successfully!'
      }, { status: 201 });
    }

    // Handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    let venueData: any = {};

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extract form fields
      venueData = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        businessType: formData.get('businessType') ? JSON.parse(formData.get('businessType') as string) : [],
        priceTier: formData.get('priceTier') as string,
        hours: formData.get('hours') ? JSON.parse(formData.get('hours') as string) : {},
        description: formData.get('description') as string,
        contactInfo: formData.get('contactInfo') ? JSON.parse(formData.get('contactInfo') as string) : {},
        amenities: formData.get('amenities') ? JSON.parse(formData.get('amenities') as string) : [],
        capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : 50,
      };

      // Handle file uploads (for now, we'll just store the filenames)
      const photos: string[] = [];
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('photo_') && value instanceof File) {
          // In a real app, you'd upload to cloud storage
          photos.push(value.name);
        }
      }
      venueData.photos = photos;
    } else {
      venueData = await request.json();
    }

    const { 
      name, 
      address, 
      businessType, 
      priceTier, 
      hours, 
      description,
      contactInfo,
      amenities,
      capacity,
      photos
    } = venueData;

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Geocode the address to get coordinates
    const geocodingResult = await smartGeocode(address);
    
    // Create the venue with enhanced data
    const venue = await prisma.venue.create({
      data: {
        merchantId: merchant.id,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        address,
        latitude: geocodingResult.latitude,
        longitude: geocodingResult.longitude,
        businessType: JSON.stringify(Array.isArray(businessType) ? businessType : businessType || []),
        priceTier: priceTier || 'MODERATE',
        hours: hours ? JSON.stringify(hours) : '{}',
        photos: photos ? JSON.stringify(photos) : '[]',
        isVerified: false, // New venues start unverified
        rating: 0,
        // Store additional data in photos field for now
        // In a real app, you'd add these fields to the schema
        // Note: metadata field doesn't exist in current schema
      }
    });

    return NextResponse.json({ 
      venue,
      message: 'Venue created successfully!'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating venue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
