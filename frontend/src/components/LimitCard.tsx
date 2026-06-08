import React from 'react';
import { FulizaLimit } from '../types';

interface LimitCardProps {
  limit: FulizaLimit;
  selected: boolean;
  onSelect: (limit: FulizaLimit) => void;
}

const LimitCard: React.FC<LimitCardProps> = ({ limit, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(limit)}
      className="w-full text-left p-3 rounded-xl border-2 transition-all duration-200"
      style={{
        borderColor: selected ? '#1A7A4A' : '#C8E6C9',
        backgroundColor: selected ? '#E8F5E9' : '#ffffff',
        boxShadow: selected ? '0 2px 8px rgba(26,122,74,0.15)' : 'none',
      }}
    >
      <div className="font-bold text-base" style={{ color: selected ? '#1B4332' : '#2D3A2E' }}>
        Ksh {limit.amount.toLocaleString()}
      </div>
      <div className="text-sm mt-0.5" style={{ color: selected ? '#1A7A4A' : '#4A5E4B' }}>
        Fee: Ksh {limit.fee.toLocaleString()}
      </div>
    </button>
  );
};

export default LimitCard;
