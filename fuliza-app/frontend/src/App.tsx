import React, { useState } from 'react';
import { FulizaLimit } from './types';
import LimitCard from './components/LimitCard';
import RecentTicker from './components/RecentTicker';
import PaymentModal from './components/PaymentModal';

const LIMITS: FulizaLimit[] = [
  { amount: 5000,  fee: 159  },
  { amount: 10000, fee: 200  },
  { amount: 19000, fee: 270  },
  { amount: 32000, fee: 599  },
  { amount: 44000, fee: 770  },
  { amount: 53000, fee: 990  },
  { amount: 62000, fee: 1339 },
  { amount: 75000, fee: 2000 },
];

const App: React.FC = () => {
  const [selectedLimit, setSelectedLimit] = useState<FulizaLimit>(LIMITS[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-green-50 flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-extrabold text-green-700 tracking-tight">
            Fuliza Limit Boost
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Instant Limit Increase &nbsp;·&nbsp; No Paperwork &nbsp;·&nbsp;
            <span className="text-green-600 font-semibold">Same Day Access</span>
          </p>
        </div>

        {/* Step 1 info */}
        <div className="flex items-start gap-3 bg-white border border-green-200 rounded-xl px-4 py-3 mb-3 shadow-sm">
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 leading-snug">
            Choose your new Fuliza limit and complete the payment to get instant access.
          </p>
        </div>

        {/* Recent ticker */}
        <div className="mb-4">
          <RecentTicker />
        </div>

        {/* Limit selector */}
        <div className="bg-white border border-green-200 rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h8" />
            </svg>
            <h2 className="font-bold text-gray-800 text-base">Select Your Fuliza Limit</h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LIMITS.map(limit => (
              <LimitCard
                key={limit.amount}
                limit={limit}
                selected={selectedLimit.amount === limit.amount}
                onSelect={setSelectedLimit}
              />
            ))}
          </div>

          <div className="mt-3 text-center text-xs text-gray-500 font-medium">
            Selected: Ksh {selectedLimit.amount.toLocaleString()} &nbsp;·&nbsp;
            Fee: Ksh {selectedLimit.fee.toLocaleString()}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-green-200 text-base mb-5"
        >
          Boost to Ksh {selectedLimit.amount.toLocaleString()} →
        </button>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: '🔒', label: 'Secure' },
            { icon: '🔐', label: 'Encrypted' },
            { icon: '⚡', label: 'Instant' },
            { icon: '✅', label: 'Verified' },
          ].map(badge => (
            <div
              key={badge.label}
              className="flex items-center justify-center gap-2 bg-white border border-green-100 rounded-xl py-2.5 text-sm text-gray-600 font-medium shadow-sm"
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <PaymentModal
          selectedLimit={selectedLimit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default App;
