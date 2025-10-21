import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's vouchers for stats
    const vouchers = await prisma.redemption.findMany({
      where: { userId: session.user.id },
      include: {
        deal: true,
      },
    });

    // Calculate stats
    const totalRedemptions = vouchers.length;
    const activeDeals = vouchers.filter(v => v.status === 'ISSUED').length;
    const usedDeals = vouchers.filter(v => v.status === 'REDEEMED').length;
    const expiredDeals = vouchers.filter(v => v.status === 'EXPIRED').length;

    // Calculate total savings based on actual deal discounts
    const totalSavings = vouchers.reduce((sum, voucher) => {
      const deal = voucher.deal;
      if (deal.percentOff && deal.minSpend) {
        return sum + (deal.minSpend * deal.percentOff / 100);
      }
      return sum;
    }, 0);

    // Calculate streak days based on recent activity
    const streakDays = 0; // TODO: Implement based on daily activity

    // Calculate points based on activity
    const points = totalRedemptions * 10;

    // Mock badges based on activity
    const badges = [];
    if (totalRedemptions >= 5) badges.push('Deal Hunter');
    if (totalRedemptions >= 10) badges.push('Savings Expert');
    if (streakDays >= 7) badges.push('Streak Master');
    if (totalSavings >= 50) badges.push('Money Saver');

    const stats = {
      totalRedemptions,
      activeDeals,
      usedDeals,
      expiredDeals,
      totalSavings,
      streakDays,
      points,
      badges,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching account stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
