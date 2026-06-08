import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
