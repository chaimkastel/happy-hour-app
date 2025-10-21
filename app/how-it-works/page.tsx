'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Heart, 
  QrCode, 
  CheckCircle, 
  Star, 
  Users, 
  Clock,
  MapPin,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Discover Deals",
    description: "Browse happy hour and instant deals from restaurants near you",
    image: "https://images.unsplash.com/photo-1555396273-367a4b4c6837?w=400&h=300&fit=crop"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Claim Your Voucher",
    description: "Tap to claim your deal and get a unique voucher code with QR code",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
  },
  {
    icon: <QrCode className="w-8 h-8" />,
    title: "Show & Save",
    description: "Visit the restaurant and show your voucher to enjoy your discount",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
  }
];

const features = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Location-Based",
    description: "Find deals near you with our smart location services"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Real-Time",
    description: "Deals update in real-time so you never miss out"
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Great Savings",
    description: "Save up to 50% on food and drinks at top restaurants"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure",
    description: "Your vouchers are secure and can only be used once"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant",
    description: "Get your voucher instantly and use it right away"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Social",
    description: "Share deals with friends and discover new places together"
  }
];

const faqs = [
  {
    question: "How do I claim a deal?",
    answer: "Simply browse our deals, tap on one you like, and click 'Claim Deal'. You'll receive a unique voucher code and QR code that you can use at the restaurant."
  },
  {
    question: "Are there any fees?",
    answer: "No! OrderHappyHour is completely free for users. You only pay the discounted price at the restaurant."
  },
  {
    question: "How long are vouchers valid?",
    answer: "Voucher validity depends on the deal type. Happy hour deals are valid during specific time windows, while instant deals typically expire within 2-24 hours."
  },
  {
    question: "Can I use a voucher multiple times?",
    answer: "No, each voucher can only be used once. This ensures fair usage and prevents abuse of the system."
  },
  {
    question: "What if a restaurant doesn't honor my voucher?",
    answer: "Contact our support team immediately. We work closely with all partner restaurants to ensure they honor all valid vouchers."
  },
  {
    question: "How do I find deals near me?",
    answer: "Our app automatically shows deals based on your location. You can also search by city or browse by cuisine type."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl lg:text-6xl font-bold mb-6"
            >
              How It Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl lg:text-2xl text-orange-100 max-w-3xl mx-auto"
            >
              Discover amazing deals, claim vouchers, and save money at your favorite restaurants in just three simple steps.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              From discovery to savings, it's that easy
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center text-lg font-bold">
                    {index + 1}
            </div>
          </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6 text-lg">{step.description}</p>
                
                <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose OrderHappyHour?
            </h2>
            <p className="text-xl text-gray-600">
              We make saving money on great food simple and fun
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      {feature.icon}
            </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
            </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about using OrderHappyHour
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of users already saving money on great food
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                Browse Deals
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-xl">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}