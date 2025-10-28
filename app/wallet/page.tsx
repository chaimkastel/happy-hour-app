'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, QrCode, Clock, CheckCircle, XCircle, Star, MapPin, ArrowRight, Gift } from 'lucide-react';
import BottomNav from '@/components/navigation/BottomNav';

interface Voucher {
  id: string;
  code: string;
  status: 'ISSUED' | 'REDEEMED' | 'CANCELLED' | 'EXPIRED';
  issuedAt: string;
  expiresAt?: string;
  redeemedAt?: string;
  deal: {
    id: string;
    title: string;
    description: string;
    image?: string;
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
      // For now, use mock data
      const response = await fetch('/api/deals/mock');
      const data = await response.json();
      const deals = data.deals || [];
      
      // Create mock vouchers from deals
      const mockVouchers: Voucher[] = deals.slice(0, 3).map((deal: any, index: number) => ({
        id: `voucher_${index}`,
        code: `CODE${1000 + index}`,
        status: index === 0 ? 'ISSUED' : index === 1 ? 'REDEEMED' : 'EXPIRED',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        deal: {
          id: deal.id,
          title: deal.title,
          description: deal.venue.name,
          image: deal.image,
          percentOff: deal.percentOff,
          venue: deal.venue
        }
      }));
      
      setVouchers(mockVouchers);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
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

  const stats = {
    active: vouchers.filter(v => v.status === 'ISSUED').length,
    redeemed: vouchers.filter(v => v.status === 'REDEEMED').length,
    totalSavings: '$127.50'
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 flex items-center justify-center pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600">Loading wallet...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-100"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wallet</h1>
          <p className="text-slate-600">Your vouchers and savings at a glance</p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.active}</div>
                <div className="text-xs text-slate-500">Active</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.redeemed}</div>
                <div className="text-xs text-slate-500">Redeemed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-50 rounded-lg">
                <Gift className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalSavings}</div>
                <div className="text-xs text-slate-500">Saved</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200"
        >
          <div className="flex">
            {(['active', 'redeemed', 'expired'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-4 text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Vouchers List */}
        <AnimatePresence mode="wait">
          {filteredVouchers.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-12 text-center border border-slate-200"
            >
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {activeTab === 'active' && 'No active vouchers'}
                {activeTab === 'redeemed' && 'No redeemed vouchers'}
                {activeTab === 'expired' && 'No expired vouchers'}
              </h3>
              <p className="text-slate-600 mb-6">
                {activeTab === 'active' && 'Claim some deals to see your vouchers here.'}
                {activeTab === 'redeemed' && 'Your redeemed vouchers will appear here.'}
                {activeTab === 'expired' && 'Your expired vouchers will appear here.'}
              </p>
              {activeTab === 'active' && (
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-md transition-all"
                >
                  Browse Deals
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="vouchers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredVouchers.map((voucher, index) => (
                <motion.div
                  key={voucher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all"
                >
                  {/* Voucher Card */}
                  <div className="relative h-48">
                    {voucher.deal.image ? (
                      <Image
                        src={voucher.deal.image}
                        alt={voucher.deal.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-300 flex items-center justify-center">
                        <div className="text-7xl opacity-30">🎫</div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        voucher.status === 'ISSUED' ? 'bg-green-500 text-white' :
                        voucher.status === 'REDEEMED' ? 'bg-slate-600 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {voucher.status === 'ISSUED' ? 'Active' :
                         voucher.status === 'REDEEMED' ? 'Redeemed' :
                         'Expired'}
                      </div>
                    </div>

                    {/* Code Badge */}
                    {voucher.status === 'ISSUED' && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
                          <div className="text-xs text-slate-500 mb-1">Code</div>
                          <div className="font-mono font-bold text-lg text-slate-900">{voucher.code}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">
                      {voucher.deal.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{voucher.deal.description}</p>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{voucher.deal.venue.name}</span>
                    </div>

                    {voucher.deal.percentOff && (
                      <div className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-bold mb-4">
                        {voucher.deal.percentOff}% OFF
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Issued {new Date(voucher.issuedAt).toLocaleDateString()}</span>
                      </div>
                      {voucher.status === 'ISSUED' && (
                        <button
                          onClick={() => navigator.clipboard.writeText(voucher.code)}
                          className="text-orange-600 hover:text-orange-700 font-semibold"
                        >
                          Copy Code
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
