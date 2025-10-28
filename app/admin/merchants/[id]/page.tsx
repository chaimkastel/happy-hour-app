'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Merchant {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
}

export default function MerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.id as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMerchant();
  }, [merchantId]);

  const fetchMerchant = async () => {
    try {
      // TODO: Fetch merchant details from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for now
      setMerchant({
        id: merchantId,
        businessName: 'Sample Restaurant',
        email: 'owner@restaurant.com',
        phone: '+1 234 567 8900',
        address: '123 Main St, City, State 12345',
        status: 'APPROVED',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching merchant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/approve`, {
        method: 'POST'
      });
      
      if (response.ok) {
        router.push('/admin/merchants');
      }
    } catch (error) {
      console.error('Error approving merchant:', error);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        router.push('/admin/merchants');
      }
    } catch (error) {
      console.error('Error rejecting merchant:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Merchant not found</h2>
          <button
            onClick={() => router.back()}
            className="text-orange-600 hover:text-orange-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{merchant.businessName}</h1>
            <p className="text-gray-600">Merchant Details</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            merchant.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
            merchant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            merchant.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {merchant.status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Business Name</p>
                <p className="font-semibold text-gray-900">{merchant.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{merchant.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">{merchant.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Location</h2>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-gray-900">{merchant.address}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {merchant.status === 'PENDING' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

