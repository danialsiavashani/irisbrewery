# Iris Brewery 🎨

**Transform any photo into stunning artwork — sketches, paintings, and stylized art — with deterministic, tunable computer vision.**

> No AI prompts. No guesswork. Same photo + same settings = same result, every time.

🌐 **Live:** [irisbrewery.com](https://irisbrewery.com) &nbsp;|&nbsp; 📦 **Repo:** [github.com/danialsiavashani/irisbrewery](https://github.com/danialsiavashani/irisbrewery)

---

## What It Does

Iris Brewery is a photo-to-art SaaS where users upload a photo, tune a set of real parameters via sliders, and get back a transformed image in a chosen artistic style. Every result is built the same reliable way, every time — not a black-box AI model that produces different output each run, but a deterministic computer vision pipeline with real, explainable parameter control.

**Current styles (v1):**
- ✅ **Pencil Sketch** — Canny edge detection, Gaussian blur, dilation/inversion pipeline

**Coming in v1.1:**
- 🔜 Cartoon
- 🔜 Watercolor
- 🔜 Oil Painting
- 🔜 Pixel Art
- 🔜 Pop Art / Halftone

---

## Architecture

Iris Brewery is built as a **multi-service application** — three independently containerized and deployable services, each with a distinct responsibility and tech stack:

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Next.js Frontend  │────▶│   Django Backend     │────▶│  C++ cv-service     │
│   (Vercel)          │     │   (Render)           │     │  (Render)           │
│                     │     │                      │     │                     │
│  App Router         │     │  REST API + Auth     │     │  OpenCV pipeline    │
│  TypeScript         │     │  Quota management    │     │  HTTP microservice  │
│  shadcn/ui          │     │  Stripe billing      │     │  Stateless          │
│  React Hook Form    │     │  R2 storage          │     │  CPU-only           │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                       │
                            ┌──────────┴──────────┐
                            │   PostgreSQL         │
                            │   Cloudflare R2      │
                            │   (image storage)    │
                            └─────────────────────┘
```

### Why this architecture?

The C++ cv-service is a genuine microservice — stateless, single-responsibility, independently deployable, and language-agnostic at the API boundary. Classical CV image processing is fast and cheap on CPU, making it a natural fit for a separate, lightweight service rather than embedding it in the Django monolith. The Django backend handles auth, quota enforcement, billing, and storage — concerns that don't belong in a CV pipeline.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind | Server components, fast routing, type safety |
| UI | shadcn/ui (Nova preset), Lucide icons, Geist font | Consistent, accessible, restrained aesthetic |
| Forms | React Hook Form + Zod | Type-safe validation, DRF error field mapping |
| Backend | Django 6.0.6 + DRF | Mature, well-tested, excellent auth/ORM ecosystem |
| Auth | SimpleJWT + token_blacklist | httpOnly cookie JWTs, refresh token blacklisting on logout |
| Image processing | C++ 17, OpenCV 4.6 | Classical CV, deterministic, fast, CPU-only — no GPU cost |
| HTTP (cv-service) | cpp-httplib | Single-header C++ HTTP server, zero dependencies |
| Database | PostgreSQL 16 | Consistent between dev and prod, no SQLite/Postgres divergence |
| Storage | Cloudflare R2 (S3-compatible) | Zero egress fees, global CDN, django-storages/boto3 |
| Payments | Stripe (Checkout + Webhooks) | Test mode, one-time + subscription products |
| Email | Gmail SMTP via Google App Passwords | Password reset flow |
| Containerization | Docker + docker-compose | Per-service Dockerfiles, multi-stage builds |
| Deployment | Render (backend + cv-service), Vercel (frontend) | Cost-effective, always-on, no spin-down |

---

## Key Engineering Decisions

### C++ cv-service as a real microservice
The image processing pipeline is written in C++ using OpenCV — not because it's the easiest choice, but because it demonstrates real multi-language service architecture. The cv-service is stateless, exposes a clean HTTP API, and could be replaced or scaled independently of the Django backend. The multi-stage Docker build compiles the binary in one stage and copies only what's needed to run in the final image, keeping the production image lean.

### Deterministic, tunable pipeline
Unlike AI-based image generation, every style in Iris Brewery is a classical CV algorithm with real, named parameters (blur amount, edge sensitivity, line thickness). Same input + same parameters = same output, always. This is a deliberate architectural choice that enables reliable batch processing, reproducible results, and genuine user control — not "try it and hope."

### Postgres in both dev and prod
Early iterations used SQLite in dev and planned Postgres for prod only — a common footgun that causes silent behavior differences (migration compatibility, constraint handling, query planner). Migrated to Postgres in dev early to eliminate this entire class of potential production surprises.

### Stripe webhook reliability
The initial webhook implementation trusted the nested session object in the webhook payload directly. This caused intermittent 500s due to Stripe SDK inconsistencies between dict-like and attribute-like object access. The fix: always retrieve the full session fresh from Stripe by ID (`stripe.checkout.Session.retrieve(session_id)`) before reading any fields. Combined with `client_reference_id` as a fallback to `metadata.user_id`, this makes the upgrade flow robust against SDK version differences.

### Cloudflare R2 over AWS S3
Same S3-compatible API, zero egress fees, and integrates cleanly with Cloudflare DNS for the custom domain. The dev/prod URL split (`AWS_S3_ENDPOINT_URL` for authenticated read/write, `R2_PUBLIC_URL` for public-facing image links) is an explicit architectural decision that prevents the common mistake of using the API endpoint as a public image URL.

---

## Local Development

### Prerequisites
- GitHub Codespaces (recommended) or Docker
- Node.js 20+, Python 3.12+, g++ with OpenCV 4.x

### Dev startup

```bash
# First time only — compile cv-service
cd cv-service && make

# Every session — start PostgreSQL
sudo service postgresql start

# Terminal 1 — cv-service
cd cv-service && ./cv-service

# Terminal 2 — Django backend
cd backend && source venv/bin/activate && python manage.py runserver 0.0.0.0:8000

# Terminal 3 — Stripe webhook listener
npx @stripe/cli listen --forward-to localhost:8000/api/v1/billing/webhook/

# Terminal 4 — Next.js frontend
cd frontend && node_modules/.bin/next dev
```

### Environment variables

Copy `backend/.env.example` (if present) or create `backend/.env` with:

```
SECRET_KEY=your_django_secret_key
DEBUG=True
EMAIL_HOST_USER=your_gmail
EMAIL_HOST_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
CV_SERVICE_URL=http://localhost:8001
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_LIFETIME_PRICE_ID=price_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
DB_NAME=irisbrewery
DB_USER=irisbrewery_user
DB_PASSWORD=your_dev_password
DB_HOST=localhost
DB_PORT=5432
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=sketchify-media
R2_ENDPOINT_URL=https://<account_id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
```

### Docker

```bash
docker compose up --build
```

Starts all 4 services (db, cv-service, backend, frontend) with proper dependency ordering and health checks.

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | `irisbrewery.com` |
| Backend (Django) | Render | `api.irisbrewery.com` |
| cv-service (C++) | Render | Internal to backend |
| Storage | Cloudflare R2 | `media.irisbrewery.com` |
| Database | Render Managed Postgres | Internal to backend |
| DNS | Cloudflare | All records |

---

## Roadmap

### ✅ v1 — Live (current)
- Pencil sketch style with tunable parameters (blur, edge sensitivity, line thickness)
- JWT auth with httpOnly cookies (register, login, logout, forgot/reset password)
- Free tier: 3 generations/day | Pro tier: 50 generations/day
- Stripe billing — $20 one-time lifetime or $2/month
- Watermarked preview (no quota cost) + full generation (quota cost)
- Cloudflare R2 image storage
- Full desktop + mobile responsive UI
- Dockerized, deployed on Render + Vercel

### 🔜 v1.1 — Post-launch fast-follow
Five new classical CV styles, each independently tunable via sliders:
- **Cartoon** — bilateral filtering + edge overlay for bold outlined flat-color look
- **Watercolor** — soft edge-preserving filters for painterly bleed effect
- **Oil Painting** — `cv::stylization` for thick brush-stroke texture
- **Pixel Art** — nearest-neighbor downscale + reupscale for hard blocky pixels
- **Pop Art / Halftone** — variable-radius dot grid, intensity-mapped, optional color palette

Each style gets its own params struct in C++, its own slider group in the frontend, and enables the corresponding StyleTabs option (already scaffolded, currently disabled).

### 🔜 v2 — Effect Chaining
The core differentiator: compose a pipeline of styles in user-defined order, each with its own independent parameters. Same input + same recipe = same output, always.

```
Original photo → [Sketch (edge=40)] → [Cartoon (thickness=2)] → Result
```

- Multi-select, reorderable StyleTabs (not single-select)
- Each selected style shows its own expandable slider group
- Deselect a style → instantly removed from chain, result re-renders
- "Recipe" saved and named by logged-in users (stretch goal)
- Order matters: Sketch→Watercolor ≠ Watercolor→Sketch (edge-detect-then-soften vs soften-then-edge-detect)

### 🔮 Future (v3+)
- **Neural style transfer (VGG19)** — semantically-aware style transfer using pretrained CNN features; region-appropriate color (the leaf stays green, the sky stays blue); GPU inference tier with higher quota cost
- **Google OAuth** — social login alongside existing email/password
- **Batch processing** — upload multiple photos, apply same style/params to all
- **Generation history** — browse and re-download past results

---

## About

Built by [Danial Siavashani](https://github.com/danialsiavashani) as a portfolio project demonstrating real multi-service architecture, C++ systems programming, classical computer vision, and full-stack SaaS engineering.

The deliberate choice to write the image processing pipeline in C++ (rather than Python/Pillow) reflects the project's core learning goal: building systems that work across language boundaries, think about performance, and make explicit architectural tradeoffs.