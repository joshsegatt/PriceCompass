# PriceCompass

Track household bills, compare UK plans, and keep savings goals in one board.

[Live demo](https://price-compass-teal.vercel.app)

PriceCompass is a personal-finance workspace for recurring costs — broadband, energy, mobile, insurance, credit — plus a catalogue of plans and a simple savings tracker. Built as a TypeScript app with a NestJS / Prisma API.

## What you can do

- Dashboard of monthly burn and upcoming payments
- Bill board with Upcoming / Paid / Overdue
- Catalogue by category (broadband, energy, insurance, mobile, loans, cards, mortgages)
- Savings goals with target, current amount, deadline
- Account + premium flag for paid features

## Stack

| Layer | |
| --- | --- |
| App | React, Vite, TypeScript |
| API | NestJS |
| Data | Prisma, PostgreSQL |
| Ship | Vercel, Docker |

## Local

```bash
git clone https://github.com/joshsegatt/PriceCompass.git
cd PriceCompass
npm install
npm run dev
```

API and env details live next to `server/` and `.env` files in the repo. Do not commit secrets.

## License

Proprietary. The public repo is a product showcase, not a license to reuse the code in another commercial product.
