import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Happy Hour</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover amazing deals at restaurants near you. 
              Restaurants flip the switch when they're quiet. 
              You get instant deals nearby.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/happyhour" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/happyhour" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/happyhour" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/explore" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Find Deals
                </Link>
              </li>
              <li>
                <Link 
                  href="/merchant/signup" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  For Restaurants
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund-policy" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-400">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  456 Restaurant Row<br />
                  San Francisco, CA 94102
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">(415) 555-HAPPY</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@happyhour.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Happy Hour Inc. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a 
                href="/accessibility" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Accessibility
              </a>
              <a 
                href="/sitemap.xml" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sitemap
              </a>
              <a 
                href="/help" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
