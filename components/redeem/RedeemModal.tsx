'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Clock, CheckCircle, Copy, AlertCircle } from 'lucide-react';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
  dealTitle: string;
}

export default function RedeemModal({ isOpen, onClose, dealId, dealTitle }: RedeemModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [redeemed, setRedeemed] = useState(false);
  const [voucherCode, setVoucherCode] = useState('ABC123');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || redeemed) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, redeemed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Redeem Deal</h2>
              <p className="text-sm text-gray-600 mt-1">{dealTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {!redeemed ? (
              <>
                {/* QR Code Section */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                    <QrCode className="w-48 h-48 text-gray-800" />
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Show this QR code to your server or bartender
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-2 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="text-sm text-orange-600 font-medium">Time Remaining</div>
                    <div className="text-2xl font-bold text-orange-700 font-mono">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                {/* Manual Code Fallback */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Manual Code</span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-2xl font-bold text-gray-900 text-center tracking-wider">
                    {voucherCode}
                  </div>
                </div>

                {/* Help */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Can&apos;t scan?</p>
                    <p>Give your server this code or show them the QR code when you order.</p>
                  </div>
                </div>

                {/* Expired Notice */}
                {timeRemaining === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-sm text-red-800 font-medium">
                      ⏰ This code has expired. Please claim a new one.
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Redeemed!</h3>
                <p className="text-gray-600">Your deal has been applied. Enjoy!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

