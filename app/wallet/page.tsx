'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, QrCode, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

interface Voucher {
  id: string;
  code: string;
  qrData: string;
  status: 'ISSUED' | 'REDEEMED' | 'CANCELLED' | 'EXPIRED';
  issuedAt: string;
  expiresAt?: string;
  redeemedAt?: string;
  deal: {
    id: string;
    title: string;
    description: string;
    percentOff?: number;
    originalPrice?: number;
    discountedPrice?: number;
    venue: {
      name: string;
      address: string;
    };
  };
}

export default function WalletPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'redeemed' | 'expired'>('active');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchVouchers();
    }
  }, [status, router]);

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/wallet/vouchers');
      if (response.ok) {
        const data = await response.json();
        setVouchers(data.vouchers || []);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'REDEEMED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'EXPIRED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return 'Active';
      case 'REDEEMED':
        return 'Redeemed';
      case 'EXPIRED':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return 'text-blue-600 bg-blue-50';
      case 'REDEEMED':
        return 'text-green-600 bg-green-50';
      case 'EXPIRED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredVouchers = vouchers.filter(voucher => {
    switch (activeTab) {
      case 'active':
        return voucher.status === 'ISSUED';
      case 'redeemed':
        return voucher.status === 'REDEEMED';
      case 'expired':
        return voucher.status === 'EXPIRED';
      default:
        return true;
    }
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your vouchers and deals</p>
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredVouchers.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {activeTab === 'active' ? 'No active vouchers' : 
               activeTab === 'redeemed' ? 'No redeemed vouchers' : 
               'No expired vouchers'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'active' ? 'Claim some deals to see your vouchers here.' :
               activeTab === 'redeemed' ? 'Your redeemed vouchers will appear here.' :
               'Expired vouchers will appear here.'}
            </p>
            {activeTab === 'active' && (
              <Link
                href="/explore"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Deals
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Vouchers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vouchers.filter(v => v.status === 'ISSUED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Redeemed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vouchers.filter(v => v.status === 'REDEEMED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${vouchers
                    .filter(v => v.status === 'REDEEMED' && v.deal.originalPrice && v.deal.discountedPrice)
                    .reduce((total, v) => total + (v.deal.originalPrice! - v.deal.discountedPrice!), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Vouchers ({vouchers.filter(v => v.status === 'ISSUED').length})
              </button>
              <button
                onClick={() => setActiveTab('redeemed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'redeemed'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Redeemed ({vouchers.filter(v => v.status === 'REDEEMED').length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'expired'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expired ({vouchers.filter(v => v.status === 'EXPIRED').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Vouchers List */}
        {filteredVouchers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'active' && 'No active vouchers'}
              {activeTab === 'redeemed' && 'No redeemed vouchers'}
              {activeTab === 'expired' && 'No expired vouchers'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'active' && 'Start exploring deals to claim your first voucher!'}
              {activeTab === 'redeemed' && 'Your redeemed vouchers will appear here.'}
              {activeTab === 'expired' && 'Your expired vouchers will appear here.'}
            </p>
            {activeTab === 'active' && (
              <Link
                href="/explore"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Browse Deals
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVouchers.map((voucher) => (
              <div key={voucher.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getStatusIcon(voucher.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                        {getStatusText(voucher.status)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {voucher.deal.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-2">
                      {voucher.deal.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium">{voucher.deal.venue.name}</span>
                      <span className="mx-2">•</span>
                      <span>{voucher.deal.venue.address}</span>
                    </div>

                    {voucher.deal.percentOff && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-3">
                        {voucher.deal.percentOff}% OFF
                      </div>
                    )}

                    {voucher.deal.originalPrice && voucher.deal.discountedPrice && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-green-600">
                          ${(voucher.deal.discountedPrice / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${(voucher.deal.originalPrice / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          Save ${((voucher.deal.originalPrice - voucher.deal.discountedPrice) / 100).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      <p>Code: <span className="font-mono font-medium">{voucher.code}</span></p>
                      <p>Issued: {new Date(voucher.issuedAt).toLocaleDateString()}</p>
                      {voucher.expiresAt && (
                        <p>Expires: {new Date(voucher.expiresAt).toLocaleDateString()}</p>
                      )}
                      {voucher.redeemedAt && (
                        <p>Redeemed: {new Date(voucher.redeemedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  {voucher.status === 'ISSUED' && (
                    <div className="ml-6 flex flex-col items-center">
                      <div className="bg-gray-100 p-4 rounded-lg mb-3">
                        <QrCode className="w-12 h-12 text-gray-600" />
                      </div>
                      <button
                        onClick={() => {
                          // Copy code to clipboard
                          navigator.clipboard.writeText(voucher.code);
                          // You could add a toast notification here
                        }}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Copy Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}