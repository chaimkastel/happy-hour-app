'use client';

import { useState } from 'react';
import { Building2, Users, TrendingUp, DollarSign, Clock, CheckCircle, ArrowRight, Star, Shield, Zap, Target, Award, Globe, Smartphone, CreditCard, Timer, Sparkles, Crown, Diamond, Brain, Lightbulb, Sparkle, Wand2, MapPin, Heart, Search, Filter, Grid, List } from 'lucide-react';

export default function PartnerPage() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      restaurantName: formData.get('restaurantName'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      cuisine: formData.get('cuisine'),
      description: formData.get('description')
    };

    try {
      const response = await fetch('/api/partner/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }
      
      console.log('Partner application submitted:', result);
    } catch (error) {
      console.error('Error submitting partner application:', error);
      setIsFormSubmitted(false);
      alert('Failed to submit application. Please try again.');
    }
  };

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increase Revenue",
      description: "Fill your quiet hours with customers and boost your bottom line during off-peak times."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Attract New Customers",
      description: "Reach thousands of local food lovers who are actively looking for great deals."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Flexible Pricing",
      description: "Set your own discount rates and time windows. You control your margins."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Control",
      description: "Activate and deactivate deals instantly based on your current capacity."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Get paid quickly and securely with our integrated payment system."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "Track performance with detailed insights and customer behavior data."
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Activation",
      description: "Turn deals on/off in real-time"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Targeted Marketing",
      description: "Reach customers in your area"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Quality Control",
      description: "All deals are reviewed for quality"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Wide Reach",
      description: "Access to thousands of users"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-5 h-5" />
              <span className="font-semibold text-sm">For Restaurant Partners</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Happy Hour</span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Fill your quiet hours with customers and boost your revenue during off-peak times. 
              Join thousands of restaurants already growing with Happy Hour.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                View Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10,000+</div>
                <div className="text-sm">Active Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$2M+</div>
                <div className="text-sm">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-sm">Partner Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Partner with Happy Hour?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join the platform that's helping restaurants thrive during their quiet hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
                <div className="text-indigo-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools and features designed specifically for restaurant partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Get started in minutes and start seeing results immediately
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Sign Up & Set Up
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Create your restaurant profile and set your preferences for deals and timing.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Create Deals
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Set your discount rates, time windows, and special offers for customers.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Start Earning
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Watch customers discover your deals and fill your quiet hours with revenue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Form Section */}
      <div id="signup-form" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join thousands of restaurants already growing with Happy Hour
            </p>
          </div>

          {!isFormSubmitted ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Your restaurant name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Restaurant Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Cuisine Type *
                  </label>
                  <select
                    name="cuisine"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Select cuisine type</option>
                    <option value="american">American</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="chinese">Chinese</option>
                    <option value="japanese">Japanese</option>
                    <option value="indian">Indian</option>
                    <option value="thai">Thai</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="french">French</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Tell us about your restaurant
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="What makes your restaurant special? What kind of deals would you like to offer?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Submit Application
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full text-green-600 mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Application Submitted!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Thank you for your interest in partnering with Happy Hour. We'll review your application and get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsFormSubmitted(false)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Questions? We're Here to Help
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our partner success team is ready to help you get started and maximize your results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl">
              Contact Support
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
