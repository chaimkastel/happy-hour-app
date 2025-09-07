import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has merchant or admin role
    if (session.user.role !== 'MERCHANT' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get merchant's venues
    const venues = await prisma.venue.findMany({
      where: { merchantId: session.user.id },
      include: {
        deals: {
          select: {
            id: true,
            title: true,
            percentOff: true,
            status: true,
            startAt: true,
            endAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ venues });
  } catch (error) {
    console.error('Error fetching merchant venues:', error);
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has merchant or admin role
    if (session.user.role !== 'MERCHANT' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, latitude, longitude, businessType, priceTier, hours, photos } = body;

    // Validate required fields
    if (!name || !address || !latitude || !longitude) {
      return NextResponse.json({ error: 'Name, address, and coordinates are required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    // Create venue
    const venue = await prisma.venue.create({
      data: {
        merchantId: session.user.id,
        name,
        slug,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        businessType: businessType || '[]',
        priceTier: priceTier || 'MODERATE',
        hours: hours || '{}',
        photos: photos || '[]',
        isVerified: false
      }
    });

    return NextResponse.json({ venue }, { status: 201 });
  } catch (error) {
    console.error('Error creating venue:', error);
    return NextResponse.json({ error: 'Failed to create venue' }, { status: 500 });
  }
}