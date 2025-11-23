# Unified Deployment Guide for PriceCompass

This guide covers how to deploy the PriceCompass application (Frontend + Backend) to **Render** as a single service.

## Prerequisites

- GitHub account (with this repository pushed)
- [Render](https://render.com/) account

---

## Deployment Steps (Render)

1. **Create a New Web Service**
   - Log in to Render.
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository `joshsegatt/PriceCompass`.

2. **Configure the Service**
   - **Name**: `pricecompass-app` (or similar)
   - **Root Directory**: `.` (leave default)
   - **Environment**: `Docker`
   - **Region**: Choose one close to you (e.g., Oregon, Frankfurt)
   - **Branch**: `main`

3. **Environment Variables**
   Add the following environment variables in the "Environment" tab:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | *Your PostgreSQL connection string* (see below) |
   | `JWT_SECRET` | *A strong random string* |
   | `STRIPE_SECRET_KEY` | *Your Stripe Secret Key* |
   | `STRIPE_WEBHOOK_SECRET` | *Your Stripe Webhook Secret* |
   | `STRIPE_PRICE_ID` | *Your Stripe Price ID* |
   | `PLAID_CLIENT_ID` | *Your Plaid Client ID* |
   | `PLAID_SECRET` | *Your Plaid Secret* |
   | `PLAID_ENV` | `sandbox` or `production` |
   | `VITE_API_BASE_URL` | *(Optional)* Leave empty to use the same domain. |

4. **Database (PostgreSQL)**
   - You can create a managed PostgreSQL database on Render.
   - Click **New +** -> **PostgreSQL**.
   - Once created, copy the **Internal Connection String** (if backend is also on Render) or **External Connection String**.
   - Paste this into the `DATABASE_URL` variable in your Web Service.

5. **Deploy**
   - Click **Create Web Service**.
   - Render will build the Docker image (which includes both Frontend and Backend) and start the service.
   - Once live, your app will be available at the **Service URL** (e.g., `https://pricecompass-app.onrender.com`).

---

## Notes

- The frontend is now served by the backend. You do **NOT** need a separate Vercel deployment.
- All API requests from the frontend will automatically go to the same domain.
