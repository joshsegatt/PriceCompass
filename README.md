# PriceCompass — Backend & Frontend

Advanced developer README for running, testing, and deploying PriceCompass (full-stack NestJS + Prisma backend, React + Vite frontend).

This document provides detailed setup, development, testing, deployment, and troubleshooting steps for an advanced workflow.

## Table of Contents
- Overview
- Repo layout
- Prerequisites
- Environment variables
- Backend (server) — setup & run
- Frontend (client) — setup & run
- Database & Prisma
- Testing (unit & integration)
- Payment & Integrations (Stripe, Plaid)
- Deployment guidance
- Troubleshooting & common issues

## Overview
PriceCompass is a subscription-enabled personal bill tracking and savings app. The backend is implemented with NestJS, Prisma (Postgres in production; SQLite used for ephemeral tests), Passport JWT authentication, Stripe for billing, and Plaid for banking integrations. The frontend is a Vite + React/TypeScript app that consumes the backend API.

## Repo layout (key files)
- `server/` — NestJS backend (Prisma, modules: auth, users, bills, savings, billing, integrations)
- `services/` — client-side service layer (API wrappers)
- `components/`, `App.tsx`, `index.tsx` — React frontend source
- `prisma/` — Prisma schema(s)

## Prerequisites
- Node.js >= 18
- npm or pnpm
- PostgreSQL (for production); tests use SQLite
- Stripe account + API keys (for billing flows)
- Plaid account + API keys (for bank integrations)

## Environment variables
Create a `.env` (or use your secret manager) with values for the server. Example keys used by the codebase:

```
# Server
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/pricecompass
JWT_SECRET=supersecret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Frontend
VITE_API_BASE_URL=http://localhost:3000
```

Only include production credentials in a secure vault; never commit secrets to git.

## Backend (server) — setup & run
1. Change to the server folder:

```powershell
cd server
npm install
```

2. Generate Prisma client (after setting `DATABASE_URL`):

```powershell
npx prisma generate
npx prisma migrate deploy   # for production/migrated DBs
```

3. Run in development:

```powershell
npm run start:dev
# or build and run
npm run build
npm run start
```

Notes:
- The server exposes API on `http://localhost:3000` by default. Stripe webhooks require the raw request body; the server preserves raw body in `main.ts`.
- The test suite uses an ephemeral SQLite DB and programmatically pushes a test Prisma schema.

## Frontend (client) — setup & run
From the repository root (or the workspace folder where `package.json` is located):

```powershell
npm install
npm run dev
```

The frontend expects a `VITE_API_BASE_URL` (default `http://localhost:3000`). The client service (`services/apiService.ts`) was updated to call the backend directly and store JWT in `sessionStorage`.

## Database & Prisma
- Production: PostgreSQL (set `DATABASE_URL` appropriately).
- Tests: ephemeral SQLite file (`server/test.db`) is created and removed by the Jest integration tests.
- Schema file: `prisma/schema.prisma` (a `prisma/schema.test.prisma` exists for tests).

Use Prisma Studio to inspect the DB:

```powershell
npx prisma studio
```

## Testing
- Unit & integration tests are implemented with Jest and Supertest. Tests run against an ephemeral SQLite DB and require `npx prisma db push` + `npx prisma generate` to be run during setup. Run tests from the `server` folder:

```powershell
cd server
npm test
```

Notes on Windows: the test harness includes precautions to avoid file locking while generating the Prisma client; if you see EPERM/EBUSY errors, rerun tests after ensuring no lingering Node processes are running.

## Payment & Integrations
- Stripe: use `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `STRIPE_PRICE_ID`. The server returns a `sessionId` from `POST /billing/create-checkout-session` which the frontend uses to redirect to Stripe Checkout.
- Plaid: requires client_id/secret and proper redirect/link-token flow. The server stores Plaid access tokens in the database (model `PlaidAccount`).

## Deployment guidance (concise)
- Backend: containerize the NestJS app or use a serverless container. Set environment variables in your platform and connect to a managed Postgres instance. Ensure Stripe webhooks are routed and the webhook secret configured.
- Frontend: build static assets with Vite and serve from a CDN or static hosting. Configure the base API URL in environment.

## Troubleshooting & common issues
- Prisma client generation/locks on Windows: if you see `EPERM` while Prisma generates the query engine, ensure no other Node process is generating the client concurrently; delete `node_modules/.prisma/client/*.tmp*` and re-run `npx prisma generate`.
- JWT auth failing in tests: tests register `PassportModule` and `JwtStrategy` to resolve the auth guard; ensure `JWT_SECRET` is set in test env.
- Stripe webhooks: Stripe requires a reachable URL; use `stripe cli` or ngrok for local development.

## Contributing
- Follow standard GitHub flow: feature branches from `main`, open PRs with clear descriptions, include tests for new behavior.

---

If you want, I can also:
- Create a CI workflow to run tests and lint on PRs.
- Add a `docker-compose.yml` to run Postgres + server + frontend locally.

---
Advanced help — ask me to generate the CI workflow or Docker compose for this project and I'll scaffold it for you.
