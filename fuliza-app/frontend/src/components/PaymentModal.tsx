import React, { useState } from 'react';
import { FulizaLimit, StkPushResponse } from '../types';
import { initiateStkPush } from '../api';

interface PaymentModalProps {
  selectedLimit: FulizaLimit;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ selectedLimit, onClose }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StkPushResponse | null>(null);
  const [error, setError] = useState('');

  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
      return '254' + digits.slice(1);
    }
    if (digits.startsWith('254') && digits.length === 12) {
      return digits;
    }
    return digits;
  };

  const handleSubmit = async () => {
    setError('');
    const formatted = formatPhone(phone);
    if (formatted.length !== 12) {
      setError('Enter a valid Safaricom number e.g. 0712345678');
      return;
    }
    setLoading(true);
    try {
      const res = await initiateStkPush({
        phone: formatted,
        amount: selectedLimit.fee,
        fee: selectedLimit.fee,
        limit: selectedLimit.amount,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-slide-up">
        {!result ? (
          <>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">Complete Payment</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5">
              <div className="text-sm text-gray-500">Selected Limit</div>
              <div className="text-xl font-bold text-green-700">Ksh {selectedLimit.amount.toLocaleString()}</div>
              <div className="text-sm text-green-600">Processing Fee: Ksh {selectedLimit.fee.toLocaleString()}</div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 0712 345 678"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-green-400 transition mb-1"
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <p className="text-xs text-gray-400 mb-4">
              An STK push will be sent to this number. Enter your M-Pesa PIN to authorize.
            </p>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending STK Push...
                </>
              ) : (
                `Pay Ksh ${selectedLimit.fee.toLocaleString()} via M-Pesa`
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">STK Push Sent!</h4>
            <p className="text-gray-600 text-sm mb-2">{result.message}</p>
            {result.checkoutRequestId && (
              <p className="text-xs text-gray-400 mb-4 font-mono break-all">
                Ref: {result.checkoutRequestId}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-5">
              Check your phone and enter your M-Pesa PIN to complete the payment.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
