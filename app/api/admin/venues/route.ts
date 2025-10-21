import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const venueActionSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  action: z.enum(['approve', 'reject', 'suspend', 'activate']),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (status === 'pending') {
      where.isVerified = false;
    } else if (status === 'approved') {
      where.isVerified = true;
    }

    const venues = await prisma.venue.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        deals: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        _count: {
          select: {
            deals: true,
          },
        },
      },
    });

    return NextResponse.json({ venues });
  } catch (error) {
    console.error('Admin venues error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { venueId, action } = venueActionSchema.parse(body);

    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case 'approve':
        updateData = { isVerified: true };
        break;
      case 'reject':
        updateData = { isVerified: false };
        break;
      case 'suspend':
        updateData = { isVerified: false };
        break;
      case 'activate':
        updateData = { isVerified: true };
        break;
    }

    await prisma.venue.update({
      where: { id: venueId },
      data: updateData,
    });

    // Log the admin action
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: `ADMIN_${action.toUpperCase()}_VENUE`,
        entity: 'venue',
        entityId: venueId,
        metadata: { action, venueName: venue.name },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin venue action error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    );
  }
}