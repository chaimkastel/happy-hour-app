'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  Tag, 
  Users, 
  Zap,
  Heart,
  Share2,
  Navigation,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle,
  QrCode
} from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { Badge } from '../../../../components/ui/Badge'
import { Modal } from '../../../../components/ui/Modal'
import ClaimButton from '../../../../components/ClaimButton'
import MapMini from '../../../../components/MapMini'
import Link from 'next/link'

interface Deal {
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
  status: string
  venue: {
    id: string
    name: string
    address: string
    businessType: string[]
    priceTier: string
    rating: number
    photos: string[]
    hours: any
    phone?: string
    website?: string
    latitude: number
    longitude: number
  }
}

export default function ViewDealPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchDeal(params.id as string)
    }
  }, [params.id])

  const fetchDeal = async (dealId: string) => {
    try {
      const response = await fetch(`/api/deals/${dealId}`)
      if (response.ok) {
        const dealData = await response.json()
        setDeal(dealData)
      } else {
        setError('Deal not found')
      }
    } catch (err) {
      setError('Failed to load deal')
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
    if (!deal) return 0
    return Math.max(0, deal.maxRedemptions - deal.redeemedCount)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // In a real app, this would save to the backend
  }

  const shareDeal = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this deal: ${deal?.title}`,
        text: `${deal?.title} - ${deal?.percentOff}% off at ${deal?.venue.name}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const getDirections = () => {
    if (deal?.venue.latitude && deal?.venue.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${deal.venue.latitude},${deal.venue.longitude}`
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-600 dark:text-orange-400 text-lg">Loading deal details...</p>
        </div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-900 dark:via-pink-900 dark:to-rose-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Deal Not Found</h1>
          <p className="text-red-600 dark:text-red-400 mb-6">{error || 'Unable to load deal details'}</p>
          <Button 
            onClick={() => router.push('/')}
            variant="primary" 
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const timeRemaining = getTimeRemaining(deal.endAt)
  const seatsLeft = getSeatsLeft()
  const isExpired = timeRemaining.expired
  const isFullyClaimed = seatsLeft === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => router.push('/')}
              variant="ghost" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
            
            <div className="flex items-center gap-3">
              <Button onClick={shareDeal} variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button onClick={toggleFavorite} variant="ghost" size="sm">
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {deal.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                    {deal.description}
                  </p>
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="success" size="lg">
                      {deal.percentOff}% OFF
                    </Badge>
                    <Badge variant={deal.status === 'LIVE' ? 'success' : 'secondary'} size="sm">
                      {deal.status}
                    </Badge>
                    {isExpired && (
                      <Badge variant="error" size="sm">
                        EXPIRED
                      </Badge>
                    )}
                    {isFullyClaimed && (
                      <Badge variant="error" size="sm">
                        FULLY CLAIMED
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Deal Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-500 dark:text-slate-400">Valid Until</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatTime(deal.endAt)}
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
                    ${deal.minSpend}
                  </div>
                </div>

                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Zap className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-500 dark:text-slate-400">Total Seats</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {deal.maxRedemptions}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {deal.tags && deal.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {deal.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Venue Information */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Venue Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    {deal.venue.name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {deal.venue.address}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {deal.venue.rating} / 5.0 rating
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {deal.venue.businessType.join(', ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {deal.venue.priceTier} pricing tier
                      </span>
                    </div>
                  </div>
                  
                  {/* Mini Map */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Location</h4>
                    <div className="h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <MapMini 
                        lat={deal.venue.latitude} 
                        lng={deal.venue.longitude} 
                        label={deal.venue.name} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={getDirections} variant="outline" size="lg" fullWidth>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  
                  {deal.venue.phone && (
                    <Button variant="outline" size="lg" fullWidth>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Venue
                    </Button>
                  )}
                  
                  <Button variant="outline" size="lg" fullWidth>
                    <Calendar className="w-4 h-4 mr-2" />
                    View Hours
                  </Button>
                </div>
              </div>
            </Card>

            {/* Deal Timeline */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Deal Timeline
              </h2>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                
                {/* Timeline Items */}
                <div className="space-y-6">
                  {/* Deal Created */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center z-10">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Deal Created</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Deal started at {formatTime(deal.startAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Current Status */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center z-10">
                      <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Currently Active</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {seatsLeft} of {deal.maxRedemptions} seats available
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((deal.maxRedemptions - seatsLeft) / deal.maxRedemptions) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {deal.redeemedCount} claimed • {seatsLeft} remaining
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Deal Ends */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center z-10">
                      <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Deal Ends</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Expires at {formatTime(deal.endAt)}
                      </p>
                      {!isExpired && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-medium">
                          ⚡ {timeRemaining.hours}h {timeRemaining.minutes}m remaining!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deal Terms */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Deal Terms & Conditions
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Valid Period</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      This deal is valid from {formatTime(deal.startAt)} until {formatTime(deal.endAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Minimum Spend</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Minimum spend of ${deal.minSpend} required to redeem this offer
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Availability</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Limited to {deal.maxRedemptions} total redemptions. {seatsLeft} seats remaining.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Important Notes</h4>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Cannot be combined with other offers or promotions</li>
                      <li>• Subject to venue availability and capacity</li>
                      <li>• Present redemption code to staff when ordering</li>
                      <li>• Valid for dine-in only (unless otherwise specified)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Claim Button Card */}
            <Card className="p-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Ready to Claim?
              </h3>
              
              {isExpired ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
                  <div className="text-red-600 dark:text-red-400 font-semibold">
                    Deal Expired
                  </div>
                  <div className="text-sm text-red-500 dark:text-red-400">
                    This deal is no longer valid
                  </div>
                </div>
              ) : isFullyClaimed ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-4">
                  <div className="text-amber-600 dark:text-amber-400 font-semibold">
                    Fully Claimed
                  </div>
                  <div className="text-sm text-amber-500 dark:text-amber-400">
                    All seats have been taken
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                  <div className="text-green-600 dark:text-green-400 font-semibold">
                    Available Now!
                  </div>
                  <div className="text-sm text-green-500 dark:text-green-400">
                    {seatsLeft} seats remaining
                  </div>
                </div>
              )}
              
              {!isExpired && !isFullyClaimed && (
                <ClaimButton
                  dealId={deal.id}
                  dealTitle={deal.title}
                  venueName={deal.venue.name}
                  maxRedemptions={deal.maxRedemptions}
                  redeemedCount={deal.redeemedCount}
                  endAt={deal.endAt}
                  onClaimSuccess={() => setShowClaimModal(true)}
                  className="w-full"
                />
              )}
              
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Claiming is free and takes just a few seconds
              </div>
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
                    Left to claim and redeem
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
                
                <Button onClick={toggleFavorite} variant="outline" size="lg" fullWidth>
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>
            </Card>

            {/* Venue Photos */}
            {deal.venue.photos && deal.venue.photos.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Venue Photos
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {deal.venue.photos.slice(0, 4).map((photo: string, index: number) => (
                    <div key={index} className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                      <img 
                        src={photo} 
                        alt={`${deal.venue.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Claim Success Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Deal Claimed Successfully! 🎉"
      >
        <div className="text-center p-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Congratulations!
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You've successfully claimed "{deal.title}" at {deal.venue.name}. 
            You'll be redirected to your redemption page in a moment.
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowClaimModal(false)} 
              variant="outline" 
              size="lg"
            >
              Stay Here
            </Button>
            <Button 
              onClick={() => router.push('/claim-success')}
              variant="primary" 
              size="lg"
            >
              View Redemption
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
