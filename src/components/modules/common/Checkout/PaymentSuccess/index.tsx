'use client';

import MyButton from '@/components/ui/MyButton/MyButton';
import { Check, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="min-h-[calc(100vh-40px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-slate-100/80 rounded-lg p-8 text-center shadow-sm">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Subscription Confirmed!
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-8">
            Thank you for subscribing to Prodexter Premium plan
          </p>

          {/* Billing Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Billing</span>
                <span className="text-gray-900">Monthly</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Amount</span>
                <span className="text-gray-900">$15.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  Next Billing Date
                </span>
                <span className="text-gray-900">20/02/2028</span>
              </div>
            </div>
          </div>

          {/* Information Text */}
          <div className="space-y-2 mb-8 text-sm text-gray-600">
            <p>A receipt has been sent to your email address.</p>
            <p>
              Your subscription is now active and you can start using Prodexter
              right away.
            </p>
          </div>

          {/* Continue Button */}

          <div className="flex items-center justify-center mb-3">
            <MyButton label="Continue to Prodexter" isArrow />
          </div>

          {/* Support Link */}
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
