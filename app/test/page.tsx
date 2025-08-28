'use client';
import { useState } from 'react';
import { QrCode, CheckCircle, Building2, Tag, Star, MapPin } from 'lucide-react';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    try {
      addResult('Testing deals API...');
      const response = await fetch('/api/deals');
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        addResult(`✅ Deals API working - ${data.items.length} deals found`);
        
        // Test QR generation
        const deal = data.items[0];
        addResult(`Testing QR generation for deal: ${deal.title}`);
        
        const qrResponse = await fetch(`/api/redeem/qr?id=${deal.id}`);
        if (qrResponse.ok) {
          addResult('✅ QR generation working');
        } else {
          addResult('❌ QR generation failed');
        }
      } else {
        addResult('❌ Deals API returned no data');
      }
    } catch (error) {
      addResult(`❌ API test failed: ${error}`);
    }
  };

  const testDealCreation = async () => {
    try {
      addResult('Testing deal creation...');
      
      // First create a restaurant
      const restaurantResponse = await fetch('/api/merchant/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Restaurant',
          address: '123 Test St, Test City',
          lat: 40.7128,
          lng: -74.0060
        })
      });
      
      if (restaurantResponse.ok) {
        addResult('✅ Restaurant created successfully');
        
        // Now create a deal
        const dealResponse = await fetch('/api/merchant/deal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurantId: 'test-restaurant-id',
            title: 'Test Deal',
            description: 'Test description',
            discountPercent: 25,
            dealType: 'quiet_time'
          })
        });
        
        if (dealResponse.ok) {
          addResult('✅ Deal created successfully');
        } else {
          addResult('❌ Deal creation failed');
        }
      } else {
        addResult('❌ Restaurant creation failed');
      }
    } catch (error) {
      addResult(`❌ Deal creation test failed: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Happy Hour Ultra Test Page</h1>
          <p className="text-xl text-slate-600">
            Test the application functionality and verify all features are working
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Test Controls</h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={testAPI}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Test API Endpoints
            </button>
            
            <button
              onClick={testDealCreation}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Test Deal Creation
            </button>
            
            <button
              onClick={clearResults}
              className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Test Results</h2>
          
          {testResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No tests run yet. Click the buttons above to start testing.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl text-sm font-mono ${
                    result.includes('✅') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : result.includes('❌')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Overview */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Features Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Restaurant Management</h3>
                  <p className="text-sm text-slate-600">Add and manage restaurant locations</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Deal Creation</h3>
                  <p className="text-sm text-slate-600">Create quiet time and happy blast deals</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">QR Code Generation</h3>
                  <p className="text-sm text-slate-600">Generate QR codes for deal redemption</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Customer Experience</h3>
                  <p className="text-sm text-slate-600">Beautiful deal discovery and redemption</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Home Page
            </a>
            
            <a
              href="/merchant"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Merchant Dashboard
            </a>
            
            <a
              href="/merchant/dashboard"
              className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              Enhanced Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
