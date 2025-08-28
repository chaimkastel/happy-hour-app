'use client';

import { useState, useEffect } from 'react';
import { Save, Clock, Bell, CreditCard, Building2, AlertCircle, CheckCircle } from 'lucide-react';

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

interface QuietWindow {
  startTime: string;
  endTime: string;
  days: string[];
  reason: string;
}

interface DefaultRules {
  maxDealDuration: number;
  minDealPercentOff: number;
  maxDealPercentOff: number;
  requireMinSpend: boolean;
  defaultMinSpend: number;
  autoPauseExpired: boolean;
  allowDineInOnly: boolean;
  allowTakeaway: boolean;
}

interface Notifications {
  email: boolean;
  sms: boolean;
  dealExpiryReminder: boolean;
  lowInventoryAlert: boolean;
  weeklyReport: boolean;
}

interface PayoutSettings {
  autoPayout: boolean;
  payoutThreshold: number;
  payoutSchedule: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  payoutDay: number;
}

interface MerchantSettings {
  businessHours: BusinessHours;
  quietWindows: QuietWindow[];
  defaultRules: DefaultRules;
  notifications: Notifications;
  payoutSettings: PayoutSettings;
}

export default function MerchantSettingsPage() {
  const [settings, setSettings] = useState<MerchantSettings>({
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    },
    quietWindows: [
      { startTime: '14:00', endTime: '16:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], reason: 'Afternoon lull period' }
    ],
    defaultRules: {
      maxDealDuration: 30,
      minDealPercentOff: 10,
      maxDealPercentOff: 50,
      requireMinSpend: true,
      defaultMinSpend: 15.0,
      autoPauseExpired: true,
      allowDineInOnly: true,
      allowTakeaway: true
    },
    notifications: {
      email: true,
      sms: false,
      dealExpiryReminder: true,
      lowInventoryAlert: true,
      weeklyReport: true
    },
    payoutSettings: {
      autoPayout: true,
      payoutThreshold: 100.0,
      payoutSchedule: 'WEEKLY',
      payoutDay: 1
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'deals' | 'notifications' | 'payouts'>('business');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/merchant/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          // Parse JSON fields
          const parsedSettings = {
            businessHours: parseJsonField(data.settings.businessHours),
            quietWindows: parseJsonField(data.settings.quietWindows),
            defaultRules: parseJsonField(data.settings.defaultRules),
            notifications: parseJsonField(data.settings.notifications),
            payoutSettings: parseJsonField(data.settings.payoutSettings)
          };
          setSettings(parsedSettings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseJsonField = (field: string | null): any => {
    if (!field) return field;
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/merchant/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHours = (day: string, field: keyof BusinessHours[string], value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const updateDefaultRules = (field: keyof DefaultRules, value: any) => {
    setSettings(prev => ({
      ...prev,
      defaultRules: {
        ...prev.defaultRules,
        [field]: value
      }
    }));
  };

  const updateNotifications = (field: keyof Notifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const updatePayoutSettings = (field: keyof PayoutSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      payoutSettings: {
        ...prev.payoutSettings,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
              <p className="text-gray-600 mt-1">Configure your business preferences and automation rules</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'business', label: 'Business Hours', icon: Clock },
              { id: 'deals', label: 'Deal Rules', icon: Building2 },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'payouts', label: 'Payouts', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-4">
                {Object.entries(settings.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Open</span>
                    </label>
                    {!hours.closed && (
                      <>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quiet Windows</h3>
              <p className="text-sm text-gray-600 mb-4">
                Define time periods when you typically have fewer customers - perfect for offering deals to fill quiet hours.
              </p>
              <div className="space-y-4">
                {settings.quietWindows.map((window, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                          type="time"
                          value={window.startTime}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                          type="time"
                          value={window.endTime}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Days</label>
                        <select
                          multiple
                          value={window.days}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                            <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Default Deal Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Deal Duration (days)</label>
                  <input
                    type="number"
                    value={settings.defaultRules.maxDealDuration}
                    onChange={(e) => updateDefaultRules('maxDealDuration', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min % Off</label>
                  <input
                    type="number"
                    value={settings.defaultRules.minDealPercentOff}
                    onChange={(e) => updateDefaultRules('minDealPercentOff', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max % Off</label>
                  <input
                    type="number"
                    value={settings.defaultRules.maxDealPercentOff}
                    onChange={(e) => updateDefaultRules('maxDealPercentOff', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Min Spend</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.defaultRules.defaultMinSpend}
                    onChange={(e) => updateDefaultRules('defaultMinSpend', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.defaultRules.requireMinSpend}
                    onChange={(e) => updateDefaultRules('requireMinSpend', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require minimum spend by default</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.defaultRules.autoPauseExpired}
                    onChange={(e) => updateDefaultRules('autoPauseExpired', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Automatically pause expired deals</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.defaultRules.allowDineInOnly}
                    onChange={(e) => updateDefaultRules('allowDineInOnly', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow dine-in only deals</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.defaultRules.allowTakeaway}
                    onChange={(e) => updateDefaultRules('allowTakeaway', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow takeaway deals</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => updateNotifications('email', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => updateNotifications('sms', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.dealExpiryReminder}
                    onChange={(e) => updateNotifications('dealExpiryReminder', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Deal expiry reminders</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowInventoryAlert}
                    onChange={(e) => updateNotifications('lowInventoryAlert', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Low inventory alerts</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyReport}
                    onChange={(e) => updateNotifications('weeklyReport', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Weekly performance reports</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payout Configuration</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.payoutSettings.autoPayout}
                    onChange={(e) => updatePayoutSettings('autoPayout', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable automatic payouts</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payout Threshold ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.payoutSettings.payoutThreshold}
                    onChange={(e) => updatePayoutSettings('payoutThreshold', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payout Schedule</label>
                  <select
                    value={settings.payoutSettings.payoutSchedule}
                    onChange={(e) => updatePayoutSettings('payoutSchedule', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                
                {settings.payoutSettings.payoutSchedule === 'WEEKLY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payout Day (1-7, Monday=1)</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={settings.payoutSettings.payoutDay}
                      onChange={(e) => updatePayoutSettings('payoutDay', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}
                
                {settings.payoutSettings.payoutSchedule === 'MONTHLY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payout Day (1-31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={settings.payoutSettings.payoutDay}
                      onChange={(e) => updatePayoutSettings('payoutDay', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
