'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock, ArrowRight, Play, Heart, Share2, Filter, Building2, Edit3, Fire } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import OnboardingGuide from '@/components/onboarding/OnboardingGuide';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/navigation/BottomNav';

interface HomepageStats {
  totalUsers: number;
  totalMerchants: number;
  totalVenues: number;
  totalDeals: number;
  totalVouchers: number;
  totalRedemptions: number;
  activeDeals: number;
  estimatedSavings: number;
}

interface FeaturedDeal {
  id: string;
  title: string;
  description: string;
  restaurant: string;
    address: string;
  city: string;
  state: string;
  rating: number;
  originalPrice: number | null;
  discountPrice: number | null;
  percentOff: number | null;
  timeLeft: string;
  image: string;
  tags: string[];
  isNew: boolean;
  isTrending: boolean;
  vouchersIssued: number;
  favorites: number;
}

interface Category {
  name: string;
  icon: string;
  count: number;
  image: string;
}

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Food Blogger',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
    text: 'I\'ve saved over $200 this month using Happy Hour. The deals are incredible!',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Local Foodie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    text: 'Finally found a way to enjoy fine dining without breaking the bank.',
    rating: 5,
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Downtown LA');
  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [happeningNow, setHappeningNow] = useState<FeaturedDeal[]>([]);
  const [personalizedDeals, setPersonalizedDeals] = useState<FeaturedDeal[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, dealsRes, categoriesRes] = await Promise.all([
          fetch('/api/homepage/stats'),
          fetch('/api/homepage/featured-deals'),
          fetch('/api/homepage/categories'),
        ]);

        const statsData = await statsRes.json();
        const dealsData = await dealsRes.json();
        const categoriesData = await categoriesRes.json();

        setStats(statsData);
        setFeaturedDeals(dealsData.deals || []);
        setCategories(categoriesData.categories || []);
    } catch (error) {
        console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, []);

    useEffect(() => {
    // Show onboarding for new users
    const hasCompleted = localStorage.getItem('onboarding_completed');
    if (!hasCompleted) {
      // Delay showing onboarding to let the page load
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch personalized deals
  useEffect(() => {
    const fetchPersonalizedData = async () => {
      try {
        // Fetch happening now deals (ending soon)
        const happeningRes = await fetch('/api/deals/search?limit=6');
        const happeningData = await happeningRes.json();
        setHappeningNow(happeningData.deals?.slice(0, 6) || []);
        
        // For now, use featured deals as personalized
        // In production, this would use ML recommendations
        setPersonalizedDeals(featuredDeals.slice(0, 4));
      } catch (error) {
        console.error('Error fetching personalized data:', error);
      }
    };

    if (featuredDeals.length > 0) {
      fetchPersonalizedData();
    }
  }, [featuredDeals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&crop=center"
            alt="Restaurant scene"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
          </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-lg animate-pulse delay-500" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Discover
              <span className="block bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Amazing Deals
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Save up to 70% on premium restaurants. Experience fine dining at incredible prices during off-peak hours.
            </p>
          </motion.div>

          {/* Premium Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/20">
                <div className="flex items-center">
                  <Search className="w-6 h-6 text-gray-400 ml-4" />
                  <div className="w-full">
                    <Input
                type="text"
                placeholder="Search restaurants, cuisines, or deals..."
                value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 bg-transparent text-lg placeholder-gray-500 focus:ring-0 flex-1"
              />
            </div>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Search
                  </Button>
          </div>
            </div>
            </form>
          </motion.div>

          {/* Location */}
          <motion.div
            className="flex items-center justify-center text-white/80 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg font-medium">{location}</span>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
        <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '...' : stats && stats.totalUsers > 0 ? `${stats.totalUsers}+` : 'Join Us!'}
        </div>
              <div className="text-white/70">
                {loading ? 'Loading...' : stats && stats.totalUsers > 0 ? 'Happy Users' : 'Be the first'}
              </div>
      </div>
        <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '...' : stats && stats.estimatedSavings > 0 ? `$${Math.floor(stats.estimatedSavings / 1000)}K+` : 'Start Saving'}
        </div>
              <div className="text-white/70">
                {loading ? 'Loading...' : stats && stats.estimatedSavings > 0 ? 'Saved' : 'Your savings await'}
              </div>
      </div>
          <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '...' : stats && stats.totalVenues > 0 ? `${stats.totalVenues}+` : 'Coming Soon'}
              </div>
              <div className="text-white/70">
                {loading ? 'Loading...' : stats && stats.totalVenues > 0 ? 'Restaurants' : 'More venues joining'}
              </div>
              </div>
          </motion.div>
            </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
              </div>
            </div>
      </motion.section>

      {/* Happening Now Section */}
      {(happeningNow.length > 0 || personalizedDeals.length > 0) && (
        <motion.section
          className="py-12 px-4 bg-gradient-to-b from-white via-orange-50/30 to-white"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Fire className="w-8 h-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Happening Now</h2>
                  <p className="text-gray-600 text-sm">Deals ending soon near you</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push('/explore')}
                className="text-orange-600 hover:text-orange-700"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {happeningNow.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {happeningNow.slice(0, 6).map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
                          onClick={() => router.push(`/deal/${deal.id}/view`)}>
                      <div className="relative h-48">
                        <Image
                          src={deal.image}
                          alt={deal.title}
                          fill
                          className="object-cover"
                        />
                        {deal.isNew && (
                          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            NEW
                          </div>
                        )}
                        {deal.isTrending && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Fire className="w-3 h-3" />
                            TRENDING
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{deal.restaurant}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-700 font-medium">{deal.rating}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{deal.timeLeft}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/deal/${deal.id}/view`);
                            }}
                          >
                            View Deal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : personalizedDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                          onClick={() => router.push(`/deal/${deal.id}/view`)}>
                      <div className="relative h-48">
                        <Image
                          src={deal.image}
                          alt={deal.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{deal.restaurant}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.title}</p>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/deal/${deal.id}/view`);
                          }}
                        >
                          View Deal
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>
        </motion.section>
      )}

      {/* Categories Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Explore by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing deals across all your favorite cuisines and dining experiences
              </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-32 rounded-xl" />
              ))
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  className="group cursor-pointer"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/explore?category=${encodeURIComponent(category.name)}`)}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <div className="relative h-32">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <div className="text-white font-semibold text-sm">{category.name}</div>
                        <div className="text-white/80 text-xs">
                          {category.count > 0 ? `${category.count} deals` : 'Coming soon'}
                        </div>
              </div>
              </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">Categories coming soon!</div>
                <p className="text-gray-400 mb-6">We're working on bringing you amazing deals across all your favorite cuisines.</p>
                <Link href="/explore">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Browse All Deals
                  </Button>
                </Link>
              </div>
            )}
            </div>
              </div>
      </motion.section>

      {/* Featured Deals Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Deals</h2>
              <p className="text-xl text-gray-600">Handpicked premium restaurants with incredible savings</p>
            </div>
            <Link href="/explore">
              <Button className="hidden md:flex items-center space-x-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300">
                <span>View All</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
      </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-96 rounded-xl" />
              ))
            ) : featuredDeals.length > 0 ? (
              featuredDeals.map((deal, index) => (
                <motion.div
                key={deal.id} 
                  className="group cursor-pointer"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(`/deal/${deal.id}`)}
                >
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                    <div className="relative h-48">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        {deal.isNew && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            NEW
                    </span>
                        )}
                        {deal.isTrending && (
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            TRENDING
                          </span>
                        )}
                  </div>

                      {/* Action buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button size="sm" variant="ghost" className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
                    <Heart className="w-5 h-5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Time left */}
                  <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center space-x-2 text-white">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{deal.timeLeft} left</span>
                      </div>
                  </div>
                </div>

            <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                            {deal.title}
                          </h3>
                          <p className="text-gray-600 font-medium mb-2">{deal.restaurant}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {deal.city}, {deal.state}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                              {deal.rating} ({deal.favorites} favorites)
                      </span>
                    </div>
                    </div>
                        <div className="text-right">
                          {deal.discountPrice && deal.originalPrice && (
                            <>
                              <div className="text-2xl font-bold text-orange-500 mb-1">${deal.discountPrice}</div>
                              <div className="text-sm text-gray-400 line-through">${deal.originalPrice}</div>
                            </>
                          )}
                          {deal.percentOff && (
                            <div className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full mt-1">
                              {deal.percentOff}% OFF
                  </div>
                          )}
                </div>
              </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {deal.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              {tag}
                            </span>
            ))}
          </div>
                        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          Claim Deal
                        </Button>
          </div>
        </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">No featured deals available at the moment.</div>
                <Link href="/explore">
                  <Button className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Browse All Deals
                  </Button>
                </Link>
      </div>
            )}
            </div>
          </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-orange-500 to-pink-500"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div className="text-left">
                    <div className="text-white font-semibold text-lg">{testimonial.name}</div>
                    <div className="text-white/70">{testimonial.role}</div>
                    <div className="flex space-x-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                      ))}
            </div>
          </div>
                </div>
                <p className="text-white/90 text-lg leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
              ))}
            </div>
            </div>
      </motion.section>

      {/* Merchant Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                  <Building2 className="w-4 h-4 mr-2" />
                  For Restaurants
            </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Fill Empty Tables,
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Boost Revenue
                  </span>
            </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join thousands of restaurants using Happy Hour to fill empty tables during off-peak hours and increase revenue by up to 40%.
                </p>
              </motion.div>

              <motion.div
                className="space-y-6 mb-8"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {[
                  { icon: '📈', text: 'Increase revenue by 30-40% during off-peak hours' },
                  { icon: '👥', text: 'Reach thousands of new customers in your area' },
                  { icon: '💰', text: 'Set your own discount rates and control margins' },
                  { icon: '🔒', text: 'Secure payments with instant payouts' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                      {item.icon}
                </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                </div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href="/partner">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Building2 className="w-5 h-5 mr-2" />
                    Join as Merchant
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
            
            {/* Right Side - Visual */}
            <motion.div
              className="relative"
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&crop=center"
                  alt="Restaurant kitchen"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-2xl" />

                {/* Floating Stats Cards */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {loading ? '...' : stats && stats.totalRedemptions > 0 ? `+${Math.round((stats.totalRedemptions / Math.max(stats.totalDeals, 1)) * 100)}%` : 'Join Now'}
              </div>
                  <div className="text-sm text-gray-600">
                    {loading ? 'Loading...' : stats && stats.totalRedemptions > 0 ? 'Redemption Rate' : 'Be the first'}
                  </div>
      </div>

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {loading ? '...' : stats && stats.totalMerchants > 0 ? `${stats.totalMerchants}+` : 'Join Us'}
        </div>
                  <div className="text-sm text-gray-600">
                    {loading ? 'Loading...' : stats && stats.totalMerchants > 0 ? 'Active Merchants' : 'Restaurants welcome'}
                  </div>
            </div>
          </div>
            </motion.div>
                </div>
                </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to Start Saving?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of smart diners who save money every day while enjoying the finest restaurants in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                Get Started Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
            >
              <Play className="w-6 h-6 mr-2" />
              Get Started
            </Button>
            </div>
                </div>
      </motion.section>

      {/* Onboarding Guide */}
      <OnboardingGuide
        isVisible={showOnboarding}
        onDismiss={() => setShowOnboarding(false)}
      />
      
      <BottomNav />
    </div>
  );
}