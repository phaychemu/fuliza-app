"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Fuliza Backend running on http://localhost:${port}`);
    console.log(`M-Pesa STK Push:  POST http://localhost:${port}/mpesa/stk-push`);
    console.log(`Payment Status:   GET  http://localhost:${port}/mpesa/status/:id`);
    console.log(`M-Pesa Callback:  POST http://localhost:${port}/mpesa/callback`);
}
bootstrap();
//# sourceMappingURL=main.js.map