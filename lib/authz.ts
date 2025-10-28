/**
 * Server-side authorization utilities for role-based access control
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized - Please sign in');
  }

  if (session.user.role !== 'ADMIN') {
    throw new Error('Forbidden - Admin access required');
  }

  return session.user;
}

export async function requireMerchant() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized - Please sign in');
  }

  if (session.user.role !== 'MERCHANT' && session.user.role !== 'ADMIN') {
    throw new Error('Forbidden - Merchant access required');
  }

  return session.user;
}

export async function requireApprovedMerchant() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized - Please sign in');
  }

  if (session.user.role !== 'MERCHANT' && session.user.role !== 'ADMIN') {
    throw new Error('Forbidden - Merchant access required');
  }

  // TODO: Check merchant status in database
  // For now, just return the user
  return session.user;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized - Please sign in');
  }

  return session.user;
}

