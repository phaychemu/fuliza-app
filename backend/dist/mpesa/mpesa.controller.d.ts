import { MpesaService } from './mpesa.service';
declare class StkPushDto {
    phone: string;
    amount: number;
    fee: number;
    limit: number;
}
export declare class MpesaController {
    private readonly mpesaService;
    private readonly logger;
    constructor(mpesaService: MpesaService);
    initiateStkPush(body: StkPushDto): Promise<{
        success: boolean;
        message: string;
        checkoutRequestId: any;
        merchantRequestId: any;
    }>;
    checkStatus(checkoutRequestId: string): Promise<{
        paid: boolean;
        message: any;
        raw: any;
    }>;
    handleCallback(body: any): Promise<{
        ResultCode: number;
        ResultDesc: string;
    }>;
}
export {};
