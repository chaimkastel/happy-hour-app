import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.password || !data.businessName || !data.contactName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with MERCHANT role
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'MERCHANT',
        firstName: data.contactName.split(' ')[0],
        lastName: data.contactName.split(' ').slice(1).join(' '),
        phone: data.phone,
      },
    });

    // Create merchant record
    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName: data.businessName,
        companyName: data.legalName,
        firstName: data.contactName.split(' ')[0],
        lastName: data.contactName.split(' ').slice(1).join(' '),
        contactEmail: data.email,
        businessAddress: data.address,
        cuisineType: data.cuisineTags?.[0],
        status: 'PENDING',
        approved: false,
        kycStatus: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      merchantId: merchant.id,
      status: 'PENDING',
      message: 'Merchant account created successfully. Pending approval.',
    });

  } catch (error) {
    console.error('Merchant signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create merchant account' },
      { status: 500 }
    );
  }
}
