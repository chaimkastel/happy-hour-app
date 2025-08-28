export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🍔</div>
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-xl text-white/80 mb-8">The page you're looking for doesn't exist.</p>
        <a 
          href="/"
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          🚀 Back to Home
        </a>
      </div>
    </div>
  );
}
