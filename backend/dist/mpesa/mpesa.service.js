"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MpesaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpesaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let MpesaService = MpesaService_1 = class MpesaService {
    configService;
    logger = new common_1.Logger(MpesaService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    get consumerKey() {
        return this.configService.get('MPESA_CONSUMER_KEY') || '';
    }
    get consumerSecret() {
        return this.configService.get('MPESA_CONSUMER_SECRET') || '';
    }
    get shortcode() {
        return this.configService.get('MPESA_SHORTCODE') || '174379';
    }
    get passkey() {
        return this.configService.get('MPESA_PASSKEY') || '';
    }
    get callbackUrl() {
        return this.configService.get('MPESA_CALLBACK_URL') || '';
    }
    get isSandbox() {
        return this.configService.get('MPESA_ENV') !== 'production';
    }
    get baseUrl() {
        return this.isSandbox
            ? 'https://sandbox.safaricom.co.ke'
            : 'https://api.safaricom.co.ke';
    }
    async getAccessToken() {
        const credentials = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
        const response = await axios_1.default.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: { Authorization: `Basic ${credentials}` },
        });
        return response.data.access_token;
    }
    generateTimestamp() {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        return (`${now.getFullYear()}` +
            `${pad(now.getMonth() + 1)}` +
            `${pad(now.getDate())}` +
            `${pad(now.getHours())}` +
            `${pad(now.getMinutes())}` +
            `${pad(now.getSeconds())}`);
    }
    generatePassword(timestamp) {
        const raw = `${this.shortcode}${this.passkey}${timestamp}`;
        return Buffer.from(raw).toString('base64');
    }
    async initiateStkPush(phone, amount, limit) {
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
        const response = await axios_1.default.post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    async queryStkStatus(checkoutRequestId) {
        const accessToken = await this.getAccessToken();
        const timestamp = this.generateTimestamp();
        const password = this.generatePassword(timestamp);
        const payload = {
            BusinessShortCode: this.shortcode,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
        };
        const response = await axios_1.default.post(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
};
exports.MpesaService = MpesaService;
exports.MpesaService = MpesaService = MpesaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MpesaService);
//# sourceMappingURL=mpesa.service.js.map