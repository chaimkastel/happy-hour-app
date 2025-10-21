import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { ok, bad, unauthorized } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'MERCHANT') {
    return unauthorized('Merchant access required');
  }

  try {
    // Find merchant
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
      include: {
        subscription: true,
      },
    });

    if (!merchant) {
      return bad('Merchant not found', 'MERCHANT_NOT_FOUND', 404);
    }

    if (!merchant.stripeCustomerId) {
      return bad('No Stripe customer found', 'NO_CUSTOMER', 400);
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: merchant.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/merchant/billing`,
    });

    return ok({
      url: portalSession.url,
    });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Portal session error:', error);
    }
    return bad('Failed to create portal session', 'PORTAL_ERROR', 500);
  }
}

