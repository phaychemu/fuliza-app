import { PaymentPayload, StkPushResponse } from './types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function initiateStkPush(payload: PaymentPayload): Promise<StkPushResponse> {
  const response = await fetch(`${BASE_URL}/mpesa/stk-push`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Payment initiation failed');
  }
  return response.json();
}

export async function checkPaymentStatus(checkoutRequestId: string): Promise<{ paid: boolean; message: string }> {
  const response = await fetch(`${BASE_URL}/mpesa/status/${checkoutRequestId}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Status check failed');
  }
  return response.json();
}
