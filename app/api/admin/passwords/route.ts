import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newPassword, adminPassword } = body;

    console.log('Password change request:', { userId, adminPassword: adminPassword ? 'provided' : 'missing' });

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'User ID and new password are required' },
        { status: 400 }
      );
    }

    // Verify admin password (you might want to implement proper admin authentication)
    if (adminPassword !== 'CHAIMrox11!') {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('Password hashed successfully');

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    console.log('User updated successfully:', updatedUser.email);

    // Log the admin action
    console.log(`Admin action: Password changed for user ${userId}`, {
      userEmail: updatedUser.email,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: `Failed to update password: ${error.message}` },
      { status: 500 }
    );
  }
}
