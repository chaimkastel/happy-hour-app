import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy - Happy Hour',
  description: 'Refund Policy for Happy Hour app',
  robots: 'noindex, follow',
};

export default function RefundPolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                This Refund Policy outlines the circumstances under which Happy Hour will provide 
                refunds for services and subscriptions. Please read this policy carefully before 
                making any purchases.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Merchant Subscriptions</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For merchant subscription fees:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Monthly Subscriptions:</strong> Refunds are available within 7 days of the initial purchase</li>
                <li><strong>Annual Subscriptions:</strong> Refunds are available within 30 days of the initial purchase</li>
                <li><strong>Pro-rated Refunds:</strong> For annual subscriptions, refunds will be calculated based on unused months</li>
                <li><strong>Processing Time:</strong> Refunds will be processed within 5-10 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vouchers and Deals</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For vouchers and deal redemptions:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Restaurant Issues:</strong> If a restaurant refuses to honor a valid voucher, we will provide a full refund</li>
                <li><strong>Technical Issues:</strong> If our system fails to process a valid voucher, we will provide a full refund</li>
                <li><strong>Expired Vouchers:</strong> No refunds for expired vouchers unless due to our technical error</li>
                <li><strong>Used Vouchers:</strong> No refunds for vouchers that have been successfully redeemed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Non-Refundable Items</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following items are generally non-refundable:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Vouchers that have been successfully redeemed</li>
                <li>Services that have been fully utilized</li>
                <li>Digital content that has been downloaded or accessed</li>
                <li>Custom services or features developed specifically for a merchant</li>
                <li>Fees for services rendered (such as setup fees)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Request a Refund</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To request a refund, please:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                <li>Contact our support team at support@orderhappyhour.com</li>
                <li>Include your order number or transaction ID</li>
                <li>Provide a detailed explanation of why you're requesting a refund</li>
                <li>Include any relevant documentation or screenshots</li>
              </ol>
              <p className="text-gray-700 leading-relaxed mt-4">
                We will review your request and respond within 2-3 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Processing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once approved, refunds will be processed as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Credit Card:</strong> Refunded to the original payment method within 5-10 business days</li>
                <li><strong>Bank Transfer:</strong> Refunded to the original account within 7-14 business days</li>
                <li><strong>Digital Wallet:</strong> Refunded to the original wallet within 3-5 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Disputes and Chargebacks</h2>
              <p className="text-gray-700 leading-relaxed">
                If you initiate a chargeback or dispute with your bank or credit card company, 
                we may suspend your account until the dispute is resolved. We encourage you to 
                contact us directly first to resolve any issues before initiating a chargeback.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify this Refund Policy at any time. Changes will be 
                effective immediately upon posting. Your continued use of our services after 
                changes are posted constitutes acceptance of the modified policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Refund Policy, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@happyhour.app<br />
                  <strong>Phone:</strong> (415) 555-HAPPY<br />
                  <strong>Address:</strong> Happy Hour Inc., 456 Restaurant Row, San Francisco, CA 94102
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
