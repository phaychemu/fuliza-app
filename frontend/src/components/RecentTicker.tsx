import React, { useEffect, useState } from 'react';
import { RecentIncrease } from '../types';

const MOCK_RECENTS: RecentIncrease[] = [
  { phone: '0700****42', amount: 53000, time: 'just now' },
  { phone: '0712****88', amount: 32000, time: '1 min ago' },
  { phone: '0722****15', amount: 75000, time: '2 mins ago' },
  { phone: '0733****67', amount: 19000, time: '3 mins ago' },
  { phone: '0745****09', amount: 44000, time: '4 mins ago' },
];

const RecentTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % MOCK_RECENTS.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = MOCK_RECENTS[index];

  return (
    <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 shadow-sm" style={{ borderColor: '#C8E6C9' }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F5E9' }}>
        <svg className="w-4 h-4" style={{ color: '#1A7A4A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <div className="text-sm transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
        <span className="font-semibold" style={{ color: '#1B4332' }}>Recent increases</span>
        <br />
        <span style={{ color: '#2D3A2E' }}>
          {current.phone}{' '}
          <span className="font-medium" style={{ color: '#1A7A4A' }}>
            increased to Ksh {current.amount.toLocaleString()}
          </span>{' '}
          <span style={{ color: '#6B8F71' }}>- {current.time}</span>
        </span>
      </div>
    </div>
  );
};

export default RecentTicker;
