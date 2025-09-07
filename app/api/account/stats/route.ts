import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's redemptions for stats
    const redemptions = await prisma.redemption.findMany({
      where: { userId: session.user.id },
      include: {
        deal: true,
      },
    });

    // Calculate stats
    const totalRedemptions = redemptions.length;
    const activeDeals = redemptions.filter(r => r.status === 'CLAIMED').length;
    const usedDeals = redemptions.filter(r => r.status === 'USED').length;
    const expiredDeals = redemptions.filter(r => r.status === 'EXPIRED').length;

    // Calculate total savings (mock calculation based on deals)
    const totalSavings = redemptions.reduce((sum, redemption) => {
      const deal = redemption.deal;
      // Mock calculation: assume average savings of $5 per deal
      return sum + 5;
    }, 0);

    // Calculate streak days (mock - in real app, this would be based on daily activity)
    const streakDays = Math.min(totalRedemptions * 2, 30);

    // Calculate points (mock - in real app, this would be based on activity)
    const points = totalRedemptions * 10 + streakDays * 5;

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
