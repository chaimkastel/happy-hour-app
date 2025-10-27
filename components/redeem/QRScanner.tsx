'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, X, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QRScannerProps {
  dealId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function QRScanner({ dealId, onSuccess, onClose }: QRScannerProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [qrCode, setQrCode] = useState('');
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    // Generate QR code
    setQrCode(`HH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    
    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaim = async () => {
    try {
      const response = await fetch('/api/wallet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId }),
      });

      if (response.ok) {
        setClaimed(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Error claiming deal:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {claimed ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Deal Claimed!</h3>
            <p className="text-gray-600">Added to your wallet</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Redeem Your Deal</h3>
              <p className="text-gray-600">Show this QR code to staff</p>
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold mb-6">
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* QR Code Display */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6">
              <div className="text-center font-mono text-2xl font-bold text-gray-900 mb-4">
                {qrCode}
              </div>
              <div className="flex items-center justify-center">
                <QrCode className="w-48 h-48 text-gray-900" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Staff can scan this code or enter it manually. Valid for 15 minutes.
              </p>
            </div>

            <Button
              onClick={handleClaim}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
            >
              Confirm Claim
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

