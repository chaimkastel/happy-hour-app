import { NextRequest, NextResponse } from 'next/server';
import { requireApprovedMerchant } from '@/lib/authz';

export async function POST(req: NextRequest) {
  try {
    // Check authentication and merchant approval status
    const user = await requireApprovedMerchant();
    
    const body = await req.json();
    const { title, description, percentOff, duration, maxRedemptions } = body;

    // Validate input
    if (!title || !percentOff || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate end time based on duration
    const now = new Date();
    const endTime = new Date(now.getTime() + parseInt(duration) * 60 * 1000);

    // TODO: Create instant boost deal in database
    // For now, just return success
    return NextResponse.json({
      success: true,
      deal: {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        percentOff,
        maxRedemptions,
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
        type: 'INSTANT_BOOST'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create instant boost deal' },
      { status: 401 }
    );
  }
}

