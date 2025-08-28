'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Clock, Users, Zap, QrCode, Download, Share2 } from 'lucide-react'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

interface ClaimButtonProps {
  dealId: string
  dealTitle: string
  venueName: string
  maxRedemptions: number
  redeemedCount: number
  endAt: string
  onClaimSuccess?: (redemption: any) => void
  className?: string
}

export default function ClaimButton({
  dealId,
  dealTitle,
  venueName,
  maxRedemptions,
  redeemedCount,
  endAt,
  onClaimSuccess,
  className = ''
}: ClaimButtonProps) {
  const router = useRouter()
  const [isClaiming, setIsClaiming] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [redemption, setRedemption] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const seatsLeft = Math.max(0, maxRedemptions - redeemedCount)
  const isFullyClaimed = seatsLeft === 0
  const isExpired = new Date() > new Date(endAt)

  const handleClaim = async () => {
    if (isFullyClaimed || isExpired) return

    setIsClaiming(true)
    setError(null)

    try {
      // For now, use a demo user ID - in production this would come from auth
      const demoUserId = 'cmet5ypx5000012d06plzqb9i' // User from seed script
      
      const response = await fetch(`/api/deals/${dealId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: demoUserId }),
      })

      const data = await response.json()

      if (response.ok) {
        setRedemption(data.redemption)
        setShowSuccessModal(true)
        onClaimSuccess?.(data.redemption)
        
        // Store claim data for the success page
        const claimData = {
          deal: {
            id: dealId,
            title: dealTitle,
            venue: { name: venueName }
          },
          redemption: data.redemption
        }
        localStorage.setItem('hh:lastClaim', JSON.stringify(claimData))
        
        // Add to wallet (localStorage for now)
        const wallet = JSON.parse(localStorage.getItem('hh:wallet') || '[]')
        wallet.push({
          ...claimData,
          claimedAt: new Date().toISOString(),
          expiresAt: endAt
        })
        localStorage.setItem('hh:wallet', JSON.stringify(wallet))
      } else {
        setError(data.error || 'Failed to claim deal')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsClaiming(false)
    }
  }

  const getButtonText = () => {
    if (isExpired) return 'Deal Expired'
    if (isFullyClaimed) return 'Fully Claimed'
    if (isClaiming) return 'Claiming...'
    return 'Claim Deal'
  }

  const getButtonVariant = () => {
    if (isExpired || isFullyClaimed) return 'secondary'
    return 'primary'
  }

  const getButtonDisabled = () => {
    return isExpired || isFullyClaimed || isClaiming
  }

  return (
    <>
      <Button
        onClick={handleClaim}
        variant={getButtonVariant()}
        size="lg"
        loading={isClaiming}
        disabled={getButtonDisabled()}
        fullWidth
        className={`${className} ${
          isExpired || isFullyClaimed 
            ? 'opacity-60 cursor-not-allowed' 
            : 'hover:scale-105'
        }`}
        leftIcon={isClaiming ? undefined : Zap}
      >
        {getButtonText()}
      </Button>

      {/* Seats Left Indicator */}
      {!isExpired && (
        <div className="flex items-center justify-center gap-2 mt-3 text-sm">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-slate-600 dark:text-slate-400">
            {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} left
          </span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Deal Claimed Successfully! 🎉"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {dealTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              at {venueName}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-center">
              Redemption QR Code
            </h4>
            
            <div className="flex justify-center mb-3">
              <div className="w-32 h-32 bg-white rounded-lg p-3 border-2 border-slate-200 dark:border-slate-600">
                <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-slate-400" />
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Show this QR code to staff for quick redemption
              </p>
            </div>
          </div>

          {redemption && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Claim Code:</span>
                  <span className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100">
                    {redemption.code}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Expires:</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {new Date(redemption.expiresAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">How to redeem:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Show this claim code to staff at {venueName}</li>
                  <li>They'll scan or verify your code</li>
                  <li>Enjoy your discount!</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowSuccessModal(false)}
              variant="secondary"
              fullWidth
            >
              Got it!
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false)
                // Navigate to wallet/redemptions page
                router.push('/wallet')
              }}
              variant="primary"
              fullWidth
            >
              View My Deals
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
