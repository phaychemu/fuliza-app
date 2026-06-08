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
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#1B4332' }}>
            Fuliza Limit Boost
          </h1>
          <p className="text-xs mt-1" style={{ color: '#4A5E4B' }}>
            Instant Limit Increase &nbsp;·&nbsp; No Paperwork &nbsp;·&nbsp;
            <span className="font-semibold" style={{ color: '#1A7A4A' }}>Same Day Access</span>
          </p>
        </div>

        {/* Step info */}
        <div className="flex items-start gap-3 bg-white border rounded-xl px-4 py-3 mb-3 shadow-sm" style={{ borderColor: '#C8E6C9' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1A7A4A' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm leading-snug" style={{ color: '#2D3A2E' }}>
            Choose your new Fuliza limit and complete the payment to get instant access.
          </p>
        </div>

        {/* Recent ticker */}
        <div className="mb-4">
          <RecentTicker />
        </div>

        {/* Limit selector */}
        <div className="bg-white border rounded-2xl p-4 shadow-sm mb-4" style={{ borderColor: '#C8E6C9' }}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5" style={{ color: '#1A7A4A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
            </svg>
            <h2 className="font-bold text-base" style={{ color: '#1B4332' }}>Select Your Fuliza Limit</h2>
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

          <div className="mt-3 text-center text-xs font-medium" style={{ color: '#4A5E4B' }}>
            Selected: Ksh {selectedLimit.amount.toLocaleString()} &nbsp;·&nbsp;
            Fee: Ksh {selectedLimit.fee.toLocaleString()}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg text-base mb-5 active:scale-95"
          style={{ backgroundColor: '#1A7A4A' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#155d38')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1A7A4A')}
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
              className="flex items-center justify-center gap-2 bg-white border rounded-xl py-2.5 text-sm font-medium shadow-sm"
              style={{ borderColor: '#C8E6C9', color: '#2D3A2E' }}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

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
