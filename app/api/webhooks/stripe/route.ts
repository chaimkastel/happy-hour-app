import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ 
      error: 'Stripe is not configured' 
    }, { status: 503 });
  }

  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  try {
    const { constructWebhookEvent } = await import('@/lib/stripe');
    const event = await constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Update merchant subscription status
        await prisma.merchant.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: 'ACTIVE',
            approved: true,
          },
        });

        await logAuditEvent({
          action: AUDIT_ACTIONS.MERCHANT_SUBSCRIBE,
          entity: 'merchant',
          entityId: customerId,
          metadata: { subscriptionId },
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        let status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' = 'INCOMPLETE';
        
        switch (subscription.status) {
          case 'active':
            status = 'ACTIVE';
            break;
          case 'past_due':
            status = 'PAST_DUE';
            break;
          case 'canceled':
          case 'unpaid':
            status = 'CANCELED';
            break;
          default:
            status = 'INCOMPLETE';
        }

        await prisma.merchant.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: status },
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await prisma.merchant.updateMany({
          where: { stripeCustomerId: customerId },
          data: { 
            subscriptionStatus: 'CANCELED',
          },
        });

        await logAuditEvent({
          action: AUDIT_ACTIONS.MERCHANT_CANCEL_SUBSCRIPTION,
          entity: 'merchant',
          entityId: customerId,
          metadata: { subscriptionId: subscription.id },
        });

        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        await prisma.merchant.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'ACTIVE' },
        });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        await prisma.merchant.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: 'PAST_DUE' },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}