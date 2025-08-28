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

// GET /api/merchant/settings - Get merchant's settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the merchant settings for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } },
      include: { settings: true }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      settings: merchant.settings || {},
      merchant: {
        id: merchant.id,
        businessName: merchant.businessName,
        kycStatus: merchant.kycStatus
      }
    });
  } catch (error) {
    console.error('Error fetching merchant settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/merchant/settings - Update merchant's settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { businessHours, quietWindows, defaultRules, notifications, payoutSettings } = body;

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Update or create settings
    const settings = await prisma.merchantSettings.upsert({
      where: { merchantId: merchant.id },
      update: {
        businessHours: businessHours ? JSON.stringify(businessHours) : undefined,
        quietWindows: quietWindows ? JSON.stringify(quietWindows) : undefined,
        defaultRules: defaultRules ? JSON.stringify(defaultRules) : undefined,
        notifications: notifications ? JSON.stringify(notifications) : undefined,
        payoutSettings: payoutSettings ? JSON.stringify(payoutSettings) : undefined
      },
      create: {
        merchantId: merchant.id,
        businessHours: businessHours ? JSON.stringify(businessHours) : '{}',
        quietWindows: quietWindows ? JSON.stringify(quietWindows) : '[]',
        defaultRules: defaultRules ? JSON.stringify(defaultRules) : '{}',
        notifications: notifications ? JSON.stringify(notifications) : '{}',
        payoutSettings: payoutSettings ? JSON.stringify(payoutSettings) : '{}'
      }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating merchant settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
