<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/lockup-dark.svg" />
  <img src="docs/brand/lockup-light.svg" alt="Subscription Master" width="360" />
</picture>

# Subscription Master frontend

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

React + TypeScript client for [Subscription Master](https://github.com/mirkamol-code/subscription-master), which finds subscriptions and free trials in a user's Gmail, tracks their status and reminds them before a charge. The backend README explains how the system works and how to self-host it.

Official hosted instance: [subscriptionmaster.app](https://subscriptionmaster.app)

## Run locally

**Prerequisites:** Node.js 22 and a running backend (see the backend's [Run and test locally](https://github.com/mirkamol-code/subscription-master#run-and-test-locally)).

```bash
cp .env.example .env
npm install
npm run dev
```

Vite serves the app on `http://localhost:5173` and proxies `/api` to `VITE_API_PROXY_TARGET` (your local backend on `http://localhost:8080` by default).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run lint` | oxlint |
| `npm test` | Vitest |
| `npm run build` | Type-check (`tsc -b`) and production build into `dist/` |

## Screens

- Landing page, Google sign-in and the OAuth callback
- Dashboard, subscription list and subscription details
- Source emails and invoice PDFs, fetched live from Gmail
- Notifications, Web Push and reminder settings
- Spending reports with CSV and XLSX downloads
- Settings: Gmail connection, currency, theme and account deletion
- Admin pages (users, payments, analytics, usage) for ADMIN users
- Privacy policy and terms

## Deploying your own copy

The browser calls the API at `VITE_API_BASE_URL` (default `/api`), so the web server in front of the app must proxy `/api` to your backend, or the backend must allow your frontend's origin.

- `Dockerfile` + `nginx.conf` build a static nginx image.
- `vercel.json` is the official instance's Vercel config; change the `/api` rewrite destination to your backend.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Report security problems privately as described in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 Mirkamol
