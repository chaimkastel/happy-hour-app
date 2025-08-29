'use client';

import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import MobileShell from '@/components/mobile/MobileShell';
import { useState } from 'react';

export default function MobileFAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  const handleBack = () => {
    window.history.back();
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  const faqs = [
    {
      question: "Is Happy Hour really free?",
      answer: "Yes! Happy Hour is completely free for customers. No subscription fees, no hidden costs, no credit card required. We make money from restaurants, not from you."
    },
    {
      question: "How do I redeem a deal?",
      answer: "Simply show your phone with the deal at the restaurant. The staff will verify the deal and apply the discount to your bill. It's that easy!"
    },
    {
      question: "Can I use multiple deals at once?",
      answer: "Each deal has its own terms and conditions. Some deals can be combined, others cannot. Check the deal details for specific information about combining offers."
    },
    {
      question: "What if a deal is no longer available?",
      answer: "Deals are updated in real-time. If a deal is no longer available when you arrive, we'll show you similar alternatives nearby. We always try to help you find great food at great prices."
    },
    {
      question: "Do I need to make a reservation?",
      answer: "It depends on the restaurant and the deal. Some deals require reservations, others are walk-in only. Check the deal details for specific requirements."
    },
    {
      question: "Can I cancel or modify a deal?",
      answer: "Most deals can be cancelled up to a certain time before your reservation. Check the deal terms for specific cancellation policies. We recommend reading the fine print before booking."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. We take your privacy seriously. We only collect the information necessary to provide our service and never share your personal data with third parties without your consent."
    },
    {
      question: "How do restaurants benefit from Happy Hour?",
      answer: "Restaurants use Happy Hour to fill empty tables during slow periods, attract new customers, and increase revenue. It's a win-win for both restaurants and customers."
    },
    {
      question: "Can I suggest a restaurant to join Happy Hour?",
      answer: "Yes! We love hearing from our community. You can suggest restaurants through our contact form or by emailing us. We're always looking to expand our network of partner restaurants."
    },
    {
      question: "What if I have a problem with a deal?",
      answer: "We're here to help! Contact our customer support team through the app or email us directly. We'll work with you and the restaurant to resolve any issues quickly."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <MobileShell
      forceMobile={true}
      headerProps={{
        showSearch: false,
        showLocation: false,
        title: 'FAQ',
        rightElement: (
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <div className="relative px-6 py-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/80">
              Everything you need to know about Happy Hour
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 py-8 bg-white">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="px-6 py-12 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600">
              Our support team is here to help
            </p>
          </div>

          <div className="space-y-4">
            <button className="w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Get instant help from our support team</p>
              </div>
            </button>

            <button className="w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-600">support@happyhour.com</p>
              </div>
            </button>

            <button className="w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
                <p className="text-sm text-gray-600">1-800-HAPPY-HOUR</p>
              </div>
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-12 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 mb-6">
              Join thousands of people who are already saving money on great food
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300"
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
    </MobileShell>
  );
}
