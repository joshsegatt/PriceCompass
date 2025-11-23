# Price Compass - Backend (NestJS)

This folder contains the NestJS backend for the Price Compass application.

Setup
1. Copy `.env.example` to `.env` and fill in your secrets (Postgres, JWT, Stripe, Plaid, Google).
2. Install dependencies:

```powershell
cd server
npm install
```

3. Generate Prisma client and run migrations:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

4. Start the dev server:

```powershell
npm run start:dev
```

API Contract: The API implements the routes required by the frontend. See code in `src/*` for controllers and DTOs.
