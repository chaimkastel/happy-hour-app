'use client';

import { useState } from 'react';
import { CreditCard, History, Receipt, Gift } from 'lucide-react';
import MobileShell from '@/components/mobile/MobileShell';

interface Transaction {
  id: string;
  type: 'redeemed' | 'earned' | 'expired';
  title: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'expired';
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'redeemed',
    title: 'Happy Hour Special - The Local Pub',
    amount: '-$12.50',
    date: '2 hours ago',
    status: 'completed'
  },
  {
    id: '2',
    type: 'earned',
    title: 'Welcome Bonus',
    amount: '+$5.00',
    date: '1 day ago',
    status: 'completed'
  },
  {
    id: '3',
    type: 'expired',
    title: 'Lunch Deal - Bella Vista',
    amount: '$8.00',
    date: '3 days ago',
    status: 'expired'
  }
];

export default function MobileWalletPage() {
  const [balance] = useState(15.50);
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'redeemed':
        return <Receipt size={20} className="text-red-500" />;
      case 'earned':
        return <Gift size={20} className="text-green-500" />;
      case 'expired':
        return <History size={20} className="text-gray-400" />;
      default:
        return <CreditCard size={20} className="text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'redeemed':
        return 'text-red-600';
      case 'earned':
        return 'text-green-600';
      case 'expired':
        return 'text-gray-500';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <MobileShell
      headerProps={{
        title: 'Wallet'
      }}
    >
      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Balance</h2>
            <CreditCard size={24} />
          </div>
          <div className="text-3xl font-bold mb-2">${balance.toFixed(2)}</div>
          <p className="text-blue-100 text-sm">Available to use on deals</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Gift size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Add Funds</div>
                <div className="text-sm text-gray-600">Top up your wallet</div>
              </div>
            </div>
          </button>
          
          <button
            type="button"
            className="bg-white p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <History size={20} className="text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">History</div>
                <div className="text-sm text-gray-600">View all transactions</div>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4"
              >
                <div className="flex-shrink-0">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {transaction.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.date}
                  </div>
                </div>
                <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-3">How it works</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <span>Add funds to your wallet</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <span>Find and redeem deals</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <span>Pay with your wallet balance</span>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
