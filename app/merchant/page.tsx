'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  Plus,
  BarChart3,
  Settings,
  Bell,
  Eye,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

// Mock data
const restaurantData = {
  name: 'Mario\'s Pizzeria',
  status: 'active',
  totalRevenue: 15420.50,
  totalOrders: 342,
  averageRating: 4.8,
  totalReviews: 124,
  activeDeals: 3,
  pendingDeals: 1,
};

const recentOrders = [
  {
    id: '1',
    customer: 'John Doe',
    items: '2x Margherita Pizza',
    total: 24.99,
    discount: 12.49,
    time: '2 min ago',
    status: 'completed',
  },
  {
    id: '2',
    customer: 'Jane Smith',
    items: '1x Pepperoni Pizza + Drinks',
    total: 18.99,
    discount: 5.99,
    time: '15 min ago',
    status: 'preparing',
  },
  {
    id: '3',
    customer: 'Mike Johnson',
    items: '3x Calzone',
    total: 32.97,
    discount: 16.48,
    time: '1 hour ago',
    status: 'completed',
  },
];

const activeDeals = [
  {
    id: '1',
    title: '50% Off All Pizzas',
    discount: 50,
    orders: 23,
    revenue: 287.50,
    timeLeft: '2h 15m',
    status: 'active',
  },
  {
    id: '2',
    title: 'Buy 1 Get 1 Free Appetizers',
    discount: 50,
    orders: 12,
    revenue: 156.00,
    timeLeft: '4h 30m',
    status: 'active',
  },
  {
    id: '3',
    title: '30% Off Drinks',
    discount: 30,
    orders: 8,
    revenue: 89.60,
    timeLeft: '6h 45m',
    status: 'active',
  },
];

export default function MerchantDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success-600 bg-success-100';
      case 'preparing':
        return 'text-warning-600 bg-warning-100';
      case 'completed':
        return 'text-neutral-600 bg-neutral-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
            <p className="text-primary-100">{restaurantData.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Bell className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {formatCurrency(restaurantData.totalRevenue)}
              </div>
              <div className="text-primary-100 text-sm">Total Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {restaurantData.totalOrders}
              </div>
              <div className="text-primary-100 text-sm">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {restaurantData.averageRating}
              </div>
              <div className="text-primary-100 text-sm">Avg Rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold mb-1">
                {restaurantData.activeDeals}
              </div>
              <div className="text-primary-100 text-sm">Active Deals</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-4">
        <Card>
          <div className="flex border-b border-neutral-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'deals', label: 'Deals' },
              { id: 'orders', label: 'Orders' },
              { id: 'analytics', label: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap',
                  selectedTab === tab.id
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Plus className="w-6 h-6" />
                    <span>Create Deal</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border-b border-neutral-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900">
                            {order.customer}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {order.items}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {order.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-neutral-900">
                          {formatCurrency(order.total)}
                        </div>
                        <div className="text-sm text-success-600">
                          Saved {formatCurrency(order.discount)}
                        </div>
                        <div className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          getStatusColor(order.status)
                        )}>
                          {order.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Deals Tab */}
        {selectedTab === 'deals' && (
          <motion.div
            key="deals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Deals</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Deal
              </Button>
            </div>

            {activeDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 mb-1">
                          {deal.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <span className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {deal.orders} orders
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatCurrency(deal.revenue)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {deal.timeLeft} left
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-500 mb-1">
                          {deal.discount}% off
                        </div>
                        <div className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full">
                          {deal.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Orders Tab */}
        {selectedTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Order Management</h2>
            <p className="text-neutral-600">Manage and track your restaurant orders</p>
            {/* Orders content would go here */}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Analytics & Insights</h2>
            <p className="text-neutral-600">Track your restaurant's performance and growth</p>
            {/* Analytics content would go here */}
          </motion.div>
        )}
      </div>
    </div>
  );
}