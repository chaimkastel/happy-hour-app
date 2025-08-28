'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Star, 
  Clock, 
  Tag, 
  Heart, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  CreditCard,
  History,
  Award,
  Target,
  Users,
  Gift,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { getSampleDeals, getSampleStats, getSampleNotifications, getSampleReviews } from '@/utils/sampleData';
import { Deal, UserStats } from '@/types';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [deals] = useState(getSampleDeals());
  const [stats] = useState(getSampleStats());
  const [notifications] = useState(getSampleNotifications());
  const [reviews] = useState(getSampleReviews());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Get user location only on client side
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Brooklyn if location access denied
          setUserLocation({ lat: 40.6782, lng: -73.9442 });
        }
      );
    } else {
      setUserLocation({ lat: 40.6782, lng: -73.9442 });
    }
  }, []);

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getTimeRemaining = (endTime: string): { hours: number; minutes: number } => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return { hours: 0, minutes: 0 };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const nearbyDeals = (isClient && userLocation) 
    ? deals
        .map(deal => ({
          ...deal,
          distance: getDistance(userLocation.lat, userLocation.lng, deal.venue.latitude, deal.venue.longitude)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
    : [];

  const startingSoonDeals = isClient ? deals
    .filter(deal => {
      const timeRemaining = getTimeRemaining(deal.endAt);
      return timeRemaining.hours <= 2 && timeRemaining.hours >= 0;
    })
    .sort((a, b) => getTimeRemaining(a.endAt).hours - getTimeRemaining(b.endAt).hours)
    .slice(0, 3) : [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'deals', label: 'My Deals', icon: Tag },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            My Account
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Welcome back! Here's your personalized experience
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.users.totalRedemptions}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Deals Claimed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">${stats.users.totalSavings}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Total Saved</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.users.streakDays}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Day Streak</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.users.points}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Streak & Rewards */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Current Streak</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-primary-600 dark:text-primary-400 mb-2">
                      {stats.users.streakDays}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-secondary-600 dark:text-secondary-400 mb-2">
                      {stats.users.points}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-accent-600 dark:text-accent-400 mb-2">
                      {stats.users.badges.length}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">Badges</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {stats.users.badges.map((badge, index) => (
                    <div key={index} className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-semibold">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Deals */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-green-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Nearby Deals</h2>
                </div>
                
                <div className="space-y-4">
                  {nearbyDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {deal.percentOff}%
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{deal.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{deal.venue.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {deal.distance.toFixed(1)} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {deal.venue.rating}
                          </span>
                        </div>
                      </div>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                        Claim
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starting Soon Alerts */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Starting Soon</h2>
                </div>
                
                <div className="space-y-4">
                  {startingSoonDeals.map((deal) => {
                    const timeRemaining = getTimeRemaining(deal.endAt);
                    return (
                      <div key={deal.id} className="flex items-center gap-4 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-xl border border-warning-200 dark:border-warning-800">
                        <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {deal.percentOff}%
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{deal.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{deal.venue.name}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-warning-600 dark:text-warning-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeRemaining.hours}h {timeRemaining.minutes}m left
                            </span>
                          </div>
                        </div>
                        <button className="bg-warning-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-warning-700 transition-colors">
                          Claim Now
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">My Claimed Deals</h2>
              <div className="space-y-4">
                {deals.slice(0, 3).map((deal) => (
                  <div key={deal.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{deal.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{deal.venue.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {deal.percentOff}% off
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Claimed today
                        </span>
                      </div>
                    </div>
                    <button className="bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition-colors">
                      View QR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Rewards & Badges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Current Points</h3>
                  <div className="text-4xl font-black mb-4">{stats.users.points}</div>
                  <p className="text-primary-100">Keep claiming deals to earn more points!</p>
                </div>
                <div className="bg-gradient-to-br from-secondary-500 to-green-500 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Streak Bonus</h3>
                  <div className="text-4xl font-black mb-4">{stats.users.streakDays} days</div>
                  <p className="text-secondary-100">You're on fire! 🔥</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Notifications</h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-4 rounded-xl border-l-4 ${
                    notification.isRead 
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600' 
                      : 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300">{notification.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                          {!notification.isRead && (
                            <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs">New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Account Settings</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-white">Profile Information</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-white">Notification Preferences</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-white">Location Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-white">Payment Methods</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
