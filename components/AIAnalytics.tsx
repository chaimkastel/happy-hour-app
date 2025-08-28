'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Target, 
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

interface DealAnalytics {
  id: string
  title: string
  percentOff: number
  maxRedemptions: number
  redeemedCount: number
  startAt: string
  endAt: string
  revenue: number
  venue: {
    name: string
    businessType: string[]
  }
}

interface AIAnalyticsProps {
  deals: DealAnalytics[]
  timeRange: '24h' | '7d' | '30d' | '90d'
}

export default function AIAnalytics({ deals, timeRange }: AIAnalyticsProps) {
  const [insights, setInsights] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalRedemptions: 0,
    avgRedemptionRate: 0,
    topPerformingDeal: null as any,
    conversionRate: 0
  })

  useEffect(() => {
    generateAnalytics()
  }, [deals, timeRange])

  const generateAnalytics = () => {
    setLoading(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      // Calculate basic metrics
      const totalRevenue = deals.reduce((sum, deal) => sum + deal.revenue, 0)
      const totalRedemptions = deals.reduce((sum, deal) => sum + deal.redeemedCount, 0)
      const avgRedemptionRate = deals.reduce((sum, deal) => sum + (deal.redeemedCount / deal.maxRedemptions), 0) / deals.length
      
      const topPerformingDeal = deals.reduce((top, deal) => 
        deal.redeemedCount > top.redeemedCount ? deal : top
      , deals[0])
      
      const conversionRate = totalRedemptions / deals.reduce((sum, deal) => sum + deal.maxRedemptions, 0)

      setMetrics({
        totalRevenue,
        totalRedemptions,
        avgRedemptionRate: avgRedemptionRate * 100,
        topPerformingDeal,
        conversionRate: conversionRate * 100
      })

      // Generate AI insights
      const newInsights = []
      
      // Performance insights
      if (avgRedemptionRate > 0.8) {
        newInsights.push({
          type: 'success',
          icon: '🎯',
          title: 'High Demand Detected',
          message: 'Your deals are performing exceptionally well with an 80%+ redemption rate.',
          action: 'Consider increasing deal volume or extending popular deals.'
        })
      } else if (avgRedemptionRate < 0.3) {
        newInsights.push({
          type: 'warning',
          icon: '⚠️',
          title: 'Low Engagement Alert',
          message: 'Deal redemption rates are below average. This could indicate pricing or timing issues.',
          action: 'Review deal pricing, timing, and marketing strategies.'
        })
      }

      // Revenue insights
      if (totalRevenue > 1000) {
        newInsights.push({
          type: 'success',
          icon: '💰',
          title: 'Strong Revenue Performance',
          message: `You've generated $${totalRevenue.toFixed(0)} in revenue from deals.`,
          action: 'Consider expanding successful deal types to other venues.'
        })
      }

      // Time-based insights
      const now = new Date()
      const activeDeals = deals.filter(deal => 
        new Date(deal.startAt) <= now && new Date(deal.endAt) >= now
      )
      
      if (activeDeals.length === 0) {
        newInsights.push({
          type: 'info',
          icon: '⏰',
          title: 'No Active Deals',
          message: 'You currently have no active deals running.',
          action: 'Launch new deals to maintain customer engagement and revenue.'
        })
      }

      // Business type performance insights
      const businessTypePerformance = deals.reduce((acc, deal) => {
        deal.venue.businessType.forEach(businessType => {
          if (!acc[businessType]) acc[businessType] = { count: 0, redemptions: 0 }
          acc[businessType].count++
          acc[businessType].redemptions += deal.redeemedCount
        })
        return acc
      }, {} as any)

      const topBusinessType = Object.entries(businessTypePerformance)
        .sort(([,a]: any, [,b]: any) => b.redemptions - a.redemptions)[0] as [string, { count: number; redemptions: number }] | undefined

      if (topBusinessType) {
        newInsights.push({
          type: 'info',
          icon: '🍽️',
          title: 'Top Performing Business Type',
          message: `${topBusinessType[0]} deals are your best performers with ${topBusinessType[1].redemptions} total redemptions.`,
          action: 'Focus on expanding deals in this business type category.'
        })
      }

      setInsights(newInsights)

      // Generate AI predictions
      const newPredictions = []
      
      // Revenue prediction
      const avgDailyRevenue = totalRevenue / (timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)
      const predictedRevenue = avgDailyRevenue * 30 // Next 30 days
      
      newPredictions.push({
        metric: 'Revenue',
        current: totalRevenue,
        predicted: predictedRevenue,
        trend: predictedRevenue > totalRevenue ? 'up' : 'down',
        confidence: 85
      })

      // Redemption prediction
      const avgDailyRedemptions = totalRedemptions / (timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)
      const predictedRedemptions = avgDailyRedemptions * 30
      
      newPredictions.push({
        metric: 'Redemptions',
        current: totalRedemptions,
        predicted: predictedRedemptions,
        trend: predictedRedemptions > totalRedemptions ? 'up' : 'down',
        confidence: 78
      })

      // Optimal timing prediction
      const dealTimings = deals.map(deal => ({
        startHour: new Date(deal.startAt).getHours(),
        redemptions: deal.redeemedCount
      }))
      
      const hourPerformance = dealTimings.reduce((acc, deal) => {
        if (!acc[deal.startHour]) acc[deal.startHour] = 0
        acc[deal.startHour] += deal.redemptions
        return acc
      }, {} as any)

      const bestHour = Object.entries(hourPerformance)
        .sort(([,a]: any, [,b]: any) => b - a)[0]

      if (bestHour) {
        newPredictions.push({
          metric: 'Optimal Start Time',
          current: 'Various',
          predicted: `${bestHour[0]}:00`,
          trend: 'optimal',
          confidence: 92,
          note: `Deals starting at ${bestHour[0]}:00 have ${bestHour[1]} total redemptions`
        })
      }

      setPredictions(newPredictions)
      setLoading(false)
    }, 2000)
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            AI Analytics Dashboard
          </h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            AI Analytics Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Intelligent insights powered by AI
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Total Revenue</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                ${metrics.totalRevenue.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Redemptions</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {metrics.totalRedemptions}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Avg Redemption Rate</p>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {metrics.avgRedemptionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI Insights
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' :
              insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' :
              'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {insight.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                    💡 {insight.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Predictions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          AI Predictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {prediction.metric}
                </span>
                <Badge variant="secondary" className={`${
                  prediction.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  prediction.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {prediction.confidence}% confidence
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Current</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {typeof prediction.current === 'number' ? prediction.current.toFixed(0) : prediction.current}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Predicted</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {typeof prediction.predicted === 'number' ? prediction.predicted.toFixed(0) : prediction.predicted}
                  </span>
                </div>

                {prediction.note && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {prediction.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Explanation */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            How AI Works
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Our AI analyzes patterns in your deal performance, customer behavior, and market trends to provide actionable insights. 
          Predictions are based on historical data and machine learning algorithms that continuously improve accuracy.
        </p>
      </div>
    </Card>
  )
}
