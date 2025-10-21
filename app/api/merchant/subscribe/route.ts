import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';

export const dynamic = 'force-dynamic';

const subscribeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'MERCHANT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = await subscribeRateLimit(request);
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

    const { createCheckoutSession, createStripeCustomer } = await import('@/lib/stripe');

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    if (merchant.subscriptionStatus === 'ACTIVE') {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
    }

    let customerId = merchant.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createStripeCustomer(
        merchant.contactEmail || merchant.user.email,
        merchant.companyName || merchant.businessName
      );
      customerId = customer.id;

      await prisma.merchant.update({
        where: { id: merchant.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      customerId,
      process.env.STRIPE_PRICE_MONTHLY!,
      `${process.env.NEXTAUTH_URL}/merchant/dashboard?success=true`,
      `${process.env.NEXTAUTH_URL}/merchant/dashboard?canceled=true`
    );

    await logAuditEvent({
      actorUserId: session.user.id,
      action: AUDIT_ACTIONS.MERCHANT_SUBSCRIBE,
      entity: 'merchant',
      entityId: merchant.id,
      metadata: { checkoutSessionId: checkoutSession.id },
    });

    return NextResponse.json({ 
      url: checkoutSession.url 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
