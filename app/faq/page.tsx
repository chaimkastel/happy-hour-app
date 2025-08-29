'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone, Menu, X } from 'lucide-react';

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  const handleBack = () => {
    window.history.back();
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does Happy Hour work?",
      answer: "Happy Hour connects you with restaurants offering real-time deals when they're quiet. Simply browse deals near you, claim one you like, and show your code at the restaurant to get the discount."
    },
    {
      question: "Are the deals real and legitimate?",
      answer: "Yes! All deals are verified and come directly from participating restaurants. We work with local establishments to offer genuine discounts during their off-peak hours."
    },
    {
      question: "How much can I save?",
      answer: "Deals typically range from 20% to 70% off regular prices. The exact savings depend on the restaurant and the specific offer, but you can always see the discount percentage before claiming."
    },
    {
      question: "Do I need to make a reservation?",
      answer: "Most deals don't require reservations, but we recommend calling the restaurant ahead of time to confirm availability, especially for popular deals or during busy periods."
    },
    {
      question: "Can I use multiple deals at once?",
      answer: "Generally, no. Most deals are one per person per visit and cannot be combined with other offers. Check the specific terms for each deal before claiming."
    },
    {
      question: "What if the restaurant is out of the deal item?",
      answer: "If a restaurant runs out of a specific deal item, they may offer a similar alternative or you can choose to visit another time. Contact the restaurant directly if you have concerns."
    },
    {
      question: "Is there a fee to use Happy Hour?",
      answer: "Happy Hour is free to use! We make money through small commissions from restaurants when you redeem deals, so there's no cost to you as a customer."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team through the Contact Us page, email us at support@happyhour.com, or call 1-800-HAPPY-HR. We typically respond within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg md:text-xl">🍺</span>
              </div>
              <span className="text-white font-bold text-lg md:text-xl">FAQ</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => window.location.href = '/explore'}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                Explore
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/signup'}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                {showMenu ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Menu className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uber Eats-inspired Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-16 md:top-20 left-3 right-3 md:left-4 md:right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Top Section - Sign Up & Log In */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => window.location.href = '/signup'}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Sign up
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-white text-black border border-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Log in
              </button>
            </div>

            {/* Middle Section - Menu Links */}
            <div className="space-y-1 mb-6">
              <button
                onClick={() => {
                  window.location.href = '/favorites';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                Favorites
              </button>
              <button
                onClick={() => {
                  window.location.href = '/deals';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                All Deals
              </button>
              <button
                onClick={() => {
                  window.location.href = '/about';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  window.location.href = '/how-it-works';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  window.location.href = '/contact';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                Contact Us
              </button>
            </div>

            {/* Bottom Section - App Promotion */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">🍺</span>
                </div>
                <span className="text-gray-700 font-medium">There's more to love in the app.</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  iPhone
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  Android
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative px-6 py-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white/80">
            Find answers to common questions about Happy Hour
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-white/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Still Have Questions?</h2>
          <p className="text-white/80 mb-8">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold">Live Chat</h3>
              <p className="text-white/70 text-sm text-center">Get instant help from our support team</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-300">
                Start Chat
              </button>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold">Email Support</h3>
              <p className="text-white/70 text-sm text-center">Send us a message and we'll get back to you</p>
              <button 
                onClick={() => window.location.href = '/contact'}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all duration-300"
              >
                Send Email
              </button>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold">Phone Support</h3>
              <p className="text-white/70 text-sm text-center">Call us for immediate assistance</p>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-all duration-300">
                1-800-HAPPY-HR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">🍺</span>
          </div>
          <span className="text-white font-bold text-lg">Happy Hour</span>
        </div>
        <p className="text-gray-400 text-sm">
          © 2025 Happy Hour. Find amazing deals near you.
        </p>
      </div>
    </div>
  );
}
