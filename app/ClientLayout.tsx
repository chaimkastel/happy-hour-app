'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, Heart, Menu, X, LogIn, LogOut, User, MapPin, Crosshair, Search, CreditCard, Building2, Brain, Compass } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import LocationSelector from '@/components/LocationSelector';
import { AddressData } from '@/types/address';

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

  const handleLocationChange = (addressData: AddressData) => {
    const label = addressData.formatted;
    dispatchLocation(addressData.coordinates.lat, addressData.coordinates.lng, label);
    setLocationQuery(label);
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
      {/* Ultra-Glassy Header */}
      <header className="bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/20 dark:border-slate-700/30 shadow-2xl" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Compact Logo */}
            <a href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105 border border-white/30 dark:border-slate-600/40">
                  <span className="text-slate-700 dark:text-slate-300 text-lg font-bold">🍺</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-all duration-300">
                    Happy Hour
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                    Find Deals
                  </span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              {/* Compact Location Control */}
              <div className="relative">
                <LocationSelector
                  value={locationQuery}
                  onChange={handleLocationChange}
                  onMyLocationClick={useMyLocation}
                  isResolvingLocation={isResolvingLocation}
                  placeholder="Search location..."
                />
              </div>

              {/* Sleek Navigation Links */}
              <div className="flex items-center gap-1">
                <a href="/explore" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-800/30 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 group backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-slate-600/30">
                  <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  Explore
                </a>
                <a href="/favorites" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-800/30 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 group backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-slate-600/30">
                  <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Favorites
                </a>
                <a href="/account" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-800/30 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 group backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-slate-600/30">
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Account
                </a>
                <a href="/wallet" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-800/30 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 group backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-slate-600/30">
                  <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Wallet
                </a>
                <a href="/partner" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-800/30 px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-2 group backdrop-blur-sm border border-transparent hover:border-white/20 dark:hover:border-slate-600/30">
                  <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  Partner
                </a>
              </div>

              {/* Modern Action Buttons */}
              <div className="flex items-center gap-3">
                {!isLoggedIn ? (
                  <div className="relative group">
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm bg-white/20 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/60 shadow-2xl hover:shadow-3xl hover:scale-105 backdrop-blur-sm border border-white/30 dark:border-slate-600/40"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </button>
                    
                    {/* Login Dropdown */}
                    <div className="absolute right-0 top-full mt-3 w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-2">
                        <a
                          href="/login"
                          className="flex items-center gap-3 px-5 py-4 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-200 rounded-xl mx-2"
                        >
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Customer Login</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Find great deals</div>
                          </div>
                        </a>
                        <a
                          href="/merchant/login"
                          className="flex items-center gap-3 px-5 py-4 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/30 transition-all duration-200 rounded-xl mx-2"
                        >
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Merchant Login</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Manage your business</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={toggleLogin}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}

                <button
                  onClick={toggleDarkMode}
                  className="p-3 rounded-xl transition-all duration-300 bg-white/20 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-800/60 hover:scale-105 shadow-2xl hover:shadow-3xl backdrop-blur-sm border border-white/30 dark:border-slate-600/40"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </nav>

            {/* Sleek Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-all duration-200 bg-white/10 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/40 hover:scale-105 backdrop-blur-sm border border-white/10 dark:border-slate-700/20"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isMobileMenuOpen 
                    ? 'bg-white/20 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300' 
                    : 'bg-white/10 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/40'
                } backdrop-blur-sm border border-white/10 dark:border-slate-700/20`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sleek Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 dark:border-slate-700/20">
            <nav className="px-4 py-4 space-y-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
              {/* Compact Mobile Location Control */}
              <div className="space-y-2">
                <LocationSelector
                  value={locationQuery}
                  onChange={handleLocationChange}
                  onMyLocationClick={useMyLocation}
                  isResolvingLocation={isResolvingLocation}
                  placeholder="Search location..."
                  className="text-sm"
                />
              </div>

              {/* Sleek Mobile Navigation Links */}
              <div className="space-y-1">
                <a 
                  href="/explore" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/20 flex items-center gap-3 font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Compass className="w-4 h-4" />
                  Explore
                </a>
                <a 
                  href="/favorites" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/20 flex items-center gap-3 font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  Favorites
                </a>
                <a 
                  href="/account" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/20 flex items-center gap-3 font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Account
                </a>
                <a 
                  href="/wallet" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/20 flex items-center gap-3 font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCard className="w-4 h-4" />
                  Wallet
                </a>
                <a 
                  href="/partner" 
                  className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/20 flex items-center gap-3 font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Building2 className="w-4 h-4" />
                  Partner
                </a>
              </div>

              {/* Mobile Login/Logout Button */}
              <div className="pt-2 border-t border-white/10 dark:border-slate-700/20">
                <button
                  onClick={() => {
                    toggleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isLoggedIn 
                      ? 'bg-white/20 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/60' 
                      : 'bg-white/10 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/40'
                  } backdrop-blur-sm border border-white/10 dark:border-slate-700/20`}
                >
                  {isLoggedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  {isLoggedIn ? 'Logout' : 'Login'}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full" role="main">{children}</main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-8 border-t border-white/10 dark:border-slate-700/20" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          © 2025 Happy Hour - Find amazing deals near you
        </div>
      </footer>
    </div>
    </SessionProvider>
  );
}
