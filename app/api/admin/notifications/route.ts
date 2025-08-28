import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    let whereClause: any = {};
    if (unreadOnly) {
      whereClause.read = false;
    }

    const notifications = await prisma.adminNotification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    const unreadCount = await prisma.adminNotification.count({
      where: { read: false }
    });

    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, message, priority, data } = body;

    const notification = await prisma.adminNotification.create({
      data: {
        type,
        title,
        message,
        priority: priority || 'medium',
        data: JSON.stringify(data || {}),
        read: false
      }
    });

    return NextResponse.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    if (id) {
      // Mark specific notification as read
      const notification = await prisma.adminNotification.update({
        where: { id },
        data: { read }
      });
      return NextResponse.json({ success: true, notification });
    } else {
      // Mark all notifications as read
      await prisma.adminNotification.updateMany({
        where: { read: false },
        data: { read: true }
      });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
