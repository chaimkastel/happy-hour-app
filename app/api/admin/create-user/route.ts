import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// This endpoint is for one-time use to create admin user in production
// It should be disabled after use for security

export async function POST(request: NextRequest) {
  try {
    // Check for a secure token to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const secretToken = process.env.ADMIN_CREATE_SECRET || 'CREATE_ADMIN_SECURE_TOKEN_CHANGE_THIS';
    
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
          { email: 'admin@happyhour.com' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (existingAdmin) {
      // Update existing admin password
      const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
      
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          emailVerified: true,
          emailVerifiedAt: new Date(),
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Admin password updated successfully',
        email: existingAdmin.email,
        password: 'CHAIMrox11!'
      });
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@happyhour.com',
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

