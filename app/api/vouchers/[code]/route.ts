import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const paramsSchema = z.object({
  code: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = paramsSchema.parse(params);

    const voucher = await db.voucher.findUnique({
      where: { code },
      include: {
        deal: {
          include: {
            venue: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ voucher });
  } catch (error) {
    console.error('Error fetching voucher:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
