'use client';

import React from 'react';
import { WifiOff, RefreshCw, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>
        
        <p className="text-gray-600 mb-8">
          It looks like you're not connected to the internet. Check your connection and try again.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleRefresh}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            
            <Link href="/explore">
              <Button
                variant="outline"
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Explore
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            Offline Features
          </h3>
          <p className="text-sm text-blue-700">
            Some features may still work offline if you've visited them before.
          </p>
        </div>
      </div>
    </div>
  );
}

