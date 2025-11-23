#!/bin/sh
set -e

# Entry script: run Prisma migrations (if DATABASE_URL present) then start the app
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL present — running prisma migrate deploy"
  npx prisma migrate deploy --schema=prisma/schema.prisma || true
else
  echo "DATABASE_URL not set — skipping migrations"
fi

echo "Starting application"
node dist/main.js
