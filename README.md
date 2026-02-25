# AI Onboarded — aionboarded.ai

A production-grade community website for **AI Onboarded** — a 100+ member community creating awareness and sharing knowledge on AI tools and latest AI developments.

Built with **Next.js 15** + **Payload CMS 3.x** + **TypeScript** + **Tailwind CSS** + **PostgreSQL**.

## Features

- 📝 **Blog** — Articles with categories, tags, author info, reading time, SEO
- 🎙️ **Podcast** — Episodes with Spotify/Apple/YouTube embeds, show notes, transcripts
- 📰 **Newsletter** — Archive with double opt-in email subscription (Resend)
- 🗞️ **AI News** — Curated developments with "Top 5 This Week" section
- 🔍 **Site-wide Search** — Across all content types
- 🌙 **Dark/Light Mode** — System-aware with manual toggle
- 📱 **Responsive** — Mobile-first design
- 🔒 **Security** — HSTS, CSP headers, rate limiting, RBAC
- 🤖 **SEO** — Sitemap, robots.txt, OpenGraph, structured data (JSON-LD)
- 📡 **RSS Feeds** — Blog and Podcast with iTunes extensions
- 🛠️ **Admin CMS** — Full Payload CMS admin panel at `/admin`

## Quick Start

### Prerequisites

- Node.js 20+ (or 22)
- PostgreSQL 16 (or Docker)

### 1. Clone & Install

```bash
git clone <your-repo-url> aionboarded
cd aionboarded
npm install
```

### 2. Set Up Database

**Option A: Docker (recommended)**
```bash
docker compose up postgres -d
```

**Option B: Local PostgreSQL**
Create a database called `aionboarded`.

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

Key variables:
| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `PAYLOAD_SECRET` | Random secret for Payload CMS auth | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | ✅ |
| `RESEND_API_KEY` | Resend API key for newsletter emails | Optional |

### 4. Run Development Server

```bash
npm run dev
```

The site will be at `http://localhost:3000` and admin at `http://localhost:3000/admin`.

### 5. Seed Sample Data

```bash
npx tsx seed/index.ts
```

This creates an admin user, sample content, tags, and categories.

**Admin login:** `admin@aionboarded.ai` / `admin123!`

> ⚠️ Change the admin password immediately after first login!

## Docker (Full Stack)

```bash
docker compose up
```

This starts both PostgreSQL and the app. The site will be at `http://localhost:3000`.

## Project Structure

```
src/
├── app/
│   ├── (frontend)/     # Public pages (blog, podcast, newsletter, news, etc.)
│   ├── (payload)/      # Payload CMS admin routes
│   ├── api/            # API routes (subscribe, contact, search)
│   ├── rss/            # RSS feed generators
│   └── sitemap.ts      # Dynamic sitemap
├── collections/        # Payload CMS data model (10 collections)
├── components/         # React components (layout, UI)
└── lib/                # Utilities (SEO, payload client, helpers)
```

## Content Types

| Collection | Description |
|---|---|
| **Users** | Admin/Editor roles with RBAC |
| **Blog Posts** | Articles with SEO, reading time, categories |
| **Podcast Episodes** | Multi-platform embeds, show notes, transcripts |
| **Newsletter Issues** | Numbered issues with archive |
| **News Items** | Curated news with source attribution |
| **Tags** | Cross-content tagging |
| **Categories** | Blog categorization |
| **Media** | Image upload with auto-optimization |
| **Subscribers** | Newsletter email list with double opt-in |
| **Pages** | Static pages (about, etc.) |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

Vercel auto-detects Next.js and handles builds. Use a managed PostgreSQL (Neon, Supabase, or Vercel Postgres).

### Hostinger Node.js Hosting

1. Push to GitHub
2. Connect GitHub repo in Hostinger dashboard
3. Set Node.js version to 20+
4. Set start command: `npm run build && npm start`
5. Configure environment variables
6. Set up PostgreSQL database and update `DATABASE_URL`

See [docs/deployment.md](docs/deployment.md) for detailed instructions.

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint check
npx tsx seed/index.ts  # Seed database
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **CMS:** Payload CMS 3.x (integrated)
- **Database:** PostgreSQL 16
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Email:** Resend
- **Image Processing:** Sharp

## License

MIT
