'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle, Send, Clock, Users } from 'lucide-react';

export default function MobileContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setLoading(false);
  };

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
              <span className="text-white font-bold text-lg">Contact Us</span>
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
            <MessageCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/80">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="px-6 pb-8">
        {submitted ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-green-200 mb-4">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-300"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:border-white/40 focus:outline-none transition-all duration-300"
                required
              >
                <option value="" className="bg-slate-800">Select a subject</option>
                <option value="general" className="bg-slate-800">General Inquiry</option>
                <option value="support" className="bg-slate-800">Technical Support</option>
                <option value="business" className="bg-slate-800">Business Partnership</option>
                <option value="feedback" className="bg-slate-800">Feedback</option>
                <option value="other" className="bg-slate-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={5}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-all duration-300 resize-none"
                placeholder="Tell us how we can help you..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Contact Information */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Other Ways to Reach Us</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Email</h3>
              <p className="text-white/80">support@happyhour.com</p>
              <p className="text-white/60 text-sm">We respond within 24 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Phone</h3>
              <p className="text-white/80">1-800-HAPPY-HR</p>
              <p className="text-white/60 text-sm">Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Office</h3>
              <p className="text-white/80">123 Food Street</p>
              <p className="text-white/80">New York, NY 10001</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="px-6 py-8 text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Need Quick Answers?
          </h3>
          <p className="text-white/80 mb-6">
            Check out our FAQ section for instant answers to common questions.
          </p>
          <button
            onClick={() => window.location.href = '/mobile/faq'}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300"
          >
            View FAQ
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
