import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'
import { logAuditEvent } from '@/lib/audit'
import { withStrictValidation, withAuthAndRateLimit } from '@/lib/middleware'
import { settingsSchema } from '@/lib/validation'

// GET /api/owner/settings
export const GET = withAuthAndRateLimit(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    
    // Get merchant settings from the database
    const settings = await prisma.merchantSettings.findUnique({
      where: { merchantId: merchant.id }
    })

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        businessHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '10:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '16:00', closed: true },
        },
        quietWindows: [],
        defaultRules: {
          maxDealDuration: 30, // days
          minDealPercentOff: 5,
          maxDealPercentOff: 50,
          requireMinSpend: false,
          defaultMinSpend: 0,
          autoPauseExpired: true,
          allowDineInOnly: true,
          allowTakeaway: true,
        },
        notifications: {
          email: true,
          sms: false,
          dealExpiryReminder: true,
          lowInventoryAlert: true,
          weeklyReport: true,
        },
        payoutSettings: {
          autoPayout: false,
          payoutThreshold: 100,
          payoutSchedule: 'WEEKLY', // DAILY, WEEKLY, MONTHLY
          payoutDay: 1, // Day of week/month for payout
        }
      })
    }

    return NextResponse.json({
      businessHours: JSON.parse(settings.businessHours as string),
      quietWindows: JSON.parse(settings.quietWindows as string),
      defaultRules: JSON.parse(settings.defaultRules as string),
      notifications: JSON.parse(settings.notifications as string),
      payoutSettings: JSON.parse(settings.payoutSettings as string),
    })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to fetch settings' }, { status })
  }
})

// PUT /api/owner/settings
export const PUT = withStrictValidation(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()
    
    const {
      businessHours,
      quietWindows,
      defaultRules,
      notifications,
      payoutSettings
    } = body

    // Validate business hours
    if (businessHours) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      for (const day of days) {
        if (businessHours[day] && !businessHours[day].closed) {
          if (!businessHours[day].open || !businessHours[day].close) {
            return NextResponse.json({ 
              error: `Invalid business hours for ${day}` 
            }, { status: 400 })
          }
          
          // Validate time format (HH:MM)
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
          if (!timeRegex.test(businessHours[day].open) || !timeRegex.test(businessHours[day].close)) {
            return NextResponse.json({ 
              error: `Invalid time format for ${day}` 
            }, { status: 400 })
          }
        }
      }
    }

    // Validate quiet windows
    if (quietWindows && Array.isArray(quietWindows)) {
      for (const window of quietWindows) {
        if (window.startTime && window.endTime && window.days) {
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
          if (!timeRegex.test(window.startTime) || !timeRegex.test(window.endTime)) {
            return NextResponse.json({ 
              error: 'Invalid time format in quiet windows' 
            }, { status: 400 })
          }
          
          if (!Array.isArray(window.days) || window.days.length === 0) {
            return NextResponse.json({ 
              error: 'Quiet window must specify days' 
            }, { status: 400 })
          }
        }
      }
    }

    // Validate default rules
    if (defaultRules) {
      if (defaultRules.maxDealDuration && (defaultRules.maxDealDuration < 1 || defaultRules.maxDealDuration > 365)) {
        return NextResponse.json({ 
          error: 'maxDealDuration must be between 1 and 365 days' 
        }, { status: 400 })
      }
      
      if (defaultRules.minDealPercentOff && (defaultRules.minDealPercentOff < 1 || defaultRules.minDealPercentOff > 100)) {
        return NextResponse.json({ 
          error: 'minDealPercentOff must be between 1 and 100' 
        }, { status: 400 })
      }
      
      if (defaultRules.maxDealPercentOff && (defaultRules.maxDealPercentOff < 1 || defaultRules.maxDealPercentOff > 100)) {
        return NextResponse.json({ 
          error: 'maxDealPercentOff must be between 1 and 100' 
        }, { status: 400 })
      }
    }

    // Validate payout settings
    if (payoutSettings) {
      if (payoutSettings.payoutThreshold && payoutSettings.payoutThreshold < 0) {
        return NextResponse.json({ 
          error: 'payoutThreshold must be positive' 
        }, { status: 400 })
      }
      
      if (payoutSettings.payoutSchedule && !['DAILY', 'WEEKLY', 'MONTHLY'].includes(payoutSettings.payoutSchedule)) {
        return NextResponse.json({ 
          error: 'Invalid payout schedule' 
        }, { status: 400 })
      }
    }

    // Get existing settings for audit comparison
    const existingSettings = await prisma.merchantSettings.findUnique({
      where: { merchantId: merchant.id }
    })

    // Upsert settings
    const updatedSettings = await prisma.merchantSettings.upsert({
      where: { merchantId: merchant.id },
      update: {
        businessHours: businessHours ? JSON.stringify(businessHours) : undefined,
        quietWindows: quietWindows ? JSON.stringify(quietWindows) : undefined,
        defaultRules: defaultRules ? JSON.stringify(defaultRules) : undefined,
        notifications: notifications ? JSON.stringify(notifications) : undefined,
        payoutSettings: payoutSettings ? JSON.stringify(payoutSettings) : undefined,
      },
      create: {
        merchantId: merchant.id,
        businessHours: businessHours ? JSON.stringify(businessHours) : '{}',
        quietWindows: quietWindows ? JSON.stringify(quietWindows) : '[]',
        defaultRules: defaultRules ? JSON.stringify(defaultRules) : '{}',
        notifications: notifications ? JSON.stringify(notifications) : '{}',
        payoutSettings: payoutSettings ? JSON.stringify(payoutSettings) : '{}',
      }
    })

    // Log audit event
    const action = existingSettings ? 'UPDATE' : 'CREATE'
    await logAuditEvent({
      merchantId: merchant.id,
      entityType: 'SETTINGS',
      entityId: updatedSettings.id,
      action,
      changes: existingSettings ? {
        businessHours: { from: existingSettings.businessHours, to: updatedSettings.businessHours },
        quietWindows: { from: existingSettings.quietWindows, to: updatedSettings.quietWindows },
        defaultRules: { from: existingSettings.defaultRules, to: updatedSettings.defaultRules },
        notifications: { from: existingSettings.notifications, to: updatedSettings.notifications },
        payoutSettings: { from: existingSettings.payoutSettings, to: updatedSettings.payoutSettings },
      } : { settings: updatedSettings },
      metadata: { userAgent: req.headers.get('user-agent') }
    })

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: {
        businessHours: businessHours ? JSON.parse(updatedSettings.businessHours as string) : undefined,
        quietHours: quietWindows ? JSON.parse(updatedSettings.quietWindows as string) : undefined,
        defaultRules: defaultRules ? JSON.parse(updatedSettings.defaultRules as string) : undefined,
        notifications: notifications ? JSON.parse(updatedSettings.notifications as string) : undefined,
        payoutSettings: payoutSettings ? JSON.parse(updatedSettings.payoutSettings as string) : undefined,
      }
    })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to update settings' }, { status })
  }
}, settingsSchema)
