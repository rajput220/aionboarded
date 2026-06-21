/**
 * AI Onboarded — Weekly Pipeline: Newsletter HTML Builder
 *
 * Generates the static week-XX.html file that lives at:
 *   public/newsletter/week-XX.html
 * and updates the newsletter archive page.
 *
 * This matches the exact design of existing week-14.html.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const NEWSLETTER_DIR = path.join(PROJECT_ROOT, 'public', 'newsletter')
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'

// ── Reading time estimator (220 wpm average) ──────────────
function readingTime(item) {
  const words = [item.content || '', item.excerpt || '', item.whyItMatters || '']
    .join(' ')
    .trim()
    .split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 220))
  return `${mins} min read`
}

// ── Build the full newsletter HTML page ───────────────────
export function buildNewsletterHtml({
  weekNumber,
  weekTheme,
  newsletterIntro,
  newsletterHighlights,
  newsItems,
  weekToWatch,
  publishDate,
}) {
  const dateFormatted = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const storyCardsHtml = newsItems
    .slice(0, 12)
    .map(
      (item, i) => `
    <article class="story-card" id="story-${i + 1}">
      <div class="story-card-body">
        <div class="story-card-meta">
          <span class="story-card-tag">${item.category || 'AI News'}</span>
          <span class="story-card-readtime">🕐 ${readingTime(item)}</span>
        </div>
        <h2 class="story-card-headline">${escapeHtml(item.title)}</h2>
        <p class="story-card-summary">${escapeHtml(item.excerpt)}</p>
        ${
          item.whyItMatters
            ? `<div class="story-card-whyitmatters">
            <strong>⚡ Why It Matters:</strong> ${escapeHtml(item.whyItMatters)}
          </div>`
            : ''
        }
        ${
          item.sourceUrl
            ? `<a href="${item.sourceUrl}" target="_blank" rel="noopener" class="story-source">
            📰 ${escapeHtml(item.sourceName || 'Source')} →
          </a>`
            : ''
        }
      </div>
    </article>`,
    )
    .join('\n')

  const tocItemsHtml = newsItems
    .slice(0, 12)
    .map(
      (item, i) => `
      <li><a href="#story-${i + 1}">${escapeHtml(item.title)}</a></li>`,
    )
    .join('\n')

  const highlightsHtml = newsletterHighlights
    .map(
      (h) =>
        `<li style="margin-bottom: 8px;"><strong>${escapeHtml(h.title)}:</strong> ${escapeHtml(h.description)}</li>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(weekTheme)} — Week ${weekNumber} | AI Onboarded</title>
    <meta name="description" content="${escapeHtml(newsletterIntro.slice(0, 160))}" />
    <meta property="og:title" content="${escapeHtml(weekTheme)} — Week ${weekNumber} | AI Onboarded" />
    <meta property="og:description" content="${escapeHtml(newsletterIntro.slice(0, 160))}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${SITE_URL}/newsletter/week-${weekNumber}" />
    <link rel="canonical" href="${SITE_URL}/newsletter/week-${weekNumber}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <style>
      :root {
        --primary: #0a84ff; --primary-dark: #0066cc; --accent: #1db954;
        --dark: #0f172a; --dark-700: #334155; --dark-600: #475569;
        --gray: #64748b; --gray-light: #94a3b8; --light: #f8fafc;
        --light-200: #e2e8f0; --white: #ffffff;
        --gradient-primary: linear-gradient(135deg, #0a84ff, #1db954);
        --gradient-hero: linear-gradient(135deg, #0a84ff 0%, #0066cc 40%, #1db954 100%);
        --gradient-dark: linear-gradient(135deg, #0f172a, #1e293b);
        --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
        --shadow-md: 0 4px 12px rgba(0,0,0,.1);
        --shadow-lg: 0 8px 30px rgba(0,0,0,.12);
        --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px;
        --transition: all .3s cubic-bezier(.4,0,.2,1);
        --max-width: 1200px;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--light); color: var(--dark); line-height: 1.7; font-size: 16px; }
      a { color: var(--primary); text-decoration: none; transition: var(--transition); }
      a:hover { color: var(--primary-dark); }
      .container { max-width: var(--max-width); margin: 0 auto; padding: 0 24px; }

      /* Header */
      .newsletter-header { background: rgba(255,255,255,.92); border-bottom: 1px solid var(--light-200); padding: 14px 0; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); }
      .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
      .header-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
      .header-logo-icon { width: 36px; height: 36px; background: var(--gradient-primary); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 16px; flex-shrink: 0; }
      .header-logo-text { font-weight: 700; font-size: 17px; color: var(--dark); }
      .header-logo-text span { color: var(--primary); }
      /* Site nav */
      .site-nav { display: flex; align-items: center; gap: 4px; }
      .site-nav a { font-size: 14px; font-weight: 500; color: var(--dark-600); padding: 6px 12px; border-radius: var(--radius-sm); transition: var(--transition); white-space: nowrap; }
      .site-nav a:hover { background: var(--light-200); color: var(--dark); }
      .site-nav a.active { background: linear-gradient(135deg,rgba(10,132,255,.1),rgba(29,185,84,.1)); color: var(--primary); }
      .header-right { display: flex; align-items: center; gap: 12px; }
      @media (max-width: 640px) { .site-nav { display: none; } }
      .header-meta { display: flex; align-items: center; gap: 16px; font-size: 14px; color: var(--gray); }
      .header-badge { background: var(--gradient-primary); color: white; padding: 4px 14px; border-radius: 20px; font-weight: 600; font-size: 13px; }

      /* Hero */
      .hero { background: var(--gradient-hero); padding: 80px 0; position: relative; overflow: hidden; }
      .hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 20% 80%, rgba(29,185,84,.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(10,132,255,.2) 0%, transparent 50%); }
      .hero-inner { position: relative; z-index: 1; }
      .hero-content { color: white; max-width: 720px; }
      .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,.15); backdrop-filter: blur(8px); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; border: 1px solid rgba(255,255,255,.2); }
      .hero-title { font-size: 42px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.5px; }
      .hero-subtitle { font-size: 18px; line-height: 1.6; opacity: .9; max-width: 600px; font-weight: 300; }

      /* Section */
      .section { padding: 64px 0; }
      .section-header { text-align: center; margin-bottom: 48px; }
      .section-label { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, rgba(10,132,255,.08), rgba(29,185,84,.08)); color: var(--primary); padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
      .section-title { font-size: 32px; font-weight: 800; color: var(--dark); letter-spacing: -.3px; }
      .section-title span { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

      /* Story cards */
      .stories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 32px; }
      .story-card { background: var(--white); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--light-200); transition: var(--transition); display: flex; flex-direction: column; }
      .story-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: rgba(10,132,255,.2); }
      .story-card-body { padding: 28px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
      .story-card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .story-card-tag { display: inline-block; background: linear-gradient(135deg, rgba(10,132,255,.1), rgba(29,185,84,.1)); color: var(--primary); padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
      .story-card-readtime { font-size: 12px; color: var(--gray); font-weight: 500; }
      .story-card-headline { font-size: 21px; font-weight: 700; line-height: 1.35; color: var(--dark); }
      .story-card-summary { font-size: 15px; line-height: 1.7; color: var(--dark-600); flex: 1; }
      .story-card-whyitmatters { padding: 14px 16px; background: linear-gradient(135deg, rgba(10,132,255,.04), rgba(29,185,84,.04)); border-left: 3px solid var(--accent); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 13px; color: var(--dark-700); line-height: 1.6; }
      .story-card-whyitmatters strong { color: #17a34a; }
      .story-source { font-size: 13px; color: var(--gray); margin-top: 4px; }
      .story-source:hover { color: var(--primary); }

      /* TOC */
      .toc { background: var(--white); border-radius: var(--radius-lg); padding: 28px 32px; margin-bottom: 48px; box-shadow: var(--shadow-sm); border: 1px solid var(--light-200); }
      .toc-title { font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 16px; }
      .toc-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 6px; list-style: none; }
      .toc-list li a { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--radius-sm); font-size: 14px; color: var(--dark-600); transition: var(--transition); }
      .toc-list li a:hover { background: rgba(10,132,255,.06); color: var(--primary); }
      .toc-list li a::before { content: "→"; color: var(--primary); font-weight: 600; }

      /* What to watch */
      .watch-next { background: var(--gradient-dark); border-radius: var(--radius-lg); padding: 40px; color: white; margin: 64px 0; }
      .watch-next h2 { font-size: 24px; font-weight: 800; margin-bottom: 16px; }
      .watch-next p { font-size: 16px; line-height: 1.7; opacity: .9; }

      /* Community */
      .community { background: var(--gradient-dark); padding: 64px 0; text-align: center; }
      .community-title { font-size: 28px; font-weight: 800; color: white; margin-bottom: 10px; }
      .community-subtitle { font-size: 16px; color: var(--gray-light); margin-bottom: 36px; }
      .community-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
      .btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; transition: var(--transition); text-decoration: none; }
      .btn-whatsapp { background: #25d366; color: white; }
      .btn-whatsapp:hover { background: #20bd5a; transform: translateY(-2px); color: white; }
      .btn-discord { background: #5865f2; color: white; }
      .btn-discord:hover { background: #4752c4; transform: translateY(-2px); color: white; }
      .btn-website { background: rgba(255,255,255,.1); color: white; border: 1px solid rgba(255,255,255,.2); }
      .btn-website:hover { background: rgba(255,255,255,.2); transform: translateY(-2px); color: white; }

      /* Footer */
      .newsletter-footer { background: var(--dark); color: var(--gray-light); padding: 48px 0 32px; }
      .footer-bottom { border-top: 1px solid var(--dark-700); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--gray); margin-top: 32px; }

      @media (max-width: 768px) {
        .hero { padding: 48px 0; }
        .hero-title { font-size: 28px; }
        .stories-grid { grid-template-columns: 1fr; }
        .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
      }
    </style>
  </head>
  <body>

    <!-- Header -->
    <header class="newsletter-header">
      <div class="container">
        <div class="header-inner">
          <a href="${SITE_URL}" class="header-logo">
            <div class="header-logo-icon">AI</div>
            <span class="header-logo-text">AI <span>Onboarded</span></span>
          </a>
          <nav class="site-nav">
            <a href="${SITE_URL}">Home</a>
            <a href="${SITE_URL}/news">News</a>
            <a href="${SITE_URL}/newsletter" class="active">Newsletter</a>
            <a href="${SITE_URL}/podcast">Podcast</a>
            <a href="${SITE_URL}/#subscribe">Subscribe</a>
            <a href="${SITE_URL}/#contact">Contact Us</a>
          </nav>
          <div class="header-right">
            <span style="font-size:13px;color:var(--gray)">${dateFormatted}</span>
            <span class="header-badge">Week ${weekNumber}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="hero-inner">
          <div class="hero-content">
            <div class="hero-eyebrow">📡 Weekly AI Brief · Week ${weekNumber}</div>
            <h1 class="hero-title">${escapeHtml(weekTheme)}</h1>
            <p class="hero-subtitle">${escapeHtml(newsletterIntro)}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stories -->
    <section class="section">
      <div class="container">

        <!-- TOC -->
        <nav class="toc">
          <p class="toc-title">📋 This Week's Stories</p>
          <ul class="toc-list">
            ${tocItemsHtml}
          </ul>
        </nav>

        <div class="section-header">
          <span class="section-label">🔍 Week ${weekNumber} Coverage</span>
          <h2 class="section-title">This Week in <span>Artificial Intelligence</span></h2>
        </div>

        <div class="stories-grid">
          ${storyCardsHtml}
        </div>

      </div>
    </section>

    <!-- What to Watch -->
    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="watch-next">
          <h2>🔭 What to Watch Next Week</h2>
          <p>${escapeHtml(weekToWatch)}</p>
        </div>
      </div>
    </section>

    <!-- Community -->
    <section class="community">
      <div class="container">
        <h2 class="community-title">Join the AI Onboarded Community</h2>
        <p class="community-subtitle">Connect with 150+ AI practitioners sharing strategic insights and staying ahead of the curve.</p>
        <div class="community-buttons">
          <a href="https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ" class="btn btn-whatsapp">💬 WhatsApp Group</a>
          <a href="https://discord.com/invite/SW4HZAv37" class="btn btn-discord">🎮 Discord Server</a>
          <a href="${SITE_URL}" class="btn btn-website">🌐 Visit Website</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="newsletter-footer">
      <div class="container">
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} AI Onboarded. All rights reserved.</span>
          <a href="${SITE_URL}/newsletter" style="color: var(--gray-light);">Newsletter Archive</a>
        </div>
      </div>
    </footer>

  </body>
</html>`
}

// ── Write newsletter HTML to disk ─────────────────────────
export function writeNewsletterHtml(weekNumber, html) {
  const filePath = path.join(NEWSLETTER_DIR, `week-${weekNumber}.html`)
  fs.writeFileSync(filePath, html, 'utf-8')
  console.log(`[Builder] Newsletter HTML written to ${filePath}`)
  return filePath
}

// ── Update the newsletter archive page.tsx ─────────────────
export function updateArchivePage(weekNumber, weekTheme, highlights, publishDate) {
  const pagePath = path.join(PROJECT_ROOT, 'src', 'app', '(frontend)', 'newsletter', 'page.tsx')

  if (!fs.existsSync(pagePath)) {
    console.warn('[Builder] newsletter/page.tsx not found — skipping archive update')
    return
  }

  const content = fs.readFileSync(pagePath, 'utf-8')

  // Don't add if already present
  if (content.includes(`week: ${weekNumber},`)) {
    console.log(`[Builder] Week ${weekNumber} already in archive — skipping`)
    return
  }

  const dateFormatted = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // Build the highlights array string
  // Sanitize: strip single-line comments (//) and newlines that would break the string literal
  const highlightsStr = (highlights || [])
    .slice(0, 4)
    .map(h => {
      const safe = String(h)
        .replace(/\/\/.*/g, '')   // strip // comments
        .replace(/[\r\n]+/g, ' ') // collapse newlines to space
        .replace(/'/g, "\\'")     // escape single quotes
        .trim()
      return `            '${safe}',`
    })
    .join('\n')

  const newEntry = `    {
        week: ${weekNumber},
        slug: 'week-${weekNumber}',
        title: '${weekTheme.replace(/'/g, "\\'")}',
        subtitle: 'Week ${weekNumber} AI Intelligence Briefing',
        dateRange: '${dateFormatted}',
        theme: '${weekTheme.replace(/'/g, "\\'")}',
        highlights: [
${highlightsStr}
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-${weekNumber}.html',
    },\n`

  // Insert immediately after the "const newsletters = [" opening line
  // Use a fixed-string replacement (not regex) to avoid any comment/special-char issues
  const MARKER = 'const newsletters = [\n'
  if (!content.includes(MARKER)) {
    console.warn('[Builder] Could not find newsletters array marker — skipping archive update')
    return
  }

  const updated = content.replace(MARKER, `${MARKER}${newEntry}`)
  fs.writeFileSync(pagePath, updated, 'utf-8')

  console.log(`[Builder] newsletter/page.tsx updated with Week ${weekNumber}: "${weekTheme}"`)
}

// ── Helpers ────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
