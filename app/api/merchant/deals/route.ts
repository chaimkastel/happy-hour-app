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

    // Get merchant's deals through their venues
    const deals = await prisma.deal.findMany({
      where: {
        venue: {
          merchantId: session.user.id
        }
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Error fetching merchant deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
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
    const { 
      title, 
      description, 
      percentOff, 
      venueId, 
      startAt, 
      endAt, 
      minSpend, 
      maxRedemptions, 
      tags 
    } = body;

    // Validate required fields
    if (!title || !description || !percentOff || !venueId || !startAt || !endAt) {
      return NextResponse.json({ 
        error: 'Title, description, percentOff, venueId, startAt, and endAt are required' 
      }, { status: 400 });
    }

    // Verify venue belongs to merchant
    const venue = await prisma.venue.findFirst({
      where: {
        id: venueId,
        merchantId: session.user.id
      }
    });

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found or access denied' }, { status: 404 });
    }

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        percentOff: parseInt(percentOff),
        venueId,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        minSpend: minSpend ? parseFloat(minSpend) : null,
        maxRedemptions: maxRedemptions ? parseInt(maxRedemptions) : 100,
        tags: tags || '[]',
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}