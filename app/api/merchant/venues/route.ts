import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

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
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Create the venue with enhanced data
    const venue = await prisma.venue.create({
      data: {
        merchantId: merchant.id,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        address,
        latitude: 0, // TODO: Add geocoding
        longitude: 0, // TODO: Add geocoding
        businessType: Array.isArray(businessType) ? businessType : businessType || [],
        priceTier: priceTier || 'MODERATE',
        hours: hours ? JSON.stringify(hours) : '{}',
        photos: photos ? JSON.stringify(photos) : '[]',
        isVerified: false, // New venues start unverified
        rating: 0,
        // Store additional data in metadata for now
        // In a real app, you'd add these fields to the schema
        metadata: JSON.stringify({
          description,
          contactInfo,
          amenities,
          capacity
        })
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
