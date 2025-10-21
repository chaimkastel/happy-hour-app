'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface BillingStatusProps {
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIAL';
  currentPeriodEnd?: string;
  plan?: string;
  onOpenPortal?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export default function BillingStatus({
  subscriptionStatus,
  currentPeriodEnd,
  plan = 'Free',
  onOpenPortal,
  onRefresh,
  className = ''
}: BillingStatusProps) {
  const [loading, setLoading] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (currentPeriodEnd) {
      const endDate = new Date(currentPeriodEnd);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);
    }
  }, [currentPeriodEnd]);

  const getStatusConfig = () => {
    switch (subscriptionStatus) {
      case 'ACTIVE':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Active Subscription',
          description: 'Your subscription is active and up to date.',
          showDays: false,
        };
      case 'PAST_DUE':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Payment Past Due',
          description: 'Your payment is overdue. Please update your payment method.',
          showDays: true,
          urgent: true,
        };
      case 'CANCELED':
        return {
          icon: Clock,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Subscription Canceled',
          description: 'Your subscription has been canceled. Upgrade to continue.',
          showDays: false,
        };
      case 'TRIAL':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Free Trial',
          description: 'You\'re currently on a free trial.',
          showDays: true,
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Unknown Status',
          description: 'Subscription status is unknown.',
          showDays: false,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const handleOpenPortal = async () => {
    if (!onOpenPortal) return;
    
    setLoading(true);
    try {
      await onOpenPortal();
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setLoading(true);
    try {
      await onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className={cn('absolute top-0 left-0 right-0 h-1', statusConfig.bgColor)} />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', statusConfig.bgColor)}>
              <StatusIcon className={cn('w-5 h-5', statusConfig.color)} />
            </div>
            <div>
              <CardTitle className="text-lg">{statusConfig.title}</CardTitle>
              <p className="text-sm text-gray-600">{plan} Plan</p>
            </div>
          </div>
          
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{statusConfig.description}</p>

        {statusConfig.showDays && daysRemaining !== null && (
          <div className={cn(
            'p-3 rounded-lg border',
            statusConfig.bgColor,
            statusConfig.borderColor
          )}>
            <div className="flex items-center gap-2">
              <Calendar className={cn('w-4 h-4', statusConfig.color)} />
              <span className={cn('text-sm font-medium', statusConfig.color)}>
                {daysRemaining > 0 ? (
                  `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                ) : (
                  'Expired'
                )}
              </span>
            </div>
            {currentPeriodEnd && (
              <p className="text-xs text-gray-500 mt-1">
                Renews on {new Date(currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {subscriptionStatus === 'PAST_DUE' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Payment Required
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Update your payment method to avoid service interruption.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onOpenPortal && (
            <Button
              onClick={handleOpenPortal}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Manage Billing
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
          
          {subscriptionStatus === 'TRIAL' && (
            <Button
              variant="outline"
              onClick={handleOpenPortal}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Upgrade Plan
            </Button>
          )}
        </div>

        {subscriptionStatus === 'CANCELED' && (
          <div className="text-center pt-4">
            <Button
              onClick={handleOpenPortal}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Reactivate Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

