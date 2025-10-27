import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set. Please configure your Stripe key in environment variables.');
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Lazy initialization - only initialize when actually used
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const instance = getStripe();
    const value = instance[prop as keyof Stripe];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

export function getStripeConfig() {
  return {
    monthlyPriceId: process.env.STRIPE_PRICE_MONTHLY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  };
}

export const STRIPE_CONFIG = getStripeConfig();

export async function createStripeCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

// Stripe plans configuration
export function getStripePlans() {
  return {
    monthly: {
      priceId: process.env.STRIPE_PRICE_MONTHLY || '',
      name: 'Merchant Pro Monthly',
      amount: 9900, // $99.00 in cents
      interval: 'month' as const,
    },
  };
}

export const STRIPE_PLANS = getStripePlans();

// Additional Stripe utilities
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function cancelStripeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}