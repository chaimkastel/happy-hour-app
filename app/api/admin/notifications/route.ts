import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get recent audit logs as notifications
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Transform audit logs to notification format
    const notifications = auditLogs.map(log => ({
      id: log.id,
      type: 'audit',
      title: `${log.action} - ${log.entity}`,
      message: `Action performed on ${log.entity} by ${log.actorUserId || 'System'}`,
      priority: 'medium',
      read: false,
      createdAt: log.createdAt,
      data: log.metadata
    }));

    return NextResponse.json({
      notifications,
      unreadCount: notifications.length
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

    // Create an audit log entry for the notification
    const auditLog = await prisma.auditLog.create({
      data: {
        action: 'NOTIFICATION_CREATED',
        entity: 'NOTIFICATION',
        entityId: 'system',
        metadata: {
          type,
          title,
          message,
          priority: priority || 'medium',
          data: data || {}
        }
      }
    });

    return NextResponse.json({
      success: true,
      notification: {
        id: auditLog.id,
        type,
        title,
        message,
        priority: priority || 'medium',
        read: false,
        createdAt: auditLog.createdAt
      }
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

    // For now, just return success since we don't have a read status
    return NextResponse.json({ 
      success: true, 
      message: 'Notification status updated' 
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
