'use client';

import React from 'react';
import { CheckCircle, Circle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  onComplete?: () => void;
}

export function OnboardingChecklist({ steps, onComplete }: OnboardingChecklistProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const requiredSteps = steps.filter(step => step.required).length;
  const completedRequired = steps.filter(step => step.required && step.completed).length;
  const progress = (completedSteps / steps.length) * 100;
  const canPublish = completedRequired === requiredSteps;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Getting Started Checklist</span>
          <span className="text-sm font-normal text-gray-500">
            {completedSteps}/{steps.length} completed
          </span>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-sm font-medium ${
                    step.completed ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {step.title}
                  </h4>
                  {step.required && !step.completed && (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                {step.actionUrl && !step.completed && (
                  <div className="mt-2">
                    <Link href={step.actionUrl as any}>
                      <Button size="sm" variant="outline">
                        {step.actionLabel || 'Complete'}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {canPublish && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-800">
                Ready to publish! You can now create and activate deals.
              </span>
            </div>
          </div>
        )}
        
        {!canPublish && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-orange-800">
                Complete all required steps to start publishing deals.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
