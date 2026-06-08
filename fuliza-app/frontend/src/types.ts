export interface FulizaLimit {
  amount: number;
  fee: number;
}

export interface PaymentPayload {
  phone: string;
  amount: number;
  fee: number;
  limit: number;
}

export interface StkPushResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
}

export interface RecentIncrease {
  phone: string;
  amount: number;
  time: string;
}
