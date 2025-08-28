'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, Heart, Menu, X, LogIn, LogOut, User, MapPin, Crosshair, Search } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Header location control state
  const [locationQuery, setLocationQuery] = useState('');
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load last location label for convenience
    const lastLocationLabel = localStorage.getItem('hh:lastLocationLabel');
    if (lastLocationLabel) setLocationQuery(lastLocationLabel);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const dispatchLocation = (lat: number, lng: number, label?: string) => {
    try {
      if (label) localStorage.setItem('hh:lastLocationLabel', label);
      localStorage.setItem('hh:lastLocationCoords', JSON.stringify({ lat, lng }));
    } catch {}
    window.dispatchEvent(new CustomEvent('app:set-location', { detail: { lat, lng, label } }));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
      return;
    }
    
    setIsResolvingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        console.log('Location obtained:', { lat, lng });
        
        // Use reverse geocoding to get human-readable location name
        reverseGeocode(lat, lng);
        
        dispatchLocation(lat, lng, 'Getting location...');
        setShowLocationSuggestions(false);
        setIsResolvingLocation(false);
        
        // Show success feedback
        console.log('Location set successfully!');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsResolvingLocation(false);
        
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      )
      if (response.ok) {
        const data = await response.json()
        if (data.address) {
          const suburb = data.address.suburb || data.address.neighbourhood
          const city = data.address.city || data.address.town || data.address.village
          const state = data.address.state
          const country = data.address.country
          
          // Try to get the most specific location name
          let locationName = 'Unknown location'
          if (suburb && city) {
            locationName = `${suburb}, ${city}`
          } else if (suburb) {
            locationName = suburb
          } else if (city && state) {
            locationName = `${city}, ${state}`
          } else if (city) {
            locationName = city
          } else if (state && country) {
            locationName = `${state}, ${country}`
          } else {
            locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          }
          
          setLocationQuery(locationName)
          dispatchLocation(lat, lng, locationName)
        }
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      // Fallback to coordinates if geocoding fails
      const fallbackName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      setLocationQuery(fallbackName)
      dispatchLocation(lat, lng, fallbackName)
    }
  }

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, { 
        headers: { 'Accept': 'application/json' } 
      });
      const data = await res.json();
      setLocationSuggestions(data);
      setShowLocationSuggestions(true);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const selectLocation = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    const label = suggestion.display_name;
    
    dispatchLocation(lat, lon, label);
    setLocationQuery(label);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleLocationInputChange = (value: string) => {
    setLocationQuery(value);
    if (value.length >= 3) {
      searchLocations(value);
    } else {
      setShowLocationSuggestions(false);
      setLocationSuggestions([]);
    }
  };

  return (
    <SessionProvider>
      <div className={`min-h-screen transition-all duration-500 ${isHydrated && isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 text-2xl sm:text-3xl font-black tracking-tight hover:scale-105 transition-all duration-300 text-slate-900 dark:text-white">
              🍺 Happy Hour
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Enhanced Location Control */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200">
                  <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {locationQuery || 'Set your location'}
                    </p>
                  </div>
                  <button
                    onClick={useMyLocation}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isResolvingLocation 
                        ? 'bg-slate-200 text-slate-600 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                    }`}
                    title="Use my location"
                    disabled={isResolvingLocation}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    {isResolvingLocation ? 'Locating…' : 'My Location'}
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                <a href="/" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 font-medium text-sm tracking-wide">
                  Explore
                </a>
                <a href="/favorites" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 font-medium text-sm tracking-wide flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Favorites
                </a>
                        <a href="/account" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 font-medium text-sm tracking-wide flex items-center gap-2">
          <User className="w-4 h-4" />
          My Account
        </a>
        <a href="/wallet" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 font-medium text-sm tracking-wide flex items-center gap-2">
          💳 Wallet
        </a>
        {/* Owner section hidden for now
        <a href="/owner" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 font-medium text-sm tracking-wide flex items-center gap-2">
          🏢 Owner
        </a>
        */}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleLogin}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm ${
                    isLoggedIn 
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isLoggedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  {isLoggedIn ? 'Logout' : 'Login'}
                </button>

                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-xl transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-2xl transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative p-4 rounded-2xl transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 ${
                  isMobileMenuOpen 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  <span className="hidden sm:inline">
                    {isMobileMenuOpen ? 'Close' : 'Menu'}
                  </span>
                </div>
                {!isMobileMenuOpen && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/60 dark:border-slate-700/60">
            <nav className="px-4 sm:px-6 py-8 space-y-6 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl">
              {/* Mobile Location Control */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl px-4 py-3">
                  <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <input
                    value={locationQuery}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    placeholder="Enter your location"
                    className="bg-transparent focus:outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-500 flex-1"
                  />
                  <button
                    onClick={useMyLocation}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isResolvingLocation 
                        ? 'bg-slate-200 text-slate-600' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    disabled={isResolvingLocation}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    {isResolvingLocation ? 'Locating…' : 'My Location'}
                  </button>
                </div>

                {/* Mobile Location Suggestions */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg max-h-48 overflow-y-auto">
                    {locationSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        onClick={() => {
                          selectLocation(suggestion);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {suggestion.display_name.split(',')[0]}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {suggestion.display_name.split(',').slice(1).join(',').trim()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <a 
                  href="/" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 px-6 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 font-semibold text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">🏠</span>
                  Explore
                </a>
                <a 
                  href="/explore" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 px-6 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 font-semibold text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">🧠</span>
                  AI Search
                </a>
                <a 
                  href="/deals" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 px-6 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 font-semibold text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">🗺️</span>
                  All Deals
                </a>
                <a 
                  href="/favorites" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 px-6 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 font-semibold text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-6 h-6" />
                  Favorites
                </a>
                <a 
                  href="/account" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 px-6 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 font-semibold text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-6 h-6" />
                  My Account
                </a>
                <a 
                  href="/wallet" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 px-6 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 font-semibold text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl">💳</span>
                  Wallet
                </a>
                {/* Owner section hidden for now
                <a 
                  href="/owner" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 px-4 py-3 rounded-2xl hover:bg-slate-800 flex items-center gap-3 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏢 Owner
                </a>
                */}
              </div>

              {/* Mobile Login/Logout Button */}
              <button
                onClick={() => {
                  toggleLogin();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-4 px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${
                  isLoggedIn 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {isLoggedIn ? <LogOut className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full">{children}</main>

      {/* Merchant Section - Hidden for now
      <div className="bg-gradient-to-r from-slate-50/80 to-indigo-50/80 dark:from-slate-900/50 dark:to-indigo-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-8 text-slate-900 dark:text-white tracking-tight">Are you a Restaurant Owner?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
            Join Happy Hour and fill your quiet hours with amazing deals. Attract new customers and increase revenue during off-peak times.
          </p>
          <a href="/merchant" className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-6 rounded-full font-black hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg tracking-wide uppercase">
            <Building2 className="w-7 h-7" />
            Get Started as a Merchant
          </a>
        </div>
      </div>
      */}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 py-16 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          © 2025 Happy Hour - Making restaurant deals beautiful and profitable! 🍕✨
        </div>
      </footer>
    </div>
    </SessionProvider>
  );
}
