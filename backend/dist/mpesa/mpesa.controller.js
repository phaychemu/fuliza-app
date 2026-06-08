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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MpesaController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpesaController = void 0;
const common_1 = require("@nestjs/common");
const mpesa_service_1 = require("./mpesa.service");
class StkPushDto {
    phone;
    amount;
    fee;
    limit;
}
let MpesaController = MpesaController_1 = class MpesaController {
    mpesaService;
    logger = new common_1.Logger(MpesaController_1.name);
    constructor(mpesaService) {
        this.mpesaService = mpesaService;
    }
    async initiateStkPush(body) {
        try {
            const result = await this.mpesaService.initiateStkPush(body.phone, body.fee, body.limit);
            if (result.ResponseCode === '0') {
                return {
                    success: true,
                    message: 'STK Push sent successfully. Enter your M-Pesa PIN.',
                    checkoutRequestId: result.CheckoutRequestID,
                    merchantRequestId: result.MerchantRequestID,
                };
            }
            throw new common_1.HttpException({ success: false, message: result.ResponseDescription || 'STK Push failed' }, common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            this.logger.error('STK Push error', error?.response?.data || error.message);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({ success: false, message: error?.response?.data?.errorMessage || 'Payment initiation failed' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkStatus(checkoutRequestId) {
        try {
            const result = await this.mpesaService.queryStkStatus(checkoutRequestId);
            const paid = result.ResultCode === '0';
            return {
                paid,
                message: paid ? 'Payment confirmed.' : result.ResultDesc || 'Payment pending or failed.',
                raw: result,
            };
        }
        catch (error) {
            this.logger.error('Status check error', error?.response?.data || error.message);
            throw new common_1.HttpException({ success: false, message: 'Could not check payment status' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleCallback(body) {
        this.logger.log('M-Pesa Callback received:', JSON.stringify(body));
        return { ResultCode: 0, ResultDesc: 'Accepted' };
    }
};
exports.MpesaController = MpesaController;
__decorate([
    (0, common_1.Post)('stk-push'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StkPushDto]),
    __metadata("design:returntype", Promise)
], MpesaController.prototype, "initiateStkPush", null);
__decorate([
    (0, common_1.Get)('status/:checkoutRequestId'),
    __param(0, (0, common_1.Param)('checkoutRequestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MpesaController.prototype, "checkStatus", null);
__decorate([
    (0, common_1.Post)('callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MpesaController.prototype, "handleCallback", null);
exports.MpesaController = MpesaController = MpesaController_1 = __decorate([
    (0, common_1.Controller)('mpesa'),
    __metadata("design:paramtypes", [mpesa_service_1.MpesaService])
], MpesaController);
//# sourceMappingURL=mpesa.controller.js.map