import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const billingPortalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'MERCHANT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = await billingPortalRateLimit(request);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult.remaining,
      rateLimitResult.resetTime || Date.now()
    );
  }

  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        error: 'Stripe is not configured. Please contact support.' 
      }, { status: 503 });
    }

    const { createBillingPortalSession } = await import('@/lib/stripe');
    
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    });

    if (!merchant || !merchant.subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // For now, we'll use a placeholder customer ID since the field doesn't exist
    const portalSession = await createBillingPortalSession(
      'placeholder_customer_id',
      `${process.env.NEXTAUTH_URL}/merchant/dashboard`
    );

    return NextResponse.json({ 
      url: portalSession.url 
    });
  } catch (error) {
    console.error('Billing portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}
