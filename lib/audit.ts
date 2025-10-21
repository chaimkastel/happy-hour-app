import { prisma } from './db';

export interface AuditLogData {
  actorUserId?: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        metadata: data.metadata || {},
      },
    });
  } catch (error) {
    // Don't throw errors for audit logging failures
    console.error('Failed to log audit event:', error);
  }
}

export const AUDIT_ACTIONS = {
  // User actions
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_REGISTER: 'user.register',
  
  // Merchant actions
  MERCHANT_SUBSCRIBE: 'merchant.subscribe',
  MERCHANT_CANCEL_SUBSCRIPTION: 'merchant.cancel_subscription',
  MERCHANT_CREATE_VENUE: 'merchant.create_venue',
  MERCHANT_UPDATE_VENUE: 'merchant.update_venue',
  MERCHANT_CREATE_DEAL: 'merchant.create_deal',
  MERCHANT_UPDATE_DEAL: 'merchant.update_deal',
  MERCHANT_DEACTIVATE_DEAL: 'merchant.deactivate_deal',
  
  // Deal actions
  DEAL_CLAIM: 'deal.claim',
  VOUCHER_CLAIMED: 'voucher.claimed',
  VOUCHER_REDEEMED: 'voucher.redeemed',
  VOUCHER_CANCEL: 'voucher.cancel',
  
  // Admin actions
  ADMIN_APPROVE_MERCHANT: 'admin.approve_merchant',
  ADMIN_REJECT_MERCHANT: 'admin.reject_merchant',
  ADMIN_DEACTIVATE_DEAL: 'admin.deactivate_deal',
} as const;