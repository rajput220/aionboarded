# Deployment Guide — AI Onboarded

## Prerequisites

- Node.js 20+ or 22
- PostgreSQL 16 database
- A domain pointed to your server (e.g., `aionboarded.ai`)

## Environment Variables (Production)

```bash
DATABASE_URL=postgres://user:password@host:5432/aionboarded
PAYLOAD_SECRET=<generate-a-64-char-random-string>
NEXT_PUBLIC_SITE_URL=https://aionboarded.ai
NEXT_PUBLIC_SITE_NAME=AI Onboarded
RESEND_API_KEY=re_xxxxxxxxxxxx
```

> Generate a secret: `openssl rand -hex 32`

---

## Option 1: Vercel (Recommended)

Vercel is the most straightforward option for Next.js apps.

### Steps

1. **Push to GitHub**
   ```bash
   git init && git add -A && git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create PostgreSQL database**
   - Use [Neon](https://neon.tech) (free tier), [Supabase](https://supabase.com), or Vercel Postgres
   - Copy the connection string

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) → Import project from GitHub
   - Set environment variables in Settings → Environment Variables
   - Vercel auto-detects Next.js and builds automatically

4. **Custom Domain**
   - In Vercel → Settings → Domains → Add `aionboarded.ai`
   - Update DNS records as instructed

5. **Seed data** (one-time)
   ```bash
   # From your local machine, with DATABASE_URL pointing to production DB
   DATABASE_URL=<production-db-url> PAYLOAD_SECRET=<secret> npx tsx seed/index.ts
   ```

### Cost
- Vercel: Free (Hobby) or $20/mo (Pro)
- Neon DB: Free tier (0.5 GB), then $19/mo

---

## Option 2: Hostinger Node.js Hosting

### Steps

1. **Provision Node.js hosting** on Hostinger (Business plan or higher)

2. **Create PostgreSQL database**
   - Use Hostinger's MySQL/PostgreSQL if available, OR
   - Use an external provider (Neon, Supabase, Railway)

3. **Connect GitHub repository**
   - Hostinger Dashboard → Websites → Manage → Git
   - Connect your GitHub repo and select the `main` branch

4. **Configure environment**
   - Set Node.js version to 20 or 22
   - Add environment variables in the hosting panel:
     ```
     DATABASE_URL=<your-postgres-url>
     PAYLOAD_SECRET=<your-secret>
     NEXT_PUBLIC_SITE_URL=https://aionboarded.ai
     RESEND_API_KEY=<your-key>
     NODE_ENV=production
     ```

5. **Build & Start commands**
   ```
   Build: npm install && npm run build
   Start: npm start
   ```

6. **Domain setup**
   - Point `aionboarded.ai` to Hostinger nameservers
   - Enable SSL (auto via Let's Encrypt)

7. **Seed data**
   ```bash
   # SSH into Hostinger or run locally with prod DB URL
   DATABASE_URL=<prod-url> PAYLOAD_SECRET=<secret> npx tsx seed/index.ts
   ```

---

## Option 3: Docker (VPS / Self-hosted)

For any VPS (DigitalOcean, Hetzner, AWS EC2, etc.):

1. **Clone and configure**
   ```bash
   git clone <repo-url> aionboarded && cd aionboarded
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Start with Docker Compose**
   ```bash
   docker compose up -d
   ```

3. **Set up reverse proxy** (nginx/Caddy) for SSL:
   ```nginx
   server {
       server_name aionboarded.ai;
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL** — Use Certbot:
   ```bash
   sudo certbot --nginx -d aionboarded.ai
   ```

---

## Post-Deployment Checklist

- [ ] Change default admin password at `/admin`
- [ ] Verify all pages load correctly
- [ ] Test newsletter subscription flow
- [ ] Run Google Lighthouse (aim for 90+ scores)
- [ ] Submit sitemap to Google Search Console
- [ ] Verify OpenGraph tags with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Set up Resend domain verification for transactional emails
- [ ] Configure backups for PostgreSQL database
