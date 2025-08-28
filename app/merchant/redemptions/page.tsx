'use client'

import { useState, useEffect } from 'react'
import { Scan, Receipt, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import QRCodeScanner from '@/components/QRCodeScanner'

interface Redemption {
  id: string
  dealId: string
  customerId: string
  redeemedAt: string
  status: string
  deal: {
    title: string
    percentOff: number
    venue: { name: string }
  }
}

export default function MerchantRedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scanSuccess, setScanSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchRedemptions()
  }, [])

  const fetchRedemptions = async () => {
    try {
      setLoading(true)
      // Fetch redemptions from API
      const response = await fetch('/api/merchant/redemptions')
      if (response.ok) {
        const data = await response.json()
        setRedemptions(data.redemptions || [])
      }
    } catch (error) {
      console.error('Error fetching redemptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScanSuccess = async (redemptionData: any) => {
    try {
      // Process the redemption through the API
      const response = await fetch('/api/redemptions/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(redemptionData),
      })

      if (response.ok) {
        const result = await response.json()
        setScanSuccess('Redemption processed successfully!')
        
        // Refresh the redemptions list
        setTimeout(() => {
          fetchRedemptions()
          setScanSuccess(null)
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('Redemption failed:', errorData.error)
      }
    } catch (error) {
      console.error('Error processing redemption:', error)
    }
  }

  const handleScanError = (error: string) => {
    console.error('Scan error:', error)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REDEEMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'REDEEMED':
        return <CheckCircle className="w-4 h-4" />
      case 'EXPIRED':
        return <XCircle className="w-4 h-4" />
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Redemptions</h1>
              <p className="text-gray-600">Scan QR codes and manage customer redemptions</p>
            </div>
            <button
              onClick={() => setShowQRScanner(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan QR Code
            </button>
          </div>
        </div>

        {/* Success Message */}
        {scanSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-800 font-medium">{scanSuccess}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                <p className="text-2xl font-bold text-gray-900">{redemptions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">
                  {redemptions.filter(r => r.status === 'REDEEMED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {redemptions.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {redemptions.filter(r => r.status === 'EXPIRED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Redemptions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Redemptions</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading redemptions...</p>
            </div>
          ) : redemptions.length === 0 ? (
            <div className="p-6 text-center">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No redemptions yet</h3>
              <p className="text-gray-600">Start scanning QR codes to see redemptions here</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Redeemed At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {redemptions.map((redemption) => (
                    <tr key={redemption.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {redemption.deal.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {redemption.deal.venue.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {redemption.deal.percentOff}% off
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {redemption.customerId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                          {getStatusIcon(redemption.status)}
                          <span className="ml-1">{redemption.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(redemption.redeemedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          View Details
                        </button>
                        {redemption.status === 'PENDING' && (
                          <button className="text-green-600 hover:text-green-900">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRCodeScanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  )
}
