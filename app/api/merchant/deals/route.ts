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

// GET /api/merchant/deals - Get merchant's deals
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } },
      include: {
        venues: {
          include: {
            deals: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Flatten all deals from all venues
    const deals = merchant.venues.flatMap(venue => 
      venue.deals.map(deal => ({
        ...deal,
        venue: { id: venue.id, name: venue.name }
      }))
    );

    return NextResponse.json({ 
      deals,
      total: deals.length 
    });
  } catch (error) {
    console.error('Error fetching merchant deals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/merchant/deals - Create new deal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    let dealData: any = {};

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extract form fields
      dealData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        percentOff: parseInt(formData.get('percentOff') as string),
        dealType: formData.get('dealType') as string,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        startTime: formData.get('startTime') as string,
        endTime: formData.get('endTime') as string,
        maxRedemptions: parseInt(formData.get('maxRedemptions') as string),
        minOrderAmount: parseFloat(formData.get('minOrderAmount') as string) || 0,
        applicableItems: formData.get('applicableItems') as string,
        terms: formData.get('terms') as string,
        isActive: formData.get('isActive') === 'true',
        flashDuration: formData.get('flashDuration') ? parseInt(formData.get('flashDuration') as string) : null,
        scheduleDays: formData.get('scheduleDays') ? JSON.parse(formData.get('scheduleDays') as string) : [],
        scheduleFrequency: formData.get('scheduleFrequency') as string,
        scheduleEndDate: formData.get('scheduleEndDate') as string,
        recurringPattern: formData.get('recurringPattern') as string,
        recurringInterval: formData.get('recurringInterval') ? parseInt(formData.get('recurringInterval') as string) : 1,
        recurringEndDate: formData.get('recurringEndDate') as string,
      };

      // Handle file uploads (for now, we'll just store the filenames)
      const images: string[] = [];
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('image_') && value instanceof File) {
          // In a real app, you'd upload to cloud storage
          images.push(value.name);
        }
      }
      dealData.images = images;
    } else {
      dealData = await request.json();
    }

    const { 
      title, 
      description, 
      percentOff, 
      dealType, 
      startDate, 
      endDate, 
      startTime, 
      endTime, 
      maxRedemptions, 
      minOrderAmount, 
      applicableItems, 
      terms, 
      isActive,
      flashDuration,
      scheduleDays,
      scheduleFrequency,
      scheduleEndDate,
      recurringPattern,
      recurringInterval,
      recurringEndDate,
      images
    } = dealData;

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } },
      include: { venues: true }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Use the first venue for now (in a real app, you'd let them select)
    const venue = merchant.venues[0];
    if (!venue) {
      return NextResponse.json({ error: 'No venues found. Please create a venue first.' }, { status: 400 });
    }

    // Calculate start and end times
    const startAt = new Date(`${startDate}T${startTime || '00:00'}`);
    const endAt = new Date(`${endDate}T${endTime || '23:59'}`);

    // Create the deal with enhanced data
    const deal = await prisma.deal.create({
      data: {
        venueId: venue.id,
        title,
        description: description || '',
        percentOff,
        startAt,
        endAt,
        maxRedemptions: maxRedemptions || 100,
        redeemedCount: 0,
        minSpend: minOrderAmount || null,
        inPersonOnly: true,
        tags: JSON.stringify([dealType, applicableItems].filter(Boolean)),
        status: 'PENDING_APPROVAL', // All deals require admin approval
        // Store additional deal type data in tags for now
        // In a real app, you'd add these fields to the schema
        // Note: metadata field doesn't exist in current schema, storing in tags instead
      }
    });

    return NextResponse.json({ 
      deal,
      message: 'Deal submitted for approval! Our team will review it within 24 hours and notify you once it\'s live.'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
