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

// Force dynamic rendering for activity API
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check here
    // For now, allow any authenticated user to access owner activity

    // Get recent platform activity
    const activities = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: {
          select: { businessName: true }
        }
      }
    });

    // Transform audit logs into activity format
    const transformedActivities = activities.map((log: any) => {
      let type: 'merchant_signup' | 'deal_created' | 'redemption' | 'venue_verified' | 'payment_processed';
      let description: string;
      let status: 'success' | 'pending' | 'failed';

      // Determine activity type and description based on audit log
      switch (log.action) {
        case 'CREATE':
          if (log.entityType === 'MERCHANT') {
            type = 'merchant_signup';
            description = `New merchant signed up: ${log.merchant?.businessName || 'Unknown'}`;
          } else if (log.entityType === 'DEAL') {
            type = 'deal_created';
            description = `New deal created by ${log.merchant?.businessName || 'Unknown'}`;
          } else if (log.entityType === 'VENUE') {
            type = 'venue_verified';
            description = `New venue added by ${log.merchant?.businessName || 'Unknown'}`;
          } else {
            type = 'merchant_signup';
            description = `New ${log.entityType.toLowerCase()} created by ${log.merchant?.businessName || 'Unknown'}`;
          }
          break;
        case 'UPDATE':
          if (log.entityType === 'VENUE' && log.changes?.includes('verified')) {
            type = 'venue_verified';
            description = `Venue verified by ${log.merchant?.businessName || 'Unknown'}`;
          } else {
            type = 'merchant_signup';
            description = `${log.entityType} updated by ${log.merchant?.businessName || 'Unknown'}`;
          }
          break;
        case 'REDEEM':
          type = 'redemption';
          description = `Deal redeemed from ${log.merchant?.businessName || 'Unknown'}`;
          break;
        default:
          type = 'merchant_signup';
          description = `${log.action} on ${log.entityType} by ${log.merchant?.businessName || 'Unknown'}`;
      }

      // Determine status (simplified)
      status = log.action === 'CREATE' || log.action === 'UPDATE' ? 'success' : 'pending';

      return {
        id: log.id,
        type,
        description,
        timestamp: log.createdAt.toISOString(),
        status
      };
    });

    return NextResponse.json({
      activities: transformedActivities,
      total: transformedActivities.length
    });
  } catch (error) {
    console.error('Error fetching owner activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
