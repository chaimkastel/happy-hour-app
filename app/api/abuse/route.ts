import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { ok, bad, unauthorized } from '@/lib/api';

export const dynamic = 'force-dynamic';

const abuseReportSchema = z.object({
  dealId: z.string().min(1, 'Deal ID is required'),
  reason: z.enum([
    'INAPPROPRIATE_CONTENT',
    'MISLEADING_INFORMATION',
    'SPAM',
    'FAKE_DEAL',
    'PRICE_MANIPULATION',
    'OTHER'
  ]),
  description: z.string().max(500, 'Description too long').optional(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return unauthorized('Authentication required');
  }

  try {
    const body = await request.json();
    const validation = abuseReportSchema.safeParse(body);
    
    if (!validation.success) {
      return bad('Invalid request body', 'VALIDATION_ERROR', 400);
    }

    const { dealId, reason, description } = validation.data;

    // Verify the deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        venue: {
          include: {
            merchant: true,
          },
        },
      },
    });

    if (!deal) {
      return bad('Deal not found', 'DEAL_NOT_FOUND', 404);
    }

    // Check if user has already reported this deal
    const existingReport = await prisma.abuseReport.findFirst({
      where: {
        dealId,
        userId: session.user.id,
      },
    });

    if (existingReport) {
      return bad('You have already reported this deal', 'ALREADY_REPORTED', 400);
    }

    // Create abuse report
    const abuseReport = await prisma.abuseReport.create({
      data: {
        dealId,
        userId: session.user.id,
        reason,
        description: description || null,
        status: 'PENDING',
      },
    });

    // Check if deal should be soft-hidden (3+ unique reports)
    const reportCount = await prisma.abuseReport.count({
      where: {
        dealId,
        status: 'PENDING',
      },
    });

    if (reportCount >= 3) {
      // Soft-hide the deal by updating its status
      await prisma.deal.update({
        where: { id: dealId },
        data: {
          status: 'UNDER_REVIEW',
        },
      });
    }

    return ok({
      reportId: abuseReport.id,
      message: 'Report submitted successfully',
      dealHidden: reportCount >= 3,
    });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Abuse report error:', error);
    }
    return bad('Internal server error', 'SERVER_ERROR', 500);
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return unauthorized('Admin access required');
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const reports = await prisma.abuseReport.findMany({
      where: {
        status: status as any,
      },
      include: {
        deal: {
          include: {
            venue: {
              include: {
                merchant: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.abuseReport.count({
      where: {
        status: status as any,
      },
    });

    return ok({
      reports,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });

  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Abuse reports fetch error:', error);
    }
    return bad('Internal server error', 'SERVER_ERROR', 500);
  }
}
