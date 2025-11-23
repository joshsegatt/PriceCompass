# Vercel Deployment Guide for PriceCompass

This guide covers how to deploy the PriceCompass application (Frontend + Backend) to **Vercel** as a unified serverless application.

## Prerequisites

- GitHub account (with this repository pushed)
- [Vercel](https://vercel.com/) account
- A PostgreSQL database (e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or Render Postgres)

---

## Deployment Steps (Vercel)

1. **Import Project**
   - Log in to Vercel.
   - Click **Add New...** -> **Project**.
   - Import `joshsegatt/PriceCompass`.

2. **Configure Project**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `.` (leave default)
   - **Build Command**: `vite build` (default)
   - **Output Directory**: `dist` (default)

3. **Environment Variables**
   Add the following environment variables in the "Environment Variables" section:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | *Your PostgreSQL connection string* |
   | `JWT_SECRET` | *A strong random string* |
   | `STRIPE_SECRET_KEY` | *Your Stripe Secret Key* |
   | `STRIPE_WEBHOOK_SECRET` | *Your Stripe Webhook Secret* |
   | `STRIPE_PRICE_ID` | *Your Stripe Price ID* |
   | `PLAID_CLIENT_ID` | *Your Plaid Client ID* |
   | `PLAID_SECRET` | *Your Plaid Secret* |
   | `PLAID_ENV` | `sandbox` or `production` |
   | `VITE_API_BASE_URL` | *(Optional)* Leave empty to use the same domain. |

4. **Deploy**
   - Click **Deploy**.
   - Vercel will build the frontend and the serverless backend function.
   - Once live, your app will be available at your Vercel URL (e.g., `https://pricecompass.vercel.app`).

---

## Notes

- **Database**: Vercel does not host databases. You must provide a connection string to an external Postgres database.
- **Serverless**: The backend runs as a serverless function in `api/index.ts`.
