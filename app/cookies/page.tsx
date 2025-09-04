import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Happy Hour',
  description: 'Learn about how we use cookies and similar technologies on our website.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              This Cookie Policy explains how Happy Hour uses cookies and similar technologies when you visit our website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What are cookies?</h2>
            <p className="text-gray-700 mb-6">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How we use cookies</h2>
            <p className="text-gray-700 mb-6">
              We use cookies to improve your experience on our website, analyze how our site is used, and for marketing purposes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of cookies we use</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Essential cookies:</strong> These are necessary for the website to function properly.</li>
              <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website.</li>
              <li><strong>Marketing cookies:</strong> These are used to track visitors across websites for advertising purposes.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing cookies</h2>
            <p className="text-gray-700 mb-6">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
              and you can set most browsers to prevent them from being placed.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about our use of cookies, please contact us at privacy@orderhappyhour.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
