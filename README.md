# Subscription Master frontend

Production-oriented React client for the deployed Subscription Master API.

## Run locally

1. Copy `.env.example` to `.env`. The included `/api` configuration routes local browser requests through Vite because the deployed API currently rejects CORS preflights from localhost.
2. Run `npm install`.
3. Run `npm run dev`.

## Available screens

- Login and registration backed by `/auth/*`
- Dashboard using summary, monthly dynamics, and active subscription data
- Paginated subscription list with API-supported status, currency, price, and sort filters
- Subscription details, create, edit, and delete flows
- Authenticated annual CSV and XLSX downloads
- Admin service usage with a dedicated permission-denied state

The Axios client handles bearer tokens, one-at-a-time token refresh, session expiration, API errors, and authenticated file downloads. No frontend screen relies on fabricated backend fields or metrics.

For a separately hosted production frontend, its web server must proxy `/api` to the backend, or the backend must allow that frontend origin through CORS. `VITE_API_BASE_URL` can then be changed to the permitted public API URL.
