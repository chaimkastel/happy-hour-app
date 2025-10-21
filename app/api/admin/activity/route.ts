import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const activities = await prisma.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.action,
      message: `${activity.action.replace('_', ' ')} - ${activity.entity}`,
      time: activity.createdAt.toISOString(),
      status: 'completed',
      actor: activity.actor ? `${activity.actor.firstName} ${activity.actor.lastName}` : 'System',
    }));

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error('Admin activity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin activity' },
      { status: 500 }
    );
  }
}