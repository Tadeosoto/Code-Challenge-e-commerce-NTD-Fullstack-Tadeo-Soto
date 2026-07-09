#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding default owner user..."
npm run db:seed || true

echo "Starting application..."
exec npm start
