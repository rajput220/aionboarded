/**
 * AI Onboarded — Weekly Pipeline: Claude Content Generator
 *
 * Takes raw Word document text and calls the Claude API to produce:
 *   1. Structured news items (JSON, matching Payload CMS schema)
 *   2. Newsletter HTML (matching existing AI Onboarded template)
 *   3. Email subject line
 *   4. Weekly theme name
 *
 * Requires: @anthropic-ai/sdk
 *   pnpm add @anthropic-ai/sdk
 */

import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import fs from 'fs'

// ── System prompt ──────────────────────────────────────────
const SYSTEM_PROMPT = `You are the editorial AI for "AI Onboarded" — a weekly newsletter trusted by 150+ AI practitioners.

Your job: read a Word document of raw AI news notes and produce polished, publication-ready content.

Editorial voice: Crisp, insightful, accessible, and practical. Never hype. Every claim must come from the source document. Use clear, confident business language. Avoid buzzwords.

Output ONLY valid JSON matching the schema provided. No markdown, no explanation, no preamble.`

// ── User prompt with the schema ───────────────────────────
function buildUserPrompt(rawText, weekNumber, publishDate) {
  return `
Task: Read the AI news document below and create a complete weekly content package for AI Onboarded Week ${weekNumber}.

Visual Theme (for newsletter):
- Background: Deep midnight navy blue
- Accent: Glowing teal/cyan digital sine wave on right side
- Branding: Top-left corner empty for AI Onboarded circular metallic logo
- Bottom-right: Clear of text and watermarks
- Typography: Left-aligned clean white sans-serif, bold headers

Content requirements per news item:
- Summarise the most important AI news from the document
- Explain "Why it Matters" for each story
- Highlight Business, Technical, and Societal impacts
- Identify emerging trends and Responsible AI/Governance updates
- Tone: crisp, insightful, accessible, practical. Avoid hype.
- Base everything ONLY on the uploaded Word file content

Return a single valid JSON object with this EXACT schema:

{
  "weekNumber": ${weekNumber},
  "weekTheme": "<catchy 3-5 word theme that captures this week's AI narrative>",
  "emailSubject": "<compelling email subject line with relevant emoji, max 60 chars>",
  "newsletterIntro": "<2-3 sentence punchy intro for the hero section, referencing the week's biggest stories>",
  "newsletterHighlights": [
    { "title": "<story name>", "description": "<1 sentence summary>" }
  ],
  "weekToWatch": "<2-3 sentences: What to Watch Next Week — forward-looking, specific>",
  "newsItems": [
    {
      "title": "<headline: factual, specific, under 80 chars>",
      "slug": "<url-safe-lowercase-slug>",
      "excerpt": "<50-80 word summary suitable for website news card>",
      "content": "<full article text with paragraphs separated by \\n\\n — include context, key points as bullet points formatted as plain text, and implications>",
      "whyItMatters": "<1-2 sentences explaining business/technical/societal significance>",
      "sourceName": "<publication name from document>",
      "sourceUrl": "<URL from document, or empty string if not provided>",
      "publishedAt": "${publishDate}",
      "featured": <true for the 5 most important stories, false otherwise>,
      "category": "<one of: OpenAI | Anthropic | Google | Microsoft | Meta | Governance | Security | Research | Industry>"
    }
  ],
  "newsletterHtml": "<complete HTML email body using the template below>"
}

For newsletterHtml, generate a complete, EMAIL-CLIENT-SAFE HTML email body. All styles MUST be inline. Use this EXACT structure:

1. Header bar: AI Onboarded logo text left, "Week ${weekNumber}" badge right. Background white, border-bottom 1px solid #e2e8f0.

2. Hero block: gradient background (linear-gradient(135deg, #0a84ff, #1db954)), white text. Show "📡 Weekly AI Brief · Week ${weekNumber}", the weekTheme as h1, and a 1-2 sentence intro.

3. CTA button (REQUIRED, centered): Large button linking to https://aionboarded.ai/newsletter/week-${weekNumber}.html with text "Read the Full Newsletter →". Style: background: linear-gradient(135deg, #0a84ff, #1db954); color: white; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; text-decoration: none; display: inline-block.

4. Top Stories section heading, then for each of the top 5 news items include:
   - Story title as a CLICKABLE LINK: <a href="https://aionboarded.ai/news/SLUG" style="color:#0a84ff;font-weight:700;font-size:17px;text-decoration:none;">TITLE</a>
   - Reading time estimate (e.g. "3 min read")
   - 1-sentence excerpt
   - "Why It Matters:" in green bold, followed by the whyItMatters text
   - A "Read more →" link to https://aionboarded.ai/news/SLUG
   Use the actual slug from the newsItems array for each story's URL.

5. Second CTA button (same style as above): "View All Week ${weekNumber} Stories →" linking to https://aionboarded.ai/newsletter/week-${weekNumber}.html

6. Community section: dark background (#0f172a), white text. WhatsApp link (https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ) and Discord link (https://discord.com/invite/SW4HZAv37) as styled buttons.

7. Footer: dark background, small text. "© 2026 AI Onboarded" left, "Visit aionboarded.ai" right. Unsubscribe notice.

HTML email rules (CRITICAL):
- ALL CSS must be INLINE on each element (no <style> blocks, no CSS classes)
- Font: font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Max width: 600px, margin: 0 auto
- Colors: primary #0A84FF, accent #1DB954, dark #0f172a
- Every <a href> MUST use a full absolute https:// URL — NO relative paths, NO anchor (#) links
- Use <table> layouts for email client compatibility where needed

Source document:
---
${rawText}
---
`
}

// ── Call Claude API ────────────────────────────────────────
export async function generateWeeklyContent(rawDocumentText, weekNumber, publishDate) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const date = publishDate || new Date().toISOString()

  console.log(`[Claude] Generating content for Week ${weekNumber}...`)
  console.log(`[Claude] Document length: ${rawDocumentText.length} characters`)

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(rawDocumentText, weekNumber, date),
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  console.log(`[Claude] Response received. Input tokens: ${message.usage.input_tokens}, Output: ${message.usage.output_tokens}`)

  // Parse JSON — strip any accidental markdown code fences
  const cleaned = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch (e) {
    console.error('[Claude] Failed to parse JSON response. Raw output saved to tmp-pipeline/last-response.txt')
    fs.mkdirSync('tmp-pipeline', { recursive: true })
    fs.writeFileSync('tmp-pipeline/last-response.txt', responseText, 'utf-8')
    throw new Error(`Claude returned invalid JSON. See tmp-pipeline/last-response.txt for details.`)
  }

  console.log(`[Claude] Generated ${parsed.newsItems?.length || 0} news items. Theme: "${parsed.weekTheme}"`)
  return parsed
}

// ── CLI entrypoint (for testing with a local file) ─────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const testFile = process.argv[2]
  if (!testFile) {
    console.error('Usage: node generate-content.mjs <path-to-text.txt> [weekNumber]')
    process.exit(1)
  }

  const text = fs.readFileSync(testFile, 'utf-8')
  const weekNum = parseInt(process.argv[3] || '15', 10)

  const content = await generateWeeklyContent(text, weekNum)

  fs.mkdirSync('tmp-pipeline', { recursive: true })
  const outputPath = `tmp-pipeline/week-${weekNum}-content.json`
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), 'utf-8')
  console.log(`\n[Claude] Content saved to ${outputPath}`)
  console.log(`Theme: ${content.weekTheme}`)
  console.log(`Subject: ${content.emailSubject}`)
  console.log(`News items: ${content.newsItems.length}`)
}
