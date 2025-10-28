import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// This endpoint is for one-time use to create admin user in production
// DISABLE THIS ENDPOINT AFTER CREATING THE ADMIN USER

export async function POST(request: NextRequest) {
  try {
    // Dynamically import to avoid build-time issues
    const { prisma } = await import('@/lib/db');
    
    // Check if endpoint is enabled (requires explicit enable)
    const isEnabled = process.env.ENABLE_ADMIN_CREATE === 'true';
    if (!isEnabled) {
      return NextResponse.json(
        { error: 'This endpoint is disabled. Set ENABLE_ADMIN_CREATE=true to enable.' },
        { status: 403 }
      );
    }

    // Verify secure token
    const authHeader = request.headers.get('authorization');
    const secretToken = process.env.ADMIN_CREATE_SECRET;
    
    if (!secretToken) {
      return NextResponse.json(
        { error: 'Admin creation is not configured' },
        { status: 500 }
      );
    }
    
    if (authHeader !== `Bearer ${secretToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret token' },
        { status: 401 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@orderhappyhour.com' },
          { email: 'admin@happyhour.com' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (existingAdmin) {
      // Update existing admin password and email if needed
      const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
      
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          email: 'admin@orderhappyhour.com',
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: true,
          emailVerifiedAt: new Date(),
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Admin password updated successfully',
        email: 'admin@orderhappyhour.com',
        password: 'CHAIMrox11!'
      });
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@orderhappyhour.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        phone: '+1234567890',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email: admin.email,
      password: 'CHAIMrox11!'
    });

  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error.message },
      { status: 500 }
    );
  }
}

