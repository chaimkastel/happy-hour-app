'use client'

import { useState, useEffect } from 'react'
import { Activity, Database, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react'

interface RedisHealthData {
  status: string
  timestamp: string
  redis: {
    connection: {
      status: 'healthy' | 'unhealthy'
      message: string
      latency?: number
    }
    cache: {
      status: 'working' | 'failed'
      message: string
    }
    rateLimit: {
      status: 'working' | 'failed'
      message: string
      remaining: number
      resetTime: number
    }
    session: {
      status: 'working' | 'failed'
      message: string
    }
  }
  summary: {
    overall: 'healthy' | 'degraded' | 'unhealthy'
    services: {
      connection: 'healthy' | 'unhealthy'
      cache: 'healthy' | 'unhealthy'
      rateLimit: 'healthy' | 'unhealthy'
      session: 'healthy' | 'unhealthy'
    }
  }
}

export default function RedisDashboard() {
  const [healthData, setHealthData] = useState<RedisHealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchHealthData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/health/redis')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHealthData(data)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
    const interval = setInterval(fetchHealthData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'working':
        return 'text-green-600 bg-green-100'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100'
      case 'unhealthy':
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'working':
        return <TrendingUp className="w-4 h-4" />
      case 'degraded':
        return <Clock className="w-4 h-4" />
      case 'unhealthy':
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Database className="w-4 h-4" />
    }
  }

  if (loading && !healthData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 text-red-600 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Redis Health Check Failed</h3>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchHealthData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!healthData) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Database className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Redis Performance Dashboard</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthData.summary.overall)}`}>
            {getStatusIcon(healthData.summary.overall)}
            <span className="ml-1 capitalize">{healthData.summary.overall}</span>
          </div>
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Connection Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Connection</h4>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(healthData.redis.connection.status)}`}>
            {getStatusIcon(healthData.redis.connection.status)}
            <span className="ml-1 capitalize">{healthData.redis.connection.status}</span>
          </div>
          {healthData.redis.connection.latency && (
            <p className="text-sm text-gray-600 mt-1">
              Latency: {healthData.redis.connection.latency}ms
            </p>
          )}
        </div>

        {/* Cache Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h4 className="font-medium text-gray-900">Cache</h4>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(healthData.redis.cache.status)}`}>
            {getStatusIcon(healthData.redis.cache.status)}
            <span className="ml-1 capitalize">{healthData.redis.cache.status}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {healthData.redis.cache.message}
          </p>
        </div>

        {/* Rate Limiting */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Rate Limit</h4>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(healthData.redis.rateLimit.status)}`}>
            {getStatusIcon(healthData.redis.rateLimit.status)}
            <span className="ml-1 capitalize">{healthData.redis.rateLimit.status}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Remaining: {healthData.redis.rateLimit.remaining}
          </p>
        </div>

        {/* Session Management */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Sessions</h4>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(healthData.redis.session.status)}`}>
            {getStatusIcon(healthData.redis.session.status)}
            <span className="ml-1 capitalize">{healthData.redis.session.status}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {healthData.redis.session.message}
          </p>
        </div>
      </div>

      {/* Service Status Summary */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Service Status Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(healthData.summary.services).map(([service, status]) => (
            <div key={service} className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium capitalize">{service}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={fetchHealthData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <Activity className="w-4 h-4" />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>
    </div>
  )
}
