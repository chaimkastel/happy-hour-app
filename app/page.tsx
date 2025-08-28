export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Happy Hour
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Restaurants flip the switch when they're quiet. You get instant deals nearby.
          </p>
          
          <div className="max-w-2xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Search for deals, restaurants, or cuisines..."
              className="w-full px-6 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">1</div>
              <div className="text-slate-600 dark:text-slate-400">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50%</div>
              <div className="text-slate-600 dark:text-slate-400">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-400">Deal Updates</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Featured Deals
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discover amazing offers from local restaurants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                50% OFF
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Happy Hour Special
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                50% off all appetizers and drinks
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Sample Restaurant
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Restaurant • Bar
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  4.5 • MODERATE
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors">
                  View Deal
                </button>
                
                <div className="text-right">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Min Spend</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">$20</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 dark:bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Save?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who are already saving money on dining out.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold hover:bg-indigo-50 transition-colors inline-block">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
