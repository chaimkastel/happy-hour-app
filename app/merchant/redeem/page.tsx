'use client';

import { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, XCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RedemptionData {
  dealId: string;
  dealTitle: string;
  customerName: string;
  customerEmail: string;
  venueName: string;
  percentOff: number;
  minSpend: number;
  inPersonOnly: boolean;
  status: 'PENDING' | 'REDEEMED' | 'EXPIRED' | 'INVALID';
}

export default function MerchantRedeemPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [currentRedemption, setCurrentRedemption] = useState<RedemptionData | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock QR code data for demonstration
  const mockQRData = {
    dealId: 'cmet8jupr000bye91qv8nyweh',
    dealTitle: 'Happy Hour Special',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    venueName: 'Crown Heights Trattoria',
    percentOff: 50,
    minSpend: 25,
    inPersonOnly: true,
    status: 'PENDING' as const
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleQRCodeScan = (qrData: string) => {
    setScanResult(qrData);
    stopScanning();
    
    // For demo purposes, we'll use mock data
    // In a real app, you'd parse the QR code data
    setCurrentRedemption(mockQRData);
  };

  const handleRedeem = async () => {
    if (!currentRedemption) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update redemption status
      setCurrentRedemption(prev => prev ? { ...prev, status: 'REDEEMED' } : null);
      setSuccess('Deal successfully redeemed!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to redeem deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    if (!currentRedemption) return;
    
    setCurrentRedemption(prev => prev ? { ...prev, status: 'INVALID' } : null);
    setError('Deal rejected.');
    
    // Clear error message after 3 seconds
    setTimeout(() => setError(''), 3000);
  };

  const resetScan = () => {
    setCurrentRedemption(null);
    setScanResult('');
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link 
              href="/merchant"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Redeem Deals</h1>
              <p className="text-gray-600 mt-1">Scan QR codes to redeem customer deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentRedemption ? (
          /* QR Scanner Interface */
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center mb-8">
              <QrCode className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Scan QR Code</h2>
              <p className="text-gray-600">Point your camera at a customer's QR code to redeem their deal</p>
            </div>

            {!isScanning ? (
              <div className="text-center">
                <button
                  onClick={startScanning}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Scanning
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-indigo-500 w-48 h-48 rounded-lg"></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={stopScanning}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Stop Scanning
                  </button>
                </div>

                {/* Demo QR Code for testing */}
                <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Demo: Click to simulate QR scan</p>
                  <button
                    onClick={() => handleQRCodeScan('demo-qr-code')}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Test QR Code
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Redemption Details */
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Deal Details</h2>
              <p className="text-gray-600">Review the deal before redeeming</p>
            </div>

            {/* Deal Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Deal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Deal:</span>
                      <p className="font-medium">{currentRedemption.dealTitle}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Discount:</span>
                      <p className="font-medium text-green-600">{currentRedemption.percentOff}% off</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Minimum Spend:</span>
                      <p className="font-medium">${currentRedemption.minSpend}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium">
                        {currentRedemption.inPersonOnly ? 'In-person only' : 'Available online'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <p className="font-medium">{currentRedemption.customerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{currentRedemption.customerEmail}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Venue:</span>
                      <p className="font-medium">{currentRedemption.venueName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="text-center space-y-4">
              {currentRedemption.status === 'PENDING' && (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleReject}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Deal
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Processing...' : 'Redeem Deal'}
                  </button>
                </div>
              )}

              {currentRedemption.status === 'REDEEMED' && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Deal Redeemed!</h3>
                  <p className="text-gray-600 mb-4">The customer's deal has been successfully redeemed.</p>
                </div>
              )}

              {currentRedemption.status === 'INVALID' && (
                <div className="text-center">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-600 mb-2">Deal Rejected</h3>
                  <p className="text-gray-600 mb-4">This deal has been marked as invalid.</p>
                </div>
              )}

              <button
                onClick={resetScan}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Scan Another Code
              </button>
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
