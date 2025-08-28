'use client'

import React, { useState, useEffect } from 'react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

interface HealthCheck {
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  responseTime: number
  error?: string
  details?: Record<string, any>
  lastCheck: string
}

interface Alert {
  id: string
  level: 'info' | 'warning' | 'critical'
  title: string
  message: string
  timestamp: string
  resolved: boolean
  metadata?: Record<string, any>
}

interface Metrics {
  timestamp: string
  uptime: number
  memoryUsage: {
    heapUsed: number
    heapTotal: number
    external: number
    rss: number
  }
  cpuUsage: number
  activeConnections: number
  errorRate: number
  responseTime: number
}

interface MonitoringData {
  status: 'healthy' | 'warning' | 'critical'
  timestamp: string
  checks: Record<string, HealthCheck>
  metrics?: {
    current: Metrics
    history: Metrics[]
    trends: any
  }
  alerts?: {
    recent: Alert[]
    summary: {
      total: number
      critical: number
      warning: number
      info: number
      unresolved: number
    }
  }
  summary: {
    totalChecks: number
    healthyChecks: number
    warningChecks: number
    criticalChecks: number
    activeAlerts?: number
  }
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch('/api/admin/monitoring?includeMetrics=true&includeAlerts=true')
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runHealthCheck = async () => {
    try {
      setLoading(true)
      await fetch('/api/admin/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_check' })
      })
      await fetchMonitoringData()
    } catch (error) {
      console.error('Failed to run health check:', error)
    } finally {
      setLoading(false)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch('/api/admin/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve_alert', alertId })
      })
      await fetchMonitoringData()
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  useEffect(() => {
    fetchMonitoringData()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchMonitoringData, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'healthy': return '✅'
      case 'warning': return '⚠️'
      case 'critical': return '🚨'
      default: return '❓'
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  if (loading && !data) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Failed to load monitoring data</p>
          <Button onClick={fetchMonitoringData}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {getStatusEmoji(data.status)} System Monitoring
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdate?.toLocaleTimeString() || 'Never'}
          </p>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto-refresh
          </label>
          <Button onClick={runHealthCheck} disabled={loading}>
            {loading ? 'Running...' : 'Run Check'}
          </Button>
          <Button onClick={fetchMonitoringData} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-4 h-4 rounded-full ${getStatusColor(data.status)}`}></div>
          <div>
            <h2 className="text-xl font-semibold">Overall Status: {data.status.toUpperCase()}</h2>
            <p className="text-gray-600">
              {data.summary.healthyChecks}/{data.summary.totalChecks} checks passing
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.summary.healthyChecks}</div>
            <div className="text-sm text-gray-600">Healthy Checks</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{data.summary.warningChecks}</div>
            <div className="text-sm text-gray-600">Warning Checks</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{data.summary.criticalChecks}</div>
            <div className="text-sm text-gray-600">Critical Checks</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.alerts?.summary.unresolved || 0}
            </div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </div>
        </Card>
      </div>

      {/* System Metrics */}
      {data.metrics?.current && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Uptime</div>
              <div className="text-lg font-semibold">
                {formatUptime(data.metrics.current.uptime)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Memory Usage</div>
              <div className="text-lg font-semibold">
                {formatBytes(data.metrics.current.memoryUsage.heapUsed)} / 
                {formatBytes(data.metrics.current.memoryUsage.heapTotal)}
              </div>
              <div className="text-xs text-gray-500">
                {((data.metrics.current.memoryUsage.heapUsed / data.metrics.current.memoryUsage.heapTotal) * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="text-lg font-semibold">
                {data.metrics.current.errorRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
              <div className="text-lg font-semibold">
                {data.metrics.current.responseTime.toFixed(0)}ms
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Health Checks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Health Checks</h3>
        <div className="space-y-3">
          {Object.entries(data.checks).map(([name, check]) => (
            <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(check.status)}`}></div>
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-gray-600">
                    Response time: {check.responseTime}ms
                  </div>
                  {check.error && (
                    <div className="text-sm text-red-600 mt-1">{check.error}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge variant={check.status === 'healthy' ? 'default' : 'destructive'}>
                  {check.status}
                </Badge>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(check.lastCheck).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Alerts */}
      {data.alerts?.recent && data.alerts.recent.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {data.alerts.recent.slice(0, 10).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-lg">
                    {alert.level === 'critical' ? '🚨' : alert.level === 'warning' ? '⚠️' : 'ℹ️'}
                  </div>
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm text-gray-600">{alert.message}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.resolved ? 'default' : 'destructive'}>
                    {alert.resolved ? 'Resolved' : 'Active'}
                  </Badge>
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}