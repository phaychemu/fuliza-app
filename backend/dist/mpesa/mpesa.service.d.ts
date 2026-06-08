import { ConfigService } from '@nestjs/config';
export declare class MpesaService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private get consumerKey();
    private get consumerSecret();
    private get shortcode();
    private get passkey();
    private get callbackUrl();
    private get isSandbox();
    private get baseUrl();
    getAccessToken(): Promise<string>;
    private generateTimestamp;
    private generatePassword;
    initiateStkPush(phone: string, amount: number, limit: number): Promise<any>;
    queryStkStatus(checkoutRequestId: string): Promise<any>;
}
