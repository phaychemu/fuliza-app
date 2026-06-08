import React, { useState, useEffect } from 'react';
import { FulizaLimit, StkPushResponse } from '../types';
import { initiateStkPush } from '../api';

interface PaymentModalProps {
  selectedLimit: FulizaLimit;
  onClose: () => void;
}

type Step = 'details' | 'review' | 'processing' | 'done';

const PaymentModal: React.FC<PaymentModalProps> = ({ selectedLimit, onClose }) => {
  const [step, setStep] = useState<Step>('details');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<StkPushResponse | null>(null);
  const [processingDots, setProcessingDots] = useState('');

  useEffect(() => {
    if (step !== 'processing') return;
    const interval = setInterval(() => {
      setProcessingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [step]);

  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('0') && digits.length === 10) return '254' + digits.slice(1);
    if (digits.startsWith('254') && digits.length === 12) return digits;
    return digits;
  };

  const handleDetailsSubmit = () => {
    setError('');
    if (idNumber.trim().length < 6) { setError('Enter a valid ID number'); return; }
    const fp = formatPhone(phone);
    if (fp.length !== 12) { setError('Enter a valid Safaricom number e.g. 0712345678'); return; }
    setFormattedPhone(fp);
    setStep('review');
  };

  const handlePay = async () => {
    setStep('processing');
    try {
      const res = await initiateStkPush({
        phone: formattedPhone,
        amount: selectedLimit.fee,
        fee: selectedLimit.fee,
        limit: selectedLimit.amount,
      });
      setResult(res);
      setTimeout(() => setStep('done'), 4000);
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
      setStep('review');
    }
  };

  const displayPhone = formattedPhone
    ? '+' + formattedPhone.slice(0, 3) + ' ' + formattedPhone.slice(3, 6) + formattedPhone.slice(6)
    : '';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      {/* STEP 1 — DETAILS */}
      {step === 'details' && (
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#1A7A4A' }}>
              <svg className="w-7 h-7" style={{ color: '#1A7A4A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-bold text-center mb-1" style={{ color: '#1A7A4A' }}>
            Enter Your Details
          </h3>
          <p className="text-sm text-center flex items-center justify-center gap-1 mb-5" style={{ color: '#4A5E4B' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Provide your details to proceed
          </p>

          <label className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: '#1A7A4A' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
            </svg>
            ID Number
          </label>
          <input
            type="text"
            value={idNumber}
            onChange={e => setIdNumber(e.target.value)}
            placeholder="Enter your ID number"
            className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none transition"
            style={{ borderColor: '#C8E6C9', color: '#1B4332' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#1A7A4A')}
            onBlur={e => (e.currentTarget.style.borderColor = '#C8E6C9')}
          />

          <label className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: '#1A7A4A' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Phone Number
          </label>
          <div className="flex border rounded-xl overflow-hidden mb-2 transition"
            style={{ borderColor: '#C8E6C9' }}>
            <span className="px-3 py-3 text-sm font-medium border-r" style={{ backgroundColor: '#E8F5E9', color: '#1B4332', borderColor: '#C8E6C9' }}>+254</span>
            <input
              type="tel"
              value={phone.startsWith('0') ? phone.slice(1) : phone.replace(/^254/, '')}
              onChange={e => setPhone('0' + e.target.value.replace(/\D/g, ''))}
              placeholder="712 345 678"
              className="flex-1 px-3 py-3 text-sm focus:outline-none"
              style={{ color: '#1B4332' }}
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <p className="text-xs mb-4 flex items-start gap-1" style={{ color: '#6B8F71' }}>
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#1A7A4A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            We'll send an M-Pesa STK push to your phone number for payment (Fee: Ksh {selectedLimit.fee.toLocaleString()}).
          </p>

          <button
            onClick={handleDetailsSubmit}
            className="w-full text-white font-bold py-3 rounded-xl transition-all duration-200 mb-2"
            style={{ backgroundColor: '#1A7A4A' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#155d38')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1A7A4A')}
          >
            Continue
          </button>
          <button
            onClick={onClose}
            className="w-full border font-medium py-3 rounded-xl transition"
            style={{ borderColor: '#C8E6C9', color: '#4A5E4B' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E8F5E9')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
        </div>
      )}

      {/* STEP 2 — REVIEW */}
      {step === 'review' && (
        <div className="w-full max-w-sm rounded-2xl shadow-2xl p-6" style={{ backgroundColor: '#f0faf4' }}>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1A7A4A' }}>
            Fuliza Limit Boost
          </h2>
          <div className="h-0.5 w-12 rounded mb-4" style={{ backgroundColor: '#1A7A4A' }} />

          <h3 className="text-lg font-bold mb-1" style={{ color: '#1B4332' }}>Review Request</h3>
          <p className="text-sm mb-5" style={{ color: '#4A5E4B' }}>
            Confirm your selection before we initiate the STK push.
          </p>

          <div>
            <div className="flex justify-between items-center py-4 border-b" style={{ borderColor: '#C8E6C9' }}>
              <span className="text-sm" style={{ color: '#2D3A2E' }}>New Limit</span>
              <span className="font-bold text-base" style={{ color: '#1A7A4A' }}>Ksh {selectedLimit.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b" style={{ borderColor: '#C8E6C9' }}>
              <span className="text-sm" style={{ color: '#2D3A2E' }}>Processing Fee</span>
              <span className="font-bold text-base" style={{ color: '#1A7A4A' }}>Ksh {selectedLimit.fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#4A5E4B' }}>Payment Phone</span>
              <span className="font-medium text-sm" style={{ color: '#1B4332' }}>{displayPhone}</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <button
            onClick={handlePay}
            className="w-full text-white font-bold py-4 rounded-xl transition-all duration-200 mt-2 mb-3 text-base"
            style={{ backgroundColor: '#1A7A4A' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#155d38')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1A7A4A')}
          >
            Pay Ksh {selectedLimit.fee.toLocaleString()} &amp; Boost
          </button>
          <button
            onClick={() => { setStep('details'); setError(''); }}
            className="w-full text-sm transition"
            style={{ color: '#4A5E4B' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1B4332')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4A5E4B')}
          >
            Cancel Request
          </button>
        </div>
      )}

      {/* STEP 3 — PROCESSING */}
      {step === 'processing' && (
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E8F5E9' }}>
            <svg className="animate-spin w-8 h-8" style={{ color: '#1A7A4A' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold mb-2" style={{ color: '#1B4332' }}>
            Processing Payment{processingDots}
          </h4>
          <p className="text-sm mb-2" style={{ color: '#2D3A2E' }}>
            STK push sent to{' '}
            <span className="font-semibold" style={{ color: '#1A7A4A' }}>{displayPhone}</span>
          </p>
          <p className="text-xs" style={{ color: '#6B8F71' }}>
            Check your phone and enter your M-Pesa PIN to complete the boost.
          </p>
          <div className="mt-6 flex gap-1 justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: '#1A7A4A', animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 4 — DONE */}
      {step === 'done' && (
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E8F5E9' }}>
            <svg className="w-8 h-8" style={{ color: '#1A7A4A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold mb-2" style={{ color: '#1B4332' }}>Boost Initiated!</h4>
          <p className="text-sm mb-1" style={{ color: '#2D3A2E' }}>
            Your Fuliza limit of{' '}
            <span className="font-bold" style={{ color: '#1A7A4A' }}>
              Ksh {selectedLimit.amount.toLocaleString()}
            </span>{' '}
            is being processed.
          </p>
          {result?.checkoutRequestId && (
            <p className="text-xs mt-2 font-mono break-all" style={{ color: '#6B8F71' }}>
              Ref: {result.checkoutRequestId}
            </p>
          )}
          <button
            onClick={onClose}
            className="w-full text-white font-bold py-3 rounded-xl transition mt-6"
            style={{ backgroundColor: '#1A7A4A' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#155d38')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1A7A4A')}
          >
            Done
          </button>
        </div>
      )}

    </div>
  );
};

export default PaymentModal;
