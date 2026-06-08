import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);

  constructor(private configService: ConfigService) {}

  private get consumerKey(): string {
    return this.configService.get<string>('MPESA_CONSUMER_KEY') || '';
  }

  private get consumerSecret(): string {
    return this.configService.get<string>('MPESA_CONSUMER_SECRET') || '';
  }

  private get shortcode(): string {
    return this.configService.get<string>('MPESA_SHORTCODE') || '174379';
  }

  private get passkey(): string {
    return this.configService.get<string>('MPESA_PASSKEY') || '';
  }

  private get callbackUrl(): string {
    return this.configService.get<string>('MPESA_CALLBACK_URL') || '';
  }

  private get isSandbox(): boolean {
    return this.configService.get<string>('MPESA_ENV') !== 'production';
  }

  private get baseUrl(): string {
    return this.isSandbox
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
  }

  async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
    ).toString('base64');

    const response = await axios.get(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${credentials}` },
      },
    );

    return response.data.access_token;
  }

  private generateTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${now.getFullYear()}` +
      `${pad(now.getMonth() + 1)}` +
      `${pad(now.getDate())}` +
      `${pad(now.getHours())}` +
      `${pad(now.getMinutes())}` +
      `${pad(now.getSeconds())}`
    );
  }

  private generatePassword(timestamp: string): string {
    const raw = `${this.shortcode}${this.passkey}${timestamp}`;
    return Buffer.from(raw).toString('base64');
  }

  async initiateStkPush(phone: string, amount: number, limit: number) {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword(timestamp);

    const payload = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: this.shortcode,
      PhoneNumber: phone,
      CallBackURL: this.callbackUrl,
      AccountReference: `FULIZA-${limit}`,
      TransactionDesc: `Fuliza Limit Boost to Ksh ${limit.toLocaleString()}`,
    };

    this.logger.log(`Initiating STK Push for ${phone}, Ksh ${amount}`);

    const response = await axios.post(
      `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }

  async queryStkStatus(checkoutRequestId: string) {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword(timestamp);

    const payload = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await axios.post(
      `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
}
