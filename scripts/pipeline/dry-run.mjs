/**
 * AI Onboarded — Standalone Dry Run
 *
 * Runs the full pipeline locally without needing the web server:
 *   1. Fetch Word doc from Google Drive
 *   2. Generate content via Claude API
 *   3. Build newsletter HTML file
 *   4. Send preview email via Resend directly
 *
 * Usage: node scripts/pipeline/dry-run.mjs
 */

import 'dotenv/config'
import { fetchLatestNewsDocument } from './fetch-gdrive.mjs'
import { generateWeeklyContent } from './generate-content.mjs'
import { buildNewsletterHtml, writeNewsletterHtml, updateArchivePage } from './build-newsletter-html.mjs'
import { Resend } from 'resend'
import fs from 'fs'

const TEST_EMAIL = process.env.AGENT_TEST_EMAIL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'

// Week number: auto-detect from date (Week 1 = Jan 4, 2026)
function getWeekNumber() {
  const BASE = new Date('2026-01-04T00:00:00Z')
  const diff = Date.now() - BASE.getTime()
  return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1)
}

async function dryRun() {
  const weekNumber = parseInt(process.argv[2] || getWeekNumber(), 10)
  const publishDate = new Date().toISOString()

  console.log('\n🚀 AI Onboarded — Dry Run')
  console.log(`   Week: ${weekNumber}`)
  console.log(`   Preview email: ${TEST_EMAIL}`)
  console.log('─'.repeat(50))

  // ── Step 1: Fetch from Google Drive ─────────────────────
  console.log('\n📂 Step 1/4 — Fetching Word doc from Google Drive...')
  const doc = await fetchLatestNewsDocument()
  console.log(`✅ Got: "${doc.fileName}" (${doc.text.length} chars)`)

  // ── Step 2: Generate with Claude ────────────────────────
  console.log('\n🤖 Step 2/4 — Generating content with Claude...')
  console.log('   (This takes ~30-60 seconds)')
  const content = await generateWeeklyContent(doc.text, weekNumber, publishDate)

  console.log(`\n✅ Generated!`)
  console.log(`   Theme:   "${content.weekTheme}"`)
  console.log(`   Subject: "${content.emailSubject}"`)
  console.log(`   Items:   ${content.newsItems.length} news items`)

  // Save full output for review
  fs.mkdirSync('tmp-pipeline', { recursive: true })
  const jsonPath = `tmp-pipeline/week-${weekNumber}-dry-run.json`
  fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2), 'utf-8')
  console.log(`   Saved:   ${jsonPath}`)

  // ── Step 3: Build newsletter HTML ───────────────────────
  console.log('\n📄 Step 3/4 — Building newsletter HTML...')
  const html = buildNewsletterHtml({
    weekNumber,
    weekTheme: content.weekTheme,
    newsletterIntro: content.newsletterIntro,
    newsletterHighlights: content.newsletterHighlights,
    newsItems: content.newsItems,
    weekToWatch: content.weekToWatch,
    publishDate,
  })
  const htmlPath = writeNewsletterHtml(weekNumber, html)
  updateArchivePage(weekNumber, content.weekTheme, publishDate)
  console.log(`✅ Built: ${htmlPath}`)

  // ── Step 4: Send preview email ──────────────────────────
  console.log(`\n📧 Step 4/4 — Sending preview email to ${TEST_EMAIL}...`)

  if (!TEST_EMAIL) {
    console.log('⚠️  AGENT_TEST_EMAIL not set — skipping email.')
  } else if (!process.env.RESEND_API_KEY) {
    console.log('⚠️  RESEND_API_KEY not set — skipping email.')
  } else {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Personalise with your name
    const previewHtml = content.newsletterHtml.replace(/\{\{firstName\}\}/g, 'Sanjay')

    const { error } = await resend.emails.send({
      from: 'AI Onboarded <newsletter@aionboarded.ai>',
      to: TEST_EMAIL,
      subject: `[DRY RUN PREVIEW] ${content.emailSubject}`,
      html: previewHtml,
    })

    if (error) {
      console.error('❌ Email failed:', error)
    } else {
      console.log(`✅ Preview email sent to ${TEST_EMAIL}`)
    }
  }

  // ── Summary ──────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50))
  console.log(`✅ Dry run complete — Week ${weekNumber}: "${content.weekTheme}"`)
  console.log(`\n   📰 News items generated: ${content.newsItems.length}`)
  console.log(`   📄 Newsletter HTML: public/newsletter/week-${weekNumber}.html`)
  console.log(`   🌐 Live URL (after deploy): ${SITE_URL}/newsletter/week-${weekNumber}`)
  console.log(`   📧 Preview email: ${TEST_EMAIL}`)
  console.log(`   📁 Full content JSON: tmp-pipeline/week-${weekNumber}-dry-run.json`)
  console.log('\n   ✨ Check your inbox — then review the JSON to see all generated content.')
  console.log('═'.repeat(50) + '\n')
}

dryRun().catch((err) => {
  console.error('\n❌ Dry run failed:', err.message)
  if (err.stack) console.error(err.stack)
  process.exit(1)
})
