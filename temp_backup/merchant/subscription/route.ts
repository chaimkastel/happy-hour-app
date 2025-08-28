import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// Type assertion for session
type SessionWithUser = {
  user: {
    email: string;
    [key: string]: any;
  };
};

const prisma = new PrismaClient();

// Plan configurations
const PLAN_CONFIGS = {
  basic: {
    name: 'Basic',
    price: 49.99,
    venueLimit: 1,
    description: 'Perfect for single-location businesses',
    features: ['Unlimited deals', 'Basic analytics', 'Email support', 'QR code generation']
  },
  growth: {
    name: 'Growth',
    price: 100,
    venueLimit: 5,
    description: 'Ideal for growing business groups',
    features: ['Everything in Basic', 'Multi-venue management', 'Advanced analytics', 'Priority support', 'Bulk deal creation']
  },
  enterprise: {
    name: 'Enterprise',
    price: 250,
    venueLimit: 25,
    description: 'For large business chains and groups',
    features: ['Everything in Growth', 'Unlimited scaling', 'White-label options', 'Dedicated support', 'Custom integrations']
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the merchant
    const merchant = await prisma.merchant.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        subscription: true,
        venues: true
      }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Get subscription details
    const subscription = merchant.subscription;
    const venueCount = merchant.venues.length;

    // Determine current plan based on subscription or default to basic
    let currentPlan = 'basic';
    let planDetails = PLAN_CONFIGS.basic;

    if (subscription) {
      switch (subscription.plan) {
        case 'GROWTH':
          currentPlan = 'growth';
          planDetails = PLAN_CONFIGS.growth;
          break;
        case 'ENTERPRISE':
          currentPlan = 'enterprise';
          planDetails = PLAN_CONFIGS.enterprise;
          break;
        default:
          currentPlan = 'basic';
          planDetails = PLAN_CONFIGS.basic;
      }
    }

    // Calculate trial status and remaining days
    let trialDaysRemaining = 0;
    let isTrialActive = false;
    
    if (subscription?.status === 'TRIAL' && subscription.currentPeriodEnd) {
      const now = new Date();
      const trialEnd = new Date(subscription.currentPeriodEnd);
      const diffTime = trialEnd.getTime() - now.getTime();
      trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isTrialActive = trialDaysRemaining > 0;
    }

    return NextResponse.json({
      subscription: {
        id: subscription?.id,
        plan: currentPlan,
        planDetails: {
          ...planDetails,
          features: planDetails.features
        },
        status: subscription?.status || 'TRIAL',
        currentPeriodStart: subscription?.currentPeriodStart,
        currentPeriodEnd: subscription?.currentPeriodEnd,
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
        venueCount,
        venueLimit: planDetails.venueLimit,
        canAddVenues: venueCount < planDetails.venueLimit,
        trialDaysRemaining: isTrialActive ? trialDaysRemaining : 0,
        isTrialActive
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, action } = await request.json();

    if (!plan || !['basic', 'growth', 'enterprise'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (!action || !['start-trial', 'subscribe', 'upgrade', 'downgrade'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get the merchant
    const merchant = await prisma.merchant.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        subscription: true,
        venues: true
      }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Check venue limits for the new plan
    const newPlanConfig = PLAN_CONFIGS[plan as keyof typeof PLAN_CONFIGS];
    if (merchant.venues.length > newPlanConfig.venueLimit) {
      return NextResponse.json({ 
        error: `Cannot switch to ${plan} plan. You have ${merchant.venues.length} venues but the plan only allows ${newPlanConfig.venueLimit}. Please remove some venues first.` 
      }, { status: 400 });
    }

    // Convert plan to uppercase for database
    const planUpper = plan.toUpperCase();
    
    if (action === 'start-trial') {
      // Start 14-day free trial
      const now = new Date();
      const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days

      const subscription = await prisma.subscription.upsert({
        where: {
          merchantId: merchant.id
        },
        update: {
          plan: planUpper,
          status: 'TRIAL',
          currentPeriodStart: now,
          currentPeriodEnd: trialEnd,
          cancelAtPeriodEnd: true, // Will cancel at end of trial unless upgraded
          trialStartedAt: now
        },
        create: {
          merchantId: merchant.id,
          plan: planUpper,
          status: 'TRIAL',
          currentPeriodStart: now,
          currentPeriodEnd: trialEnd,
          cancelAtPeriodEnd: true,
          trialStartedAt: now
        }
      });

      return NextResponse.json({
        message: 'Free trial started successfully! You have 14 days to explore all features.',
        subscription: {
          id: subscription.id,
          plan: plan,
          status: 'TRIAL',
          currentPeriodEnd: subscription.currentPeriodEnd,
          trialDaysRemaining: 14
        }
      });
    } else {
      // Regular subscription activation/upgrade/downgrade
      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // If upgrading from trial, preserve trial start date
      const existingSubscription = merchant.subscription;
      const trialStartedAt = existingSubscription?.status === 'TRIAL' 
        ? existingSubscription.trialStartedAt 
        : now;

      const subscription = await prisma.subscription.upsert({
        where: {
          merchantId: merchant.id
        },
        update: {
          plan: planUpper,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          trialStartedAt
        },
        create: {
          merchantId: merchant.id,
          plan: planUpper,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          trialStartedAt: now
        }
      });

      const actionText = action === 'upgrade' ? 'upgraded' : action === 'downgrade' ? 'downgraded' : 'activated';
      
      return NextResponse.json({
        message: `Subscription ${actionText} successfully to ${PLAN_CONFIGS[plan as keyof typeof PLAN_CONFIGS].name} plan!`,
        subscription: {
          id: subscription.id,
          plan: plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd
        }
      });
    }
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
