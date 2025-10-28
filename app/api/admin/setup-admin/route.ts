import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// ⚠️ WARNING: This is a simple one-time setup endpoint
// DELETE THIS FILE AFTER CREATING YOUR ADMIN USER
// OR PROTECT IT WITH SECURE AUTHENTICATION

export async function POST(request: NextRequest) {
  try {
    // Dynamically import to avoid build-time issues
    const { prisma } = await import('@/lib/db');
    
    // Simple protection - you can enhance this
    const secret = request.headers.get('x-setup-secret');
    if (secret !== process.env.SETUP_SECRET && process.env.SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Creating admin user...');

    // Hash password
    const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
    
    // Check if admin exists
    const existingAdmin = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@orderhappyhour.com' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (existingAdmin) {
      // Update existing user
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
        message: 'Admin user updated successfully',
        email: 'admin@orderhappyhour.com',
        password: 'CHAIMrox11!'
      });
    }

    // Create new admin
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
      { error: 'Failed to create admin', details: error.message },
      { status: 500 }
    );
  }
}

