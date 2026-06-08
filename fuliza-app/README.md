# Fuliza Limit Boost

A full-stack app to boost M-Pesa Fuliza limits via Daraja STK Push.

## Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: NestJS + Daraja (M-Pesa) API

## Project Structure
```
fuliza-app/
├── frontend/   # React + Tailwind UI
└── backend/    # NestJS + Daraja integration
```

## Quick Start

### 1. Get Daraja Sandbox Credentials
- Go to https://developer.safaricom.co.ke
- Create an app and copy your Consumer Key & Secret
- Use shortcode `174379` and the sandbox passkey for testing

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your Daraja credentials
npm install
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000  
Backend runs on http://localhost:3001

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /mpesa/stk-push | Initiate STK push payment |
| GET  | /mpesa/status/:id | Check payment status |
| POST | /mpesa/callback | Daraja payment callback |

## STK Push Request Body
```json
{
  "phone": "254712345678",
  "amount": 159,
  "fee": 159,
  "limit": 5000
}
```

## Environment Variables (backend/.env)
```
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9...
MPESA_CALLBACK_URL=https://yourdomain.com/mpesa/callback
MPESA_ENV=sandbox
PORT=3001
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.
