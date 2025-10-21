import { NextRequest, NextResponse } from 'next/server';

// Admin password - in production, this should be in environment variables
const ADMIN_PASSWORD = 'CHAIMrox11!';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true,
        message: 'Access granted'
      });
    } else {
      return NextResponse.json({ 
        error: 'Invalid password' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin access verification error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
