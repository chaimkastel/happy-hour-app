import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { ok, bad, unauthorized } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Verify the request is from Vercel Cron or has the correct secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return unauthorized('Invalid cron secret');
  }

  try {
    // Get all merchants with Stripe customer IDs
    const merchants = await prisma.merchant.findMany({
      where: {
        stripeCustomerId: {
          not: null,
        },
      },
      include: {
        subscription: true,
      },
    });

    let synced = 0;
    let errors = 0;

    for (const merchant of merchants) {
      try {
        if (!merchant.stripeCustomerId) continue;

        // Get customer from Stripe
        const customer = await stripe.customers.retrieve(merchant.stripeCustomerId);
        
        if (customer.deleted) {
          // Customer was deleted in Stripe
          await prisma.merchant.update({
            where: { id: merchant.id },
            data: {
              subscriptionStatus: 'CANCELED',
              stripeCustomerId: null,
            },
          });
          continue;
        }

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: merchant.stripeCustomerId,
          status: 'all',
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          // No active subscription
          if (merchant.subscriptionStatus !== 'CANCELED') {
            await prisma.merchant.update({
              where: { id: merchant.id },
              data: {
                subscriptionStatus: 'CANCELED',
              },
            });

            if (merchant.subscription) {
              await prisma.subscription.update({
                where: { id: merchant.subscription.id },
                data: {
                  status: 'canceled',
                },
              });
            }
          }
          continue;
        }

        const subscription = subscriptions.data[0];

        // Update subscription status
        let merchantStatus = 'ACTIVE';
        if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
          merchantStatus = 'PAST_DUE';
        } else if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
          merchantStatus = 'CANCELED';
        }

        // Update merchant
        await prisma.merchant.update({
          where: { id: merchant.id },
          data: {
            subscriptionStatus: merchantStatus,
          },
        });

        // Update or create subscription record
        await prisma.subscription.upsert({
          where: { merchantId: merchant.id },
          update: {
            plan: subscription.items.data[0]?.price.nickname || 'pro',
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeSubscriptionId: subscription.id,
          },
          create: {
            merchantId: merchant.id,
            plan: subscription.items.data[0]?.price.nickname || 'pro',
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeSubscriptionId: subscription.id,
          },
        });

        synced++;

      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`Error syncing merchant ${merchant.id}:`, error);
        }
        errors++;
      }
    }

    // Clean up old processed events (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await prisma.processedEvent.deleteMany({
      where: {
        processedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // Clean up old idempotency keys (older than 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    await prisma.idempotencyKey.deleteMany({
      where: {
        expiresAt: {
          lt: oneDayAgo,
        },
      },
    });

    return ok({
      message: 'Reconciliation completed',
      synced,
      errors,
      total: merchants.length,
    });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Reconciliation error:', error);
    }
    return bad('Reconciliation failed', 'RECONCILIATION_ERROR', 500);
  }
}

