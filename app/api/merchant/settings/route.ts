import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      settings: {
        companyName: merchant.companyName,
        contactEmail: merchant.contactEmail,
        approved: merchant.approved,
        subscriptionStatus: merchant.subscriptionStatus
      },
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName,
        approved: merchant.approved
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
    const { companyName, contactEmail } = body;

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Update merchant basic info
    const updatedMerchant = await prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        companyName: companyName || merchant.companyName,
        contactEmail: contactEmail || merchant.contactEmail
      }
    });

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      merchant: updatedMerchant
    });
  } catch (error) {
    console.error('Error updating merchant settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
