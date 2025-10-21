'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Prevent static generation
export const runtime = 'nodejs';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QrCode, Search, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface Voucher {
  id: string;
  code: string;
  status: 'ISSUED' | 'REDEEMED' | 'CANCELLED' | 'EXPIRED';
  issuedAt: string;
  redeemedAt?: string;
  expiresAt?: string;
  deal: {
    id: string;
    title: string;
    description: string;
    type: 'HAPPY_HOUR' | 'INSTANT';
    percentOff?: number;
    price?: number;
  };
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function VoucherValidationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchCode, setSearchCode] = useState('');
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle loading and authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    router.push('/merchant/login' as any);
    return null;
  }

  const handleSearch = async () => {
    if (!searchCode.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/redemptions/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: searchCode.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoucher(data.voucher);
        setSuccess('Voucher redeemed successfully!');
        setSearchCode('');
      } else {
        setError(data.error || 'Failed to redeem voucher');
        setVoucher(null);
      }
    } catch (err) {
      console.error('Error redeeming voucher:', err);
      setError('Network error. Please try again.');
      setVoucher(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'REDEEMED':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'EXPIRED':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-gray-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REDEEMED':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Voucher Validation</h1>
            <p className="text-gray-600">Scan or enter voucher codes to redeem them</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter voucher code (e.g., OHH-AB12CD)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !searchCode.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Processing...' : 'Redeem'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <div className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <div className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Voucher Details */}
        {voucher && (
          <Card>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(voucher.status)}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Voucher Details
                    </h3>
                    <p className="text-gray-600">Code: {voucher.code}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(voucher.status)}`}>
                  {voucher.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Deal Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Title:</span> {voucher.deal.title}</p>
                    <p><span className="font-medium">Description:</span> {voucher.deal.description}</p>
                    <p><span className="font-medium">Type:</span> {voucher.deal.type.replace('_', ' ')}</p>
                    {voucher.deal.percentOff && (
                      <p><span className="font-medium">Discount:</span> {voucher.deal.percentOff}% off</p>
                    )}
                    {voucher.deal.price && (
                      <p><span className="font-medium">Price:</span> ${voucher.deal.price}</p>
                    )}
                  </div>
                </div>

                {/* Venue Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Venue Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {voucher.venue.name}</p>
                    <p><span className="font-medium">Address:</span> {voucher.venue.address}</p>
                    <p><span className="font-medium">Location:</span> {voucher.venue.city}, {voucher.venue.state}</p>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {voucher.user.email}</p>
                  {voucher.user.name && (
                    <p><span className="font-medium">Name:</span> {voucher.user.name}</p>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Issued:</span> {new Date(voucher.issuedAt).toLocaleString()}</p>
                  {voucher.expiresAt && (
                    <p><span className="font-medium">Expires:</span> {new Date(voucher.expiresAt).toLocaleString()}</p>
                  )}
                  {voucher.redeemedAt && (
                    <p><span className="font-medium">Redeemed:</span> {new Date(voucher.redeemedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <p className="text-gray-600">Ask the customer for their voucher code or scan the QR code</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <p className="text-gray-600">Enter the code in the search box above and click "Redeem"</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <p className="text-gray-600">Verify the deal details and apply the discount to the customer's order</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}