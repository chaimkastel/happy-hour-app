import { prisma } from './db'

export interface AuditLogData {
  merchantId: string
  entityType: 'VENUE' | 'DEAL' | 'SETTINGS'
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  changes?: Record<string, any>
  metadata?: Record<string, any>
}

export async function logAuditEvent(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        merchantId: data.merchantId,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        changes: data.changes ? JSON.stringify(data.changes) : '{}',
        metadata: data.metadata ? JSON.stringify(data.metadata) : '{}',
      }
    })
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    console.error('Failed to log audit event:', error)
  }
}

export async function getAuditLogs(
  merchantId: string,
  options: {
    entityType?: 'VENUE' | 'DEAL' | 'SETTINGS'
    entityId?: string
    action?: 'CREATE' | 'UPDATE' | 'DELETE'
    page?: number
    pageSize?: number
    startDate?: Date
    endDate?: Date
  } = {}
) {
  const {
    entityType,
    entityId,
    action,
    page = 1,
    pageSize = 20,
    startDate,
    endDate
  } = options

  const where: any = { merchantId }
  
  if (entityType) where.entityType = entityType
  if (entityId) where.entityId = entityId
  if (action) where.action = action
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  ])

  return {
    page,
    pageSize,
    total,
    logs: logs.map(log => ({
      ...log,
      changes: JSON.parse(log.changes as string),
      metadata: JSON.parse(log.metadata as string),
    }))
  }
}

// Helper function to compare objects and extract changes
export function extractChanges(oldData: any, newData: any): Record<string, any> {
  const changes: Record<string, any> = {}
  
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        from: oldData[key],
        to: newData[key]
      }
    }
  }
  
  return changes
}
