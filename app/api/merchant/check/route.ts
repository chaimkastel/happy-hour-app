import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Force dynamic rendering for merchant check API
export const dynamic = 'force-dynamic';

// Type assertion for session
type SessionWithUser = {
  user: {
    email: string;
    [key: string]: any;
  };
};

// GET /api/merchant/check - Check if user is a merchant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a merchant
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } },
      include: { 
        user: true,
        venues: true 
      }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Not a merchant' }, { status: 404 });
    }

    return NextResponse.json({ 
      merchant: {
        id: merchant.id,
        businessName: merchant.businessName,
        email: merchant.user.email,
        kycStatus: merchant.kycStatus,
        venueCount: merchant.venues.length
      }
    });
  } catch (error) {
    console.error('Error checking merchant status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
