import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MpesaService } from './mpesa.service';

class StkPushDto {
  phone: string;
  amount: number;
  fee: number;
  limit: number;
}

@Controller('mpesa')
export class MpesaController {
  private readonly logger = new Logger(MpesaController.name);

  constructor(private readonly mpesaService: MpesaService) {}

  @Post('stk-push')
  async initiateStkPush(@Body() body: StkPushDto) {
    try {
      const result = await this.mpesaService.initiateStkPush(
        body.phone,
        body.fee,
        body.limit,
      );

      if (result.ResponseCode === '0') {
        return {
          success: true,
          message: 'STK Push sent successfully. Enter your M-Pesa PIN.',
          checkoutRequestId: result.CheckoutRequestID,
          merchantRequestId: result.MerchantRequestID,
        };
      }

      throw new HttpException(
        { success: false, message: result.ResponseDescription || 'STK Push failed' },
        HttpStatus.BAD_REQUEST,
      );
    } catch (error: any) {
      this.logger.error('STK Push error', error?.response?.data || error.message);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { success: false, message: error?.response?.data?.errorMessage || 'Payment initiation failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status/:checkoutRequestId')
  async checkStatus(@Param('checkoutRequestId') checkoutRequestId: string) {
    try {
      const result = await this.mpesaService.queryStkStatus(checkoutRequestId);
      const paid = result.ResultCode === '0';
      return {
        paid,
        message: paid ? 'Payment confirmed.' : result.ResultDesc || 'Payment pending or failed.',
        raw: result,
      };
    } catch (error: any) {
      this.logger.error('Status check error', error?.response?.data || error.message);
      throw new HttpException(
        { success: false, message: 'Could not check payment status' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('callback')
  async handleCallback(@Body() body: any) {
    this.logger.log('M-Pesa Callback received:', JSON.stringify(body));
    // Handle payment result here (save to DB, trigger webhooks, etc.)
    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }
}
