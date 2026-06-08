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
      className={`
        w-full text-left p-3 rounded-xl border-2 transition-all duration-200
        ${selected
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
        }
      `}
    >
      <div className={`font-bold text-base ${selected ? 'text-green-700' : 'text-gray-800'}`}>
        Ksh {limit.amount.toLocaleString()}
      </div>
      <div className={`text-sm mt-0.5 ${selected ? 'text-green-600' : 'text-gray-500'}`}>
        Fee: Ksh {limit.fee.toLocaleString()}
      </div>
    </button>
  );
};

export default LimitCard;
