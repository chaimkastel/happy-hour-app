import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - Happy Hour',
  description: 'Cookie Policy for Happy Hour app',
  robots: 'noindex, follow',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website 
                or use our mobile application. They help us provide you with a better experience by 
                remembering your preferences and enabling certain functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies for several purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>To remember your login status and preferences</li>
                <li>To analyze how you use our app and improve our services</li>
                <li>To provide personalized content and deals</li>
                <li>To ensure the security of our platform</li>
                <li>To measure the effectiveness of our marketing campaigns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Essential Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies are necessary for the app to function properly. They enable basic 
                    functionality like page navigation and access to secure areas.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                    <li>Authentication cookies</li>
                    <li>Session management cookies</li>
                    <li>Security cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Analytics Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies help us understand how visitors interact with our app by collecting 
                    and reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                    <li>Google Analytics cookies</li>
                    <li>Usage tracking cookies</li>
                    <li>Performance monitoring cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Preference Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies remember your choices and preferences to provide a more personalized experience.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                    <li>Language preference cookies</li>
                    <li>Location preference cookies</li>
                    <li>Theme and display preference cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Marketing Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies are used to track visitors across websites to display relevant 
                    advertisements and measure campaign effectiveness.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                    <li>Advertising cookies</li>
                    <li>Social media cookies</li>
                    <li>Retargeting cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may use third-party services that set their own cookies. These include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Stripe:</strong> For payment processing and fraud prevention</li>
                <li><strong>Social Media Platforms:</strong> For social sharing and authentication</li>
                <li><strong>Advertising Networks:</strong> For targeted advertising and campaign measurement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have several options for managing cookies:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Browser Settings</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2 text-sm">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set up notifications when cookies are set</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mobile App Settings</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In our mobile app, you can manage certain preferences through the app settings menu.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Opt-Out Tools</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can opt out of certain advertising cookies through industry opt-out tools:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2 text-sm">
                    <li>Digital Advertising Alliance (DAA) opt-out page</li>
                    <li>Network Advertising Initiative (NAI) opt-out page</li>
                    <li>Google Ads Settings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                If you choose to disable cookies, some features of our app may not function properly. 
                This may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Inability to stay logged in</li>
                <li>Loss of personalized preferences</li>
                <li>Reduced functionality of certain features</li>
                <li>Less relevant content and deals</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookie Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain for a set period (typically 30 days to 2 years)</li>
                <li><strong>Essential cookies:</strong> Retained for the duration of your session</li>
                <li><strong>Analytics cookies:</strong> Typically retained for 2 years</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                material changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@orderhappyhour.com<br />
                  <strong>Address:</strong> Happy Hour Inc., 123 Business St, City, State 12345
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}