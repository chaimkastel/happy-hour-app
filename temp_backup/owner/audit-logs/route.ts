import { NextRequest, NextResponse } from 'next/server'
import { requireMerchant } from '@/lib/guard'
import { getAuditLogs } from '@/lib/audit'

// GET /api/owner/audit-logs?entityType=VENUE&entityId=...&action=UPDATE&page=1&pageSize=20&startDate=...&endDate=...
export async function GET(req: NextRequest) {
  try {
    const { merchant } = await requireMerchant()
    const { searchParams } = new URL(req.url)
    
    const entityType = searchParams.get('entityType') as 'VENUE' | 'DEAL' | 'SETTINGS' | undefined
    const entityId = searchParams.get('entityId') || undefined
    const action = searchParams.get('action') as 'CREATE' | 'UPDATE' | 'DELETE' | undefined
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '20')))
    
    let startDate: Date | undefined
    let endDate: Date | undefined
    
    if (searchParams.get('startDate')) {
      startDate = new Date(searchParams.get('startDate')!)
    }
    if (searchParams.get('endDate')) {
      endDate = new Date(searchParams.get('endDate')!)
    }

    // Validate entityType if provided
    if (entityType && !['VENUE', 'DEAL', 'SETTINGS'].includes(entityType)) {
      return NextResponse.json({ error: 'Invalid entityType' }, { status: 400 })
    }

    // Validate action if provided
    if (action && !['CREATE', 'UPDATE', 'DELETE'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const logs = await getAuditLogs(merchant.id, {
      entityType,
      entityId,
      action,
      page,
      pageSize,
      startDate,
      endDate
    })

    return NextResponse.json(logs)
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to fetch audit logs' }, { status })
  }
}
