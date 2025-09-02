'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  Star, 
  Tag, 
  Users, 
  Zap,
  QrCode,
  Share2,
  Download,
  ArrowLeft,
  Heart,
  Navigation,
  Info
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Link from 'next/link'

interface ClaimSuccessData {
  deal: {
    id: string
    title: string
    description: string
    percentOff: number
    startAt: string
    endAt: string
    maxRedemptions: number
    redeemedCount: number
    minSpend: number
    tags: string[]
    venue: {
      name: string
      address: string
      businessType: string[]
      priceTier: string
      rating: number
      photos: string[]
      hours: any
      phone?: string
      website?: string
    }
  }
  redemption: {
    id: string
    code: string
    status: string
    expiresAt: string
    createdAt: string
  }
}

function ClaimSuccessContent() {
  const searchParams = useSearchParams()
  const [claimData, setClaimData] = useState<ClaimSuccessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get claim data from URL params or localStorage
    const dealId = searchParams.get('dealId')
    const redemptionId = searchParams.get('redemptionId')
    
    if (dealId && redemptionId) {
      // Fetch claim data from API
      fetchClaimData(dealId, redemptionId)
    } else {
      // Try to get from localStorage (fallback)
      const storedData = localStorage.getItem('hh:lastClaim')
      if (storedData) {
        try {
          setClaimData(JSON.parse(storedData))
        } catch (e) {
          setError('Invalid claim data')
        }
      } else {
        setError('No claim data found')
      }
      setLoading(false)
    }
  }, [searchParams])

  const fetchClaimData = async (dealId: string, redemptionId: string) => {
    try {
      // Fetch deal details
      const dealResponse = await fetch(`/api/deals/${dealId}`)
      const dealData = await dealResponse.json()
      
      // Fetch redemption details
      const redemptionResponse = await fetch(`/api/redemptions/${redemptionId}`)
      const redemptionData = await redemptionResponse.json()
      
      if (dealResponse.ok && redemptionResponse.ok) {
        const combinedData: ClaimSuccessData = {
          deal: dealData,
          redemption: redemptionData
        }
        setClaimData(combinedData)
        // Store in localStorage for fallback
        localStorage.setItem('hh:lastClaim', JSON.stringify(combinedData))
      } else {
        setError('Failed to fetch claim data')
      }
    } catch (err) {
      setError('Network error while fetching claim data')
    } finally {
      setLoading(false)
    }
  }

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime()
    const end = new Date(endTime).getTime()
    const diff = end - now
    
    if (diff <= 0) return { expired: true, hours: 0, minutes: 0 }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { expired: false, hours, minutes }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getSeatsLeft = () => {
    if (!claimData) return 0
    return Math.max(0, claimData.deal.maxRedemptions - claimData.deal.redeemedCount)
  }

  const downloadQRCode = () => {
    // In a real app, this would generate and download a QR code
    alert('QR Code download feature would be implemented here')
  }

  const shareDeal = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this deal: ${claimData?.deal.title}`,
        text: `${claimData?.deal.title} - ${claimData?.deal.percentOff}% off at ${claimData?.deal.venue.name}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 dark:text-green-400 text-lg">Loading your claimed deal...</p>
        </div>
      </div>
    )
  }

  if (error || !claimData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-900 dark:via-pink-900 dark:to-rose-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Claim Data Not Found</h1>
          <p className="text-red-600 dark:text-red-400 mb-6">{error || 'Unable to load claim details'}</p>
          <Link href="/">
            <Button variant="primary" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const timeRemaining = getTimeRemaining(claimData.deal.endAt)
  const seatsLeft = getSeatsLeft()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold text-green-800 dark:text-green-200 mb-4">
          Deal Claimed Successfully! 🎉
        </h1>
        <p className="text-xl text-green-600 dark:text-green-400 max-w-2xl mx-auto">
          Your deal is ready! Show this page to redeem your offer.
        </p>
      </div>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <Link href="/">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Deal Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Details */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {claimData.deal.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    {claimData.deal.description}
                  </p>
                </div>
                <Badge variant="success" size="lg">
                  {claimData.deal.percentOff}% OFF
                </Badge>
              </div>

              {/* Deal Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-500 dark:text-slate-400">Valid Until</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatTime(claimData.deal.endAt)}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Users className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-500 dark:text-slate-400">Seats Left</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {seatsLeft}
                  </div>
                </div>

                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Tag className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-500 dark:text-slate-400">Min Spend</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    ${claimData.deal.minSpend}
                  </div>
                </div>

                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Zap className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-500 dark:text-slate-400">Status</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    ACTIVE
                  </div>
                </div>
              </div>

              {/* Tags */}
              {claimData.deal.tags && claimData.deal.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {claimData.deal.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            {/* Venue Details */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Venue Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {claimData.deal.venue.name}
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {claimData.deal.venue.address}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {claimData.deal.venue.rating} / 5.0
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {claimData.deal.venue.businessType.join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {claimData.deal.venue.priceTier} pricing
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" size="lg" fullWidth>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  
                  {claimData.deal.venue.phone && (
                    <Button variant="outline" size="lg" fullWidth>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Venue
                    </Button>
                  )}
                  
                  <Button variant="outline" size="lg" fullWidth>
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Favorites
                  </Button>
                </div>
              </div>
            </Card>

            {/* Redemption Details */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Redemption Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Redemption Code
                    </label>
                    <div className="text-2xl font-mono font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      {claimData.redemption.code}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Status
                    </label>
                    <Badge variant="success" size="lg">
                      {claimData.redemption.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Claimed On
                    </label>
                    <div className="text-slate-900 dark:text-slate-100">
                      {formatTime(claimData.redemption.createdAt)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Expires At
                    </label>
                    <div className="text-slate-900 dark:text-slate-100">
                      {formatTime(claimData.redemption.expiresAt)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <Card className="p-6 text-center">
              <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-20 h-20 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                QR Code
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Show this to staff for quick redemption
              </p>
              <Button onClick={downloadQRCode} variant="outline" size="sm" fullWidth>
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </Card>

            {/* Time Remaining */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Time Remaining
              </h3>
              
              {timeRemaining.expired ? (
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-red-600 dark:text-red-400 font-semibold">
                    Deal Expired
                  </div>
                  <div className="text-sm text-red-500 dark:text-red-400">
                    This deal is no longer valid
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {timeRemaining.hours}h {timeRemaining.minutes}m
                  </div>
                  <div className="text-sm text-green-500 dark:text-green-400">
                    Left to redeem
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button onClick={shareDeal} variant="outline" size="lg" fullWidth>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Deal
                </Button>
                
                <Button variant="outline" size="lg" fullWidth>
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                
                <Button variant="outline" size="lg" fullWidth>
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
              </div>
            </Card>

            {/* Important Notes */}
            <Card className="p-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">
                Important Notes
              </h3>
              
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                <li>• Present this page or QR code to staff</li>
                <li>• Valid until {formatTime(claimData.deal.endAt)}</li>
                <li>• Minimum spend: ${claimData.deal.minSpend}</li>
                <li>• Cannot be combined with other offers</li>
                <li>• Subject to venue availability</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ClaimSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 text-lg">Loading claim details...</p>
        </div>
      </div>
    }>
      <ClaimSuccessContent />
    </Suspense>
  )
}
