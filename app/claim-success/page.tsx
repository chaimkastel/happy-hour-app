'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download, Share2, ArrowLeft, QrCode, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import QRCode from 'qrcode';

interface Voucher {
  id: string;
  code: string;
  qrData: string;
  status: 'ISSUED' | 'REDEEMED' | 'CANCELLED' | 'EXPIRED';
  issuedAt: string;
  expiresAt?: string;
  deal: {
    id: string;
    title: string;
    description: string;
    type: 'HAPPY_HOUR' | 'INSTANT';
    venue: {
      name: string;
      address: string;
      city: string;
      state: string;
    };
  };
}

export default function ClaimSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      fetchVoucher(code);
    } else {
      router.push('/explore');
    }
  }, [searchParams, router]);

  const fetchVoucher = async (code: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vouchers/${code}`);
      if (response.ok) {
        const data = await response.json();
        setVoucher(data.voucher);
        
        // Generate QR code
        if (data.voucher.qrData) {
          const qrUrl = await QRCode.toDataURL(data.voucher.qrData);
          setQrCodeUrl(qrUrl);
        }
      } else {
        router.push('/explore');
      }
    } catch (error) {
      console.error('Error fetching voucher:', error);
      router.push('/explore');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (voucher?.code) {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `voucher-${voucher?.code}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const shareVoucher = async () => {
    if (navigator.share && voucher) {
      try {
        await navigator.share({
          title: `Voucher: ${voucher.deal.title}`,
          text: `I just claimed a deal at ${voucher.deal.venue.name}! Use code: ${voucher.code}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const formatExpiry = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Voucher Not Found</h1>
          <p className="text-gray-600 mb-6">This voucher may have expired or been removed.</p>
          <Link href="/explore">
            <Button>Browse Deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Voucher Claimed!</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Claimed Successfully!</h1>
          <p className="text-gray-600">Your voucher is ready to use</p>
        </motion.div>

        {/* Voucher Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-orange-500 to-pink-500 text-white">
            <CardContent className="p-8">
              {/* Deal Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{voucher.deal.title}</h2>
                <p className="text-orange-100 mb-4">{voucher.deal.venue.name}</p>
                <div className="flex items-center justify-center text-orange-100 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {voucher.deal.venue.address}, {voucher.deal.venue.city}, {voucher.deal.venue.state}
                </div>
              </div>

              {/* Voucher Code */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-orange-100 mb-2">Voucher Code</div>
                  <div className="text-4xl font-mono font-bold tracking-wider mb-4">
                    {voucher.code}
                  </div>
                  <Button
                    onClick={copyCode}
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="text-center mb-6">
                  <div className="bg-white rounded-xl p-4 inline-block">
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <div className="text-sm text-orange-100 mt-2">
                    Show this QR code to redeem
                  </div>
                </div>
              )}

              {/* Expiry Info */}
              {voucher.expiresAt && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center text-orange-100 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatExpiry(voucher.expiresAt)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={copyCode}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
            
            {qrCodeUrl && (
              <Button
                onClick={downloadQR}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            )}
            
            <Button
              onClick={shareVoucher}
              variant="outline"
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="text-center">
            <Link href="/explore">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Find More Deals
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">How to Use Your Voucher</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</div>
                  <div>Visit the restaurant during the deal's active hours</div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</div>
                  <div>Show your QR code or tell them your voucher code</div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</div>
                  <div>Enjoy your discount! The voucher can only be used once</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}