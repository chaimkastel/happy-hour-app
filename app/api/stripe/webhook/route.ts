import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { ok, bad } from '@/lib/api';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return bad('STRIPE_WEBHOOK_SECRET is not configured', 'MISSING_CONFIG', 500);
  }
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return bad('Missing stripe-signature header', 'MISSING_SIGNATURE', 400);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Webhook signature verification failed:', err.message);
    }
    return bad('Invalid signature', 'INVALID_SIGNATURE', 400);
  }

  try {
    // Check for duplicate event processing
    const existingEvent = await prisma.processedEvent.findUnique({
      where: { eventId: event.id },
    });

    if (existingEvent) {
      // Return the same response as before (idempotency)
      return ok({ message: 'Event already processed' });
    }

    // Store the event as processed
    await prisma.processedEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        processedAt: new Date(),
      },
    });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Unhandled event type: ${event.type}`);
        }
    }

    return ok({ message: 'Webhook processed successfully' });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Webhook processing error:', error);
    }
    return bad('Webhook processing failed', 'PROCESSING_ERROR', 500);
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
  // Find merchant by Stripe customer ID
  const merchant = await prisma.merchant.findFirst({
    where: { stripeCustomerId: session.customer as string },
  });

  if (!merchant) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Merchant not found for customer:', session.customer);
    }
    return;
  }

  // Update merchant subscription status
  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      subscriptionStatus: 'ACTIVE',
    },
  });

  // Create or update subscription record
  await prisma.subscription.upsert({
    where: { merchantId: merchant.id },
    update: {
      plan: subscription.items.data[0]?.price.nickname || 'pro',
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionId: subscription.id,
    },
    create: {
      merchantId: merchant.id,
      plan: subscription.items.data[0]?.price.nickname || 'pro',
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionId: subscription.id,
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  
  // Find merchant by Stripe customer ID
  const merchant = await prisma.merchant.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!merchant) {
    return;
  }

  // Extend subscription period
  await prisma.subscription.update({
    where: { merchantId: merchant.id },
    data: {
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      status: subscription.status,
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find merchant by Stripe customer ID
  const merchant = await prisma.merchant.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!merchant) {
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { merchantId: merchant.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  // Update merchant status based on subscription
  let merchantStatus = 'ACTIVE';
  if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    merchantStatus = 'PAST_DUE';
  } else if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    merchantStatus = 'CANCELED';
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      subscriptionStatus: merchantStatus,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find merchant by Stripe customer ID
  const merchant = await prisma.merchant.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!merchant) {
    return;
  }

  // Mark subscription as canceled
  await prisma.subscription.update({
    where: { merchantId: merchant.id },
    data: {
      status: 'canceled',
      cancelAtPeriodEnd: true,
    },
  });

  // Update merchant status
  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      subscriptionStatus: 'CANCELED',
    },
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  
  // Find merchant by Stripe customer ID
  const merchant = await prisma.merchant.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!merchant) {
    return;
  }

  // Mark merchant as past due
  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      subscriptionStatus: 'PAST_DUE',
    },
  });

  await prisma.subscription.update({
    where: { merchantId: merchant.id },
    data: {
      status: subscription.status,
    },
  });
}
