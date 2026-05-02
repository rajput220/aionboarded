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

For newsletterHtml, generate a complete HTML email body using this template structure:
- Greeting: Hi {{firstName}},
- Hero paragraph (bold theme intro)
- "In this week's edition, we cover <theme> — highlights include:" followed by <ul> with 5 bullet points
- A prominent CTA button: Read the Full Week ${weekNumber} Newsletter → https://aionboarded.ai/newsletter/week-${weekNumber}
- Community section with WhatsApp (https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ) and Discord (https://discord.com/invite/SW4HZAv37) links
- Footer: unsubscribe notice, "The AI Onboarded Team", aionboarded.ai

HTML email style (inline):
- Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Max width: 600px, centered
- Colors: primary #0A84FF, accent #1DB954
- CTA button: background linear-gradient(135deg, #0A84FF, #1DB954), white text, border-radius 12px

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
