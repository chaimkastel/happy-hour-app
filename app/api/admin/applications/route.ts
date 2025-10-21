import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let whereClause: any = {};
    if (status) {
      whereClause.approved = status === 'approved';
    }

    // Get merchants with pending KYC status (these are new applications)
    const merchants = await prisma.merchant.findMany({
      where: whereClause,
      include: {
        user: true,
        venues: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to application format
    const applications = merchants.map(merchant => ({
      id: merchant.id,
      businessName: merchant.businessName,
      contactName: merchant.user.firstName && merchant.user.lastName 
        ? `${merchant.user.firstName} ${merchant.user.lastName}` 
        : merchant.user.email.split('@')[0],
      email: merchant.user.email,
      phone: merchant.user.phone || 'Not provided',
      address: merchant.venues[0]?.address || 'Not provided',
      businessType: 'Restaurant',
      description: `Business application for ${merchant.businessName}`,
      submittedAt: merchant.createdAt,
      status: merchant.kycStatus === 'APPROVED' ? 'approved' : 'pending',
      documents: {
        businessLicense: 'BL-' + merchant.id.slice(-6),
        taxId: 'TAX-' + merchant.id.slice(-9),
        insurance: 'INS-' + merchant.id.slice(-6)
      },
      notes: ''
    }));

    return NextResponse.json({
      applications: applications,
      total: applications.length
    });
  } catch (error) {
    console.error('Error fetching admin applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status, adminNotes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    // Update the merchant approval status
    const updatedMerchant = await prisma.merchant.update({
      where: { id: applicationId },
      data: {
        kycStatus: status === 'approved' ? 'APPROVED' : 'PENDING',
        updatedAt: new Date()
      },
      include: {
        user: true,
        venues: true
      }
    });

    // Log the admin action
    if (process.env.NODE_ENV !== 'production') console.log(`Admin action: Application ${applicationId} status changed to ${status}`, {
      adminNotes,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      application: {
        id: updatedMerchant.id,
        businessName: updatedMerchant.businessName,
        status: updatedMerchant.kycStatus === 'APPROVED' ? 'approved' : 'pending',
        email: updatedMerchant.user.email
      }
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
