'use client';

import { useState } from 'react';
import { User, Mail, MapPin, Bell, Settings, LogOut, Edit3 } from 'lucide-react';
import MobileShell from '@/components/mobile/MobileShell';

export default function MobileAccountPage() {
  const [notifications, setNotifications] = useState({
    deals: true,
    favorites: true,
    location: false
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSignOut = () => {
    // Handle sign out logic
    alert('Sign out functionality would be implemented here');
  };

  return (
    <MobileShell
      headerProps={{
        title: 'Account'
      }}
    >
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
              <p className="text-gray-600">john.doe@example.com</p>
            </div>
            <button
              type="button"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit3 size={20} />
            </button>
          </div>
          <button
            type="button"
            className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Location Preferences */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Current Location</div>
                <div className="text-sm text-gray-600">Brooklyn, New York</div>
              </div>
              <button
                type="button"
                className="text-blue-500 font-medium"
              >
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Auto-detect location</div>
                <div className="text-sm text-gray-600">Use GPS to find nearby deals</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.location}
                  onChange={() => handleNotificationToggle('location')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Deal alerts</div>
                <div className="text-sm text-gray-600">Get notified about new deals</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.deals}
                  onChange={() => handleNotificationToggle('deals')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Favorite updates</div>
                <div className="text-sm text-gray-600">Updates on your saved deals</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.favorites}
                  onChange={() => handleNotificationToggle('favorites')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-gray-200">
          <button
            type="button"
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
            <span className="font-medium text-gray-900">Settings</span>
          </button>
          <div className="border-t border-gray-200">
            <button
              type="button"
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Mail size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">Contact Support</span>
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full p-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-3"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </MobileShell>
  );
}