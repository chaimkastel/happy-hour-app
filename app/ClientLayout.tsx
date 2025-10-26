'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Heart, Menu, X, LogIn, LogOut, User, MapPin, Crosshair, Search, CreditCard, Building2, Brain, Compass, Bell, ChevronDown } from 'lucide-react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import LocationSelector from '@/components/LocationSelector';
import SkipToMain from '@/components/SkipToMain';
import CookieConsent from '@/components/CookieConsent';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { AddressData } from '@/types/address';

interface ClientLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
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
    <div className={`min-h-screen transition-all duration-500 ${isHydrated && isDarkMode ? 'dark' : ''}`}>
      <SkipToMain />
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200" role="banner">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">🍺</span>
                </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Happy Hour</h1>
                <p className="text-xs text-gray-500">Find deals near you</p>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Downtown</span>
              </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              <Link href="/explore" className="nav-link" aria-label="Explore deals and restaurants">
                <Compass className="w-5 h-5 mr-2" aria-hidden="true" />
                  Explore
                </Link>
              <Link href="/favorites" className="nav-link" aria-label="View your favorite deals">
                <Heart className="w-5 h-5 mr-2" aria-hidden="true" />
                  Favorites
                </Link>
              <Link href="/account" className="nav-link" aria-label="Account settings and profile">
                <User className="w-5 h-5 mr-2" aria-hidden="true" />
                  Account
                </Link>
              <Link href="/wallet" className="nav-link" aria-label="View your wallet and redeemed deals">
                <CreditCard className="w-5 h-5 mr-2" aria-hidden="true" />
                  Wallet
                </Link>
            </nav>

            {/* Auth & Merchant Access */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <Building2 className="w-4 h-4 text-gray-500" />
                <Link href="/merchant" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">
                  For Restaurants
                </Link>
              </div>
              
              {status === 'authenticated' && session ? (
                <>
                  {/* Notifications disabled until feature is implemented */}
                  {/* <Link href="/account" className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Link> */}
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {(session.user as any)?.firstName || 'User'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserMenu(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          <Link
                            href="/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4 inline mr-2" />
                            My Account
                          </Link>
                          <Link
                            href="/favorites"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Heart className="w-4 h-4 inline mr-2" />
                            Favorites
                          </Link>
                          <Link
                            href="/wallet"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <CreditCard className="w-4 h-4 inline mr-2" />
                            Wallet
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              signOut({ callbackUrl: '/' });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 inline mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary">
                    Sign In
                  </Link>
                  <Link href="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-600" aria-hidden="true" /> : <Menu className="w-6 h-6 text-gray-600" aria-hidden="true" />}
              </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-200 bg-white" role="navigation" aria-label="Mobile navigation">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5 text-gray-600" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 space-y-4" role="navigation" aria-label="Mobile navigation links">
                {[
                  { path: '/explore', label: 'Explore', icon: Compass, ariaLabel: 'Explore deals and restaurants' },
                  { path: '/favorites', label: 'Favorites', icon: Heart, ariaLabel: 'View your favorite deals' },
                  { path: '/account', label: 'Account', icon: User, ariaLabel: 'Account settings and profile' },
                  { path: '/wallet', label: 'Wallet', icon: CreditCard, ariaLabel: 'View your wallet and redeemed deals' }
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link 
                      key={item.path}
                      href={item.path as any}
                  onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-left text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                      aria-label={item.ariaLabel}
                    >
                      <IconComponent className="w-5 h-5 mr-3" aria-hidden="true" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <Link
                    href="/merchant"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    For Restaurants
                  </Link>
                </div>
                
                {status === 'authenticated' && session ? (
                  <>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        {(session.user as any)?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full btn-secondary text-center py-2 px-4 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full btn-secondary text-center py-2 px-4"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full btn-primary text-center py-2 px-4"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="w-full" role="main" tabIndex={-1}>{children}</main>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white" role="contentinfo">
        <div className="container py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* For Customers */}
            <div className="footer-section">
              <h3 className="text-lg font-bold text-white mb-6">For Customers</h3>
              <div className="space-y-3">
                <Link href="/explore" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Explore Deals</Link>
                <Link href="/favorites" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Favorites</Link>
                <Link href="/account" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">My Account</Link>
                <Link href="/wallet" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Wallet</Link>
              </div>
            </div>

            {/* For Restaurants */}
            <div className="footer-section">
              <h3 className="text-lg font-bold text-white mb-6">For Restaurants</h3>
              <div className="space-y-3">
                <Link href="/merchant/signup" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400 font-medium">List Your Restaurant</Link>
                <Link href="/merchant" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Merchant Portal</Link>
                <Link href="/pricing" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Pricing</Link>
                <Link href="/contact" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Contact Sales</Link>
              </div>
            </div>

            {/* Company */}
            <div className="footer-section">
              <h3 className="text-lg font-bold text-white mb-6">Company</h3>
              <div className="space-y-3">
                <Link href="/about" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">About Us</Link>
                <Link href="/how-it-works" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">How It Works</Link>
                <Link href="/faq" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">FAQ</Link>
                <Link href="/contact" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Contact</Link>
              </div>
            </div>

            {/* Legal */}
            <div className="footer-section">
              <h3 className="text-lg font-bold text-white mb-6">Legal</h3>
              <div className="space-y-3">
                <Link href="/privacy" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Terms of Service</Link>
                <Link href="/cookies" className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400">Cookie Policy</Link>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gray-800 rounded-xl p-8 mb-12">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Stay in the Loop</h3>
              <p className="text-gray-300 mb-6">Get the latest deals and restaurant news delivered to your inbox</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  aria-label="Email address for newsletter"
                />
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Social Media & Contact */}
          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Mission Statement */}
              <div className="text-center lg:text-left">
                <p className="text-gray-300 text-sm max-w-md">
                  Helping restaurants thrive by filling seats during quiet hours. 
                  <br />
                  <span className="text-amber-400">support@orderhappyhour.com</span>
                </p>
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-200 focus:outline-none focus:text-amber-400"
                  aria-label="Follow us on Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Brand & Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🍺</span>
                </div>
                <span className="text-xl font-bold text-white">Happy Hour</span>
              </Link>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Happy Hour. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <CookieConsent />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}
