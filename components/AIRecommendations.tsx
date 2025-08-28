'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Clock, MapPin, Star, Zap } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

interface Deal {
  id: string
  title: string
  description: string
  percentOff: number
  status: string
  startAt: string
  endAt: string
  maxRedemptions: number
  redeemedCount: number
  minSpend?: number
  tags: string[]
  venue: {
    id: string
    name: string
    slug: string
    address: string
    latitude: number
    longitude: number
    businessType: string[]
    priceTier: string
    rating: number
    photos: string[]
  }
}

interface AIRecommendationsProps {
  deals: Deal[]
  userLocation?: { lat: number; lng: number } | null
  userPreferences?: {
    businessTypes: string[]
    priceRange: string[]
    dealTypes: string[]
  }
}

export default function AIRecommendations({ 
  deals, 
  userLocation, 
  userPreferences 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [reasoning, setReasoning] = useState<string>('')

  useEffect(() => {
    generateRecommendations()
  }, [deals, userLocation, userPreferences])

  const generateRecommendations = () => {
    setLoading(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      const scoredDeals = deals.map(deal => {
        let score = 0
        let reasons: string[] = []

        // Location-based scoring
        if (userLocation) {
          const distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            deal.venue.latitude, 
            deal.venue.longitude
          )
          if (distance < 2) {
            score += 30
            reasons.push('Very close to you')
          } else if (distance < 5) {
            score += 20
            reasons.push('Nearby location')
          } else if (distance < 10) {
            score += 10
            reasons.push('Within reasonable distance')
          }
        }

        // Preference-based scoring
        if (userPreferences?.businessTypes) {
          const hasPreferredBusinessType = userPreferences.businessTypes.some(businessType =>
            deal.venue.businessType.some(venueType =>
              venueType.toLowerCase().includes(businessType.toLowerCase())
            )
          )
          if (hasPreferredBusinessType) {
            score += 25
            reasons.push('Matches your business type preferences')
          }
        }

        // Deal attractiveness scoring
        if (deal.percentOff >= 50) {
          score += 20
          reasons.push('High discount value')
        } else if (deal.percentOff >= 30) {
          score += 15
          reasons.push('Good discount')
        }

        // Time-based scoring
        const timeRemaining = getTimeRemaining(deal.endAt)
        if (timeRemaining.hours < 2) {
          score += 15
          reasons.push('Limited time remaining')
        } else if (timeRemaining.hours < 6) {
          score += 10
          reasons.push('Ending soon')
        }

        // Popularity scoring
        const popularity = deal.redeemedCount / deal.maxRedemptions
        if (popularity > 0.8) {
          score += 10
          reasons.push('Very popular')
        } else if (popularity < 0.3) {
          score += 5
          reasons.push('Still plenty available')
        }

        // Rating-based scoring
        if (deal.venue.rating >= 4.5) {
          score += 15
          reasons.push('Highly rated venue')
        } else if (deal.venue.rating >= 4.0) {
          score += 10
          reasons.push('Well-rated venue')
        }

        return { deal, score, reasons }
      })

      // Sort by score and take top 3
      const topRecommendations = scoredDeals
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.deal)

      setRecommendations(topRecommendations)
      
      // Generate AI reasoning
      const topDeal = scoredDeals[0]
      if (topDeal) {
        setReasoning(`Based on your preferences and current location, I recommend "${topDeal.deal.title}" because: ${topDeal.reasons.slice(0, 3).join(', ')}. This deal scored ${topDeal.score} points in our AI analysis.`)
      }
      
      setLoading(false)
    }, 1500)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            AI Recommendations
          </h2>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            AI Recommendations
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Personalized deals just for you
          </p>
        </div>
      </div>

      {/* AI Reasoning */}
      {reasoning && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {reasoning}
            </p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((deal, index) => (
          <div key={deal.id} className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                  'bg-gradient-to-r from-amber-600 to-yellow-600'
                }`}>
                  {index + 1}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {deal.title}
                </h3>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {deal.percentOff}% OFF
              </Badge>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {deal.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{deal.venue.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>{deal.venue.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{getTimeRemaining(deal.endAt).hours}h left</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            AI Insights
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Our AI analyzes your location, preferences, and deal popularity to find the best matches. 
          Recommendations update in real-time based on availability and your behavior.
        </p>
      </div>
    </Card>
  )
}
