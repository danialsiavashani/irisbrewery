# Dev startup

## First time only — compile cv-service
cd cv-service && make

## Every session — start PostgreSQL (if not already running)
sudo service postgresql start

## Terminal 1 — cv-service
cd cv-service && ./cv-service &

## Terminal 2 — Django
cd backend && source venv/bin/activate && python manage.py runserver 0.0.0.0:8000

## Terminal 3 — Stripe webhook listener
npx @stripe/cli listen --forward-to localhost:8000/api/v1/billing/webhook/

## Terminal 4 — Next.js
cd frontend && node_modules/.bin/next dev