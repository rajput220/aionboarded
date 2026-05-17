/**
 * AI Onboarded — Weekly Pipeline: Main Orchestrator
 *
 * Runs the full Saturday pipeline:
 *   1. Fetch Word doc from Google Drive
 *   2. Generate content via Claude API
 *   3. Ingest news items into Payload CMS
 *   4. Archive old articles (older than 4 weeks)
 *   5. Build and write newsletter HTML file
 *   6. Dispatch email to all subscribers
 *
 * Usage:
 *   node scripts/pipeline/run-weekly-pipeline.mjs
 *   node scripts/pipeline/run-weekly-pipeline.mjs --dry-run
 *   node scripts/pipeline/run-weekly-pipeline.mjs --week 15 --skip-email
 *
 * Environment variables required:
 *   AGENT_API_KEY              — pipeline authentication key
 *   ANTHROPIC_API_KEY          — Claude API key
 *   GOOGLE_SERVICE_ACCOUNT_KEY_PATH — path to GCP service account JSON
 *   NEXT_PUBLIC_SITE_URL       — e.g. https://aionboarded.ai
 *   AGENT_TEST_EMAIL           — email to use for dry-run preview
 */

import 'dotenv/config'
import { fetchLatestNewsDocument } from './fetch-gdrive.mjs'
import { generateWeeklyContent } from './generate-content.mjs'
import { buildNewsletterHtml, writeNewsletterHtml, updateArchivePage } from './build-newsletter-html.mjs'
import fs from 'fs'
import path from 'path'

// ── Parse CLI arguments ────────────────────────────────────
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const SKIP_EMAIL = args.includes('--skip-email') || DRY_RUN
const SKIP_INGEST = args.includes('--skip-ingest')
const SKIP_ARCHIVE = args.includes('--skip-archive')
const weekArgIndex = args.indexOf('--week')
const FORCE_WEEK = weekArgIndex !== -1 ? parseInt(args[weekArgIndex + 1], 10) : null

// ── Config ─────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'
const API_KEY = process.env.AGENT_API_KEY
const LOG_FILE = path.resolve('tmp-pipeline', `pipeline-${new Date().toISOString().slice(0, 10)}.log`)

// ── Logging ────────────────────────────────────────────────
function log(message) {
  const entry = `[${new Date().toISOString()}] ${message}`
  console.log(entry)
  fs.mkdirSync('tmp-pipeline', { recursive: true })
  fs.appendFileSync(LOG_FILE, entry + '\n', 'utf-8')
}

function logError(message, err) {
  const entry = `[${new Date().toISOString()}] ❌ ${message}: ${err?.message || err}`
  console.error(entry)
  fs.appendFileSync(LOG_FILE, entry + '\n', 'utf-8')
}

// ── Determine week number from current date ────────────────
function getCurrentWeekNumber() {
  // Week 1 = Jan 19, 2026
  const BASE_DATE = new Date('2026-01-19T00:00:00Z')
  const now = new Date()
  const diffMs = now.getTime() - BASE_DATE.getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, diffWeeks)
}

// ── Call pipeline API endpoint ─────────────────────────────
async function callApi(endpoint, body) {
  const response = await fetch(`${SITE_URL}/api/agent/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: API_KEY, ...body }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(`API ${endpoint} failed: ${data.error || response.statusText}`)
  }
  return data
}

// ── Main pipeline ──────────────────────────────────────────
async function runPipeline() {
  const startTime = Date.now()
  const weekNumber = FORCE_WEEK || getCurrentWeekNumber()
  const publishDate = new Date().toISOString()

  log(`═══════════════════════════════════════════`)
  log(`🚀 AI Onboarded Weekly Pipeline — Week ${weekNumber}`)
  log(`   Dry run: ${DRY_RUN} | Skip email: ${SKIP_EMAIL}`)
  log(`═══════════════════════════════════════════`)

  // Validate env
  if (!API_KEY) {
    logError('Missing AGENT_API_KEY', new Error('Set AGENT_API_KEY in .env'))
    process.exit(1)
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    logError('Missing ANTHROPIC_API_KEY', new Error('Set ANTHROPIC_API_KEY in .env'))
    process.exit(1)
  }

  // ── Step 1: Fetch document from Google Drive ──────────────
  log('Step 1/6 — Fetching Word document from Google Drive...')
  let docText
  try {
    const doc = await fetchLatestNewsDocument()
    docText = doc.text
    log(`✅ Fetched: "${doc.fileName}" (${doc.text.length} chars)`)
  } catch (err) {
    logError('Google Drive fetch failed', err)
    process.exit(1)
  }

  // ── Step 2: Generate content with Claude ──────────────────
  log('Step 2/6 — Generating content with Claude API...')
  let content
  try {
    content = await generateWeeklyContent(docText, weekNumber, publishDate)
    log(`✅ Generated: "${content.weekTheme}" — ${content.newsItems.length} items`)
    log(`   Subject: ${content.emailSubject}`)
    
    // Save generated content for review/debugging
    const contentPath = `tmp-pipeline/week-${weekNumber}-content.json`
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf-8')
    log(`   Content saved to ${contentPath}`)
  } catch (err) {
    logError('Content generation failed', err)
    process.exit(1)
  }

  // ── Step 3: Ingest news items into Payload CMS ────────────
  if (!SKIP_INGEST) {
    log(`Step 3/6 — Ingesting ${content.newsItems.length} news items into Payload CMS...`)
    try {
      const result = await callApi('ingest-news', {
        weekNumber,
        newsItems: content.newsItems,
      })
      log(`✅ Ingest complete: ${result.results?.filter(r => r.status === 'created').length} created, ${result.results?.filter(r => r.status === 'updated').length} updated`)
    } catch (err) {
      logError('News ingest failed', err)
      // Non-fatal — continue to build newsletter
    }
  } else {
    log('Step 3/6 — Skipped (--skip-ingest)')
  }

  // ── Step 4: Archive old articles ──────────────────────────
  if (!SKIP_ARCHIVE) {
    log('Step 4/6 — Archiving articles older than 4 weeks...')
    try {
      const result = await callApi('archive-news', { keepWeeks: 4 })
      log(`✅ Archived ${result.archivedCount} old articles`)
    } catch (err) {
      logError('Archive step failed (non-fatal)', err)
    }
  } else {
    log('Step 4/6 — Skipped (--skip-archive)')
  }

  // ── Step 5: Build newsletter HTML ─────────────────────────
  log('Step 5/6 — Building newsletter HTML...')
  try {
    const html = buildNewsletterHtml({
      weekNumber,
      weekTheme: content.weekTheme,
      newsletterIntro: content.newsletterIntro,
      newsletterHighlights: content.newsletterHighlights,
      newsItems: content.newsItems,
      weekToWatch: content.weekToWatch,
      publishDate,
    })
    const filePath = writeNewsletterHtml(weekNumber, html)
    updateArchivePage(
      weekNumber,
      content.weekTheme,
      content.newsletterHighlights.map(h => h.title),
      publishDate
    )
    log(`✅ Newsletter HTML built: ${filePath}`)

    if (DRY_RUN) {
      log(`   DRY RUN: Preview at ${SITE_URL}/newsletter/week-${weekNumber}.html`)
      log(`   (Deploy to server to view live)`)
    }
  } catch (err) {
    logError('Newsletter HTML build failed', err)
    process.exit(1)
  }

  // ── Step 6: Dispatch email campaign ───────────────────────
  if (!SKIP_EMAIL) {
    log('Step 6/6 — Dispatching email campaign...')
    try {
      const result = await callApi('dispatch-newsletter', {
        weekNumber,
        theme: content.weekTheme,
        subject: content.emailSubject,
        htmlBody: content.newsletterHtml,
        dryRun: DRY_RUN,
      })
      if (DRY_RUN) {
        log(`✅ DRY RUN email sent to ${process.env.AGENT_TEST_EMAIL}`)
      } else {
        log(`✅ Campaign dispatched — Sent: ${result.sent}, Failed: ${result.failed}`)
      }
    } catch (err) {
      logError('Email dispatch failed', err)
    }
  } else {
    log('Step 6/6 — Email skipped (--skip-email)')
  }

  // ── Done ──────────────────────────────────────────────────
  const elapsed = Math.round((Date.now() - startTime) / 1000)
  log(`═══════════════════════════════════════════`)
  log(`✅ Pipeline complete in ${elapsed}s — Week ${weekNumber}: "${content.weekTheme}"`)
  log(`   Newsletter: ${SITE_URL}/newsletter/week-${weekNumber}`)
  log(`═══════════════════════════════════════════`)
}

runPipeline().catch((err) => {
  console.error('Fatal pipeline error:', err)
  process.exit(1)
})
