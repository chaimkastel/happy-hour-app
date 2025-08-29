'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';

export default function MobileFAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  const handleBack = () => {
    window.history.back();
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does Happy Hour work?",
      answer: "Happy Hour connects you with restaurants offering real-time deals during their quiet hours. Simply browse deals near you, claim the ones you like, and show your code at the restaurant to get the discount."
    },
    {
      question: "Are the deals real and legitimate?",
      answer: "Yes! All deals are verified and legitimate. We work directly with restaurant partners to ensure every offer is authentic and honored. If you ever have an issue, our support team will help resolve it."
    },
    {
      question: "How much can I save?",
      answer: "Savings vary by restaurant and deal, but our users typically save 20-70% on their meals. Some deals offer even greater discounts during particularly quiet periods."
    },
    {
      question: "Do I need to make a reservation?",
      answer: "Most deals don't require reservations, but we recommend calling ahead during busy periods. Some restaurants may have limited availability for certain deals."
    },
    {
      question: "Can I use multiple deals at once?",
      answer: "Generally, one deal per visit per person. This ensures fair access for all customers and helps restaurants manage their inventory effectively."
    },
    {
      question: "What if a restaurant doesn't honor my deal?",
      answer: "Contact our support team immediately. We'll investigate and work with the restaurant to resolve the issue. If needed, we'll provide you with a full refund or alternative compensation."
    },
    {
      question: "How do I know if a deal is still available?",
      answer: "Our app shows real-time availability. Deals that are no longer available will be marked as 'Sold Out' or removed from the list. We update availability every few minutes."
    },
    {
      question: "Is there a membership fee?",
      answer: "No! Happy Hour is completely free for diners. We make money through partnerships with restaurants, not from charging our users."
    },
    {
      question: "Can I cancel a deal I've claimed?",
      answer: "Yes, you can cancel most deals up to 30 minutes before the restaurant's closing time. Some deals may have different cancellation policies, which will be clearly stated."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team through the app's help section, email us at support@happyhour.com, or call our hotline at 1-800-HAPPY-HR. We typically respond within 2 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">🍺</span>
              </div>
              <span className="text-white font-bold text-lg">FAQ</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/mobile/explore'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Explore
              </button>
              <button
                onClick={() => window.location.href = '/mobile/favorites'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Favorites
              </button>
              <button
                onClick={() => window.location.href = '/mobile/login'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/mobile/signup'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative px-6 py-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white/80">
            Everything you need to know about Happy Hour
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 pb-8">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300"
              >
                <span className="text-white font-semibold pr-4">{faq.question}</span>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Still Have Questions?</h2>
        <p className="text-white/80 text-center mb-8">
          Our support team is here to help you 24/7
        </p>
        
        <div className="space-y-4">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3">
            <MessageCircle className="w-5 h-5" />
            Chat with Support
          </button>
          
          <button className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white py-4 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-3">
            <Mail className="w-5 h-5" />
            Email Us
          </button>
          
          <button className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white py-4 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-3">
            <Phone className="w-5 h-5" />
            Call Support
          </button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-12 text-center">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-orange-100 mb-6">
            Join thousands of happy customers saving money on great food
          </p>
          <button
            onClick={handleGetStarted}
            className="w-full bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Get Started Free
          </button>
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