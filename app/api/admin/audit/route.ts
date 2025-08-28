import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const action = searchParams.get('action');
    const adminId = searchParams.get('adminId');

    let whereClause: any = {};
    if (action) {
      whereClause.action = action;
    }
    if (adminId) {
      whereClause.adminId = adminId;
    }

    const auditLogs = await prisma.adminAuditLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        admin: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });

    const total = await prisma.adminAuditLog.count({ where: whereClause });

    return NextResponse.json({
      logs: auditLogs,
      total,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, action, details, targetType, targetId } = body;

    const auditLog = await prisma.auditLog.create({
      data: {
        adminId,
        action,
        details: JSON.stringify(details),
        targetType,
        targetId,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      log: auditLog
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
