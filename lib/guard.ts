import { getCurrentUser } from './auth'
import { prisma } from './db'

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user?.id) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 })
  }
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  return dbUser
}

export async function requireMerchant() {
  const user = await requireUser()
  if (user.role !== 'MERCHANT' && user.role !== 'ADMIN') {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }
  let merchant = await prisma.merchant.findUnique({ where: { userId: user.id } })
  if (!merchant) {
    // Auto-provision a merchant record for convenience in dev
    merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName: user.email?.split('@')[0] ?? 'My Business',
      },
    })
  }
  return { user, merchant }
}

