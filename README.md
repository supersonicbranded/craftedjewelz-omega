
# CraftedJewelz — Flagship Jewelry CAD Suite

## Overview
CraftedJewelz is a modern, production-ready jewelry CAD suite with:
- Branded splash, wizard, and templates gallery
- Full plugin suite (Core, Advanced, Next-Gen)
- Welcome tour, walkthrough projects, and PDF mini-tutorials
- Tutorial marketplace and pack exporter scaffolding
- Payments (Square, PayPal, Apple Pay, Cash App Pay via Stripe)
- Auto-updates (GitHub Releases or S3/CloudFront) and signed CI workflows
- Backend FastAPI (reports, payments, webhooks, tutorials, telemetry)
- Docs, CI/CD, and AWS deployment workflow

## Quickstart

### Backend Setup
```bash
cd apps/backend
pip install -r requirements.txt
```

Set environment variables in `.env` or Render dashboard:
- `DATABASE_URL` (PostgreSQL connection string)
- `STRIPE_SECRET_KEY`
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`
- `SECRET_KEY` (JWT secret)

Run the backend:
```bash
uvicorn app.main:app --reload
```
Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup
```bash
cd apps/web
npm install
npm run dev
```

### Demo & Download
- [Live Demo](site/index.html)
- [Download Releases](https://github.com/craftedjewelz/craftedjewelz/releases)

## Usage
- Register/login, create projects, explore marketplace, process payments
- Use templates and walkthroughs for quick start
- Access admin dashboard for analytics

## Troubleshooting
- Ensure all environment variables are set
- Check logs for errors (backend uses loguru)
- For payment issues, verify API keys and webhook URLs
- For deployment, see Docker and Render configs

## API Reference
Key endpoints:
- `/register` — User registration
- `/login` — User login (JWT)
- `/products`, `/projects` — CRUD for products/projects
- `/marketplace/products`, `/marketplace/projects` — Marketplace listings
- `/payments/stripe`, `/payments/paypal`, `/payments/square` — Payment processing
- `/payments/refund/stripe`, `/payments/refund/paypal` — Refunds
- `/payments/subscribe/stripe` — Subscriptions
- `/payments/webhook/stripe` — Stripe webhooks
- `/admin/payments`, `/admin/payments/analytics` — Admin dashboard

## Architecture
- **Backend:** FastAPI, SQLAlchemy, asyncpg, JWT, loguru, Sentry, Docker, Render
- **Frontend:** React, Electron, Vite, TailwindCSS
- **CI/CD:** GitHub Actions, AWS, S3/CloudFront

## Contribution
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct
See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security
See [SECURITY.md](SECURITY.md). Report issues to security@craftedjewelz.com.

## Documentation
- [Payments](docs/payments.md)
- [Card Present Payments](docs/payments-card-present.md)
- [Release Setup](docs/release-setup.md)
- [Cloud Render](docs/cloud-render/README.md)
- [Updates](docs/updates/README.md)
- [Update Channels](docs/updates/channels.md)
- [S3 Structure](docs/updates/s3-structure.md)

## License & Compliance
CraftedJewelz is released under the MIT License. See [LICENSE](LICENSE).

All dependencies are open source and listed in [apps/web/package.json](apps/web/package.json) and [apps/backend/requirements.txt](apps/backend/requirements.txt).

## Screenshots & Demo
![App Icon](apps/web/build/appicon2.png)
![Demo Screenshot](apps/web/build/icons/appicon_256.png)
![Demo GIF](apps/web/build/demo.gif)

[Live Demo](site/index.html)
