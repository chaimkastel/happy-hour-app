export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Authentication cookies</li>
                  <li>Security cookies</li>
                  <li>Session management cookies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Performance Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Analytics cookies</li>
                  <li>Error tracking cookies</li>
                  <li>Performance monitoring cookies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Functionality Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Language preference cookies</li>
                  <li>Location preference cookies</li>
                  <li>User interface customization cookies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Marketing Cookies</h3>
                <p className="text-gray-700 mb-3">
                  These cookies are used to track visitors across websites to display relevant and engaging advertisements.
                </p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Advertising cookies</li>
                  <li>Social media cookies</li>
                  <li>Retargeting cookies</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Specific Cookies We Use</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Cookie Name</th>
                      <th className="text-left py-2 font-semibold">Purpose</th>
                      <th className="text-left py-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">session_id</td>
                      <td className="py-2">Maintains your login session</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">user_preferences</td>
                      <td className="py-2">Stores your preferences</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">analytics_id</td>
                      <td className="py-2">Tracks website usage</td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-2">marketing_id</td>
                      <td className="py-2">Enables personalized ads</td>
                      <td className="py-2">90 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services that place cookies on your device. These services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                <li><strong>Stripe:</strong> Payment processing and security</li>
                <li><strong>Social Media Platforms:</strong> Social sharing and login functionality</li>
                <li><strong>Advertising Networks:</strong> Relevant advertising and retargeting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies in several ways:
              </p>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Browser Settings</h3>
                <p className="text-gray-700 mb-2">
                  Most browsers allow you to refuse cookies or delete them. You can usually find these settings in the "Options" or "Preferences" menu.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cookie Consent</h3>
                <p className="text-gray-700 mb-2">
                  When you first visit our website, you'll see a cookie banner where you can choose which types of cookies to accept.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Opt-Out Tools</h3>
                <p className="text-gray-700 mb-2">
                  You can opt out of certain types of cookies, particularly marketing cookies, through industry opt-out tools.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-gray-700 mb-4">
                If you choose to disable cookies, some features of our website may not function properly:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You may need to log in every time you visit</li>
                <li>Personalized content may not be available</li>
                <li>Some website features may not work as expected</li>
                <li>Your preferences may not be remembered</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> cookies@happyhour.com<br />
                  <strong>Phone:</strong> +1 (555) 123-4567<br />
                  <strong>Address:</strong> 123 Business St, City, State 12345
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
