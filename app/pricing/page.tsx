import { Metadata } from 'next';
import { Check, X, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing - Happy Hour',
  description: 'Simple, transparent pricing for restaurants to fill empty tables and increase revenue.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees, no long-term contracts. Pay only when you get results. 
              Fill empty tables and increase revenue with our proven platform.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Starter Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for small restaurants</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">Free</span>
                  <span className="text-gray-600 ml-2">forever</span>
                </div>
                <ul className="space-y-4 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Up to 3 deals per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Mobile app access</span>
                  </li>
                </ul>
                <button className="w-full mt-8 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white border-2 border-amber-500 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600 mb-6">For growing restaurants</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <ul className="space-y-4 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Unlimited deals</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>QR code integration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Social media promotion</span>
                  </li>
                </ul>
                <button className="w-full mt-8 bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For restaurant chains</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <ul className="space-y-4 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Multi-location management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>24/7 phone support</span>
                  </li>
                </ul>
                <button className="w-full mt-8 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Compare Features
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-4 font-medium text-gray-900">Monthly deals</td>
                    <td className="py-4 px-4 text-center">3</td>
                    <td className="py-4 px-4 text-center">Unlimited</td>
                    <td className="py-4 px-4 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-gray-900">Analytics dashboard</td>
                    <td className="py-4 px-4 text-center">Basic</td>
                    <td className="py-4 px-4 text-center">Advanced</td>
                    <td className="py-4 px-4 text-center">Advanced</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-gray-900">Support</td>
                    <td className="py-4 px-4 text-center">Email</td>
                    <td className="py-4 px-4 text-center">Priority</td>
                    <td className="py-4 px-4 text-center">24/7 Phone</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-gray-900">Multi-location</td>
                    <td className="py-4 px-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-gray-900">API access</td>
                    <td className="py-4 px-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we'll prorate any billing differences.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a setup fee?
                </h3>
                <p className="text-gray-600">
                  No setup fees, no hidden costs. You only pay the monthly subscription fee for the plan you choose.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-amber-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Fill More Tables?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of restaurants already using Happy Hour to increase revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
