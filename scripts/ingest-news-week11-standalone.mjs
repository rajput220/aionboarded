/**
 * AIOnboarded - Standalone News Ingest (Week 11)
 * Theme: From Models to Ecosystems — Week of March 30 – April 5, 2026
 * Self-contained: queries Postgres directly, no Payload CMS dependency.
 * Run inside Docker: node scripts/ingest-news-week11-standalone.mjs
 */

import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg
const DATABASE_URL = process.env.DATABASE_URL

// Auto-detect environment: Docker uses /app, local uses the project root
const IS_DOCKER = fs.existsSync('/app/package.json')
const PROJECT_ROOT = IS_DOCKER
    ? '/app'
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const MEDIA_DIR = path.join(PROJECT_ROOT, 'public', 'media')
const SEED_IMAGES_DIR = path.join(PROJECT_ROOT, 'seed', 'week11_images')

console.log(`🌍 Environment: ${IS_DOCKER ? 'Docker' : 'Local'}`)
console.log(`📁 Media dir: ${MEDIA_DIR}`)
console.log(`🖼️  Images dir: ${SEED_IMAGES_DIR}`)

const newsItems = [
    {
        title: "OpenAI Closes $122B Funding Round at $852B Valuation — Largest Private Raise in History",
        slug: "openai-122b-funding-852b-valuation-2026",
        excerpt: "Backed by SoftBank, Amazon ($50B), and Nvidia ($30B), OpenAI reaches $2B/month revenue and 900M weekly active users — reshaping the entire AI industry's competitive landscape.",
        sourceName: "Bloomberg",
        sourceUrl: "https://www.bloomberg.com/news/articles/2026-03-31/openai-closes-record-122-billion-funding-round-at-852-billion-valuation",
        publishedAt: "2026-03-31T00:00:00.000Z",
        featured: true,
        imageName: "image3.png",
        content: "On March 31, 2026, OpenAI closed the largest private funding round in history — $122 billion at an $852 billion valuation — co-led by SoftBank, with Amazon contributing $50 billion and Nvidia $30 billion. The company reports $2 billion in monthly revenue and 900 million weekly active users. Funds will be deployed primarily into compute infrastructure, data center buildout, and next-generation model training. This structural realignment concentrates compute, talent, and regulatory influence in ways that will shape AI development for the rest of the decade. For enterprise AI leaders, this signals OpenAI is building for a decade — plan your AI architecture around a multi-year horizon."
    },
    {
        title: "Google Releases Gemma 4: Open-Weight Frontier Models Shatter the Build vs. Buy Compromise",
        slug: "google-gemma-4-open-weight-frontier-models-2026",
        excerpt: "Apache 2.0 licensed, 31B parameters, 256K context window, native vision and audio — Gemma 4 gives enterprises a credible path to both frontier capability AND control for the first time.",
        sourceName: "Google AI Blog",
        sourceUrl: "https://blog.google/technology/ai/google-gemma-4-open-models/",
        publishedAt: "2026-04-02T00:00:00.000Z",
        featured: true,
        imageName: "image4.png",
        content: "On April 2, 2026, Google released Gemma 4, a family of open-weight models under the Apache 2.0 license with parameters ranging from 26 billion to 31 billion, 256,000-token context windows, native vision and audio capabilities, and explicit support for agentic workflows. The Apache 2.0 license allows unrestricted commercial use, modification, and redistribution. Google concurrently cut Veo 3.1 Lite video generation pricing by 50% ahead of an April 7 model repricing. Gemma 4 fundamentally changes the open-versus-closed calculus for enterprise AI — organizations can now deploy frontier-class multimodal AI on their own infrastructure without significant performance degradation."
    },
    {
        title: "The Always-On Agent Arrives: Anthropic Conway, Claude Computer Use for Windows, Google Workspace Flows",
        slug: "always-on-agent-anthropic-conway-workspace-flows-2026",
        excerpt: "Four simultaneous launches — Conway, Claude Computer Use on Windows, Workspace Flows, and OpenAI Codex 20+ integrations — mark the moment AI agents crossed from developer preview to enterprise deployment.",
        sourceName: "TechCrunch",
        sourceUrl: "https://techcrunch.com/2026/04/03/openai-codex-launches-20-integrations-pay-as-you-go-pricing",
        publishedAt: "2026-04-03T00:00:00.000Z",
        featured: true,
        imageName: "image5.png",
        content: "This week, four major agentic AI launches collectively signal that the enterprise threshold has been crossed. Anthropic's Conway is a persistent background AI with event-driven webhook triggers, native Chrome integration, and a third-party extensions ecosystem. Claude Computer Use expanded to Windows with full keyboard, mouse, and application control. Google Workspace Flows enables natural-language workflow creation spanning Gmail, Docs, and Sheets. OpenAI Codex now has 20+ integrations including Gmail, Slack, Figma, and Notion. Organizations that have deployed and iterated on agentic workflows for 90 days will have a compounding productivity advantage over teams still in evaluation."
    },
    {
        title: "Anthropic Acquires Coefficient Bio for $400M: The Biotech AI Pivot",
        slug: "anthropic-acquires-coefficient-bio-400m-biotech",
        excerpt: "A stealth computational biology startup of fewer than 10 people built by former Genentech scientists — this acquisition signals Anthropic's move from general-purpose AI into high-stakes drug discovery.",
        sourceName: "Reuters",
        sourceUrl: "https://www.reuters.com/technology/anthropic-acquires-stealth-biotech-startup-coefficient-bio-2026-04-01/",
        publishedAt: "2026-04-01T00:00:00.000Z",
        featured: true,
        imageName: "image6.png",
        content: "Anthropic's $400 million acquisition of Coefficient Bio represents more than a strategic pivot — it signals that frontier labs believe AI is ready to operate in domains where errors have biological consequences. Drug discovery, protein engineering, and molecular simulation are applications where AI outputs become inputs to clinical trials and regulatory submissions. Simultaneously, Microsoft's Copilot Critique and Council features — which use GPT-4 drafts, Claude critiques, and side-by-side synthesis — outperformed every single-model system on the DRACO research benchmark by 13.8 percent, validating multi-vendor adversarial AI design."
    },
    {
        title: "AI Accountability Enters Its Legal Phase: Meta/Google Verdict, Perplexity Lawsuit, GitHub Policy",
        slug: "ai-accountability-legal-phase-2026",
        excerpt: "An LA jury bypassed Section 230 by calling algorithms 'defective products.' Perplexity faces a class-action for sharing incognito sessions. GitHub's default opt-in for AI training starts April 24.",
        sourceName: "The Verge",
        sourceUrl: "https://www.theverge.com/2026/04/01/ai-product-liability-lawsuit-meta-google",
        publishedAt: "2026-04-01T00:00:00.000Z",
        featured: true,
        imageName: "image7.png",
        content: "Three legal and regulatory developments this week share a common thread: the voluntary phase of AI accountability is ending. An LA jury found Meta and Google liable for AI-driven addiction in minors — bypassing Section 230 immunity by ruling on algorithm design rather than content, classifying recommendation algorithms as 'defective products.' Perplexity faces a class-action alleging its AI search product secretly shares user conversations, including incognito sessions, with Meta and Google via hidden trackers. And GitHub's Copilot will default to opting individual accounts into AI training data starting April 24 — review your organization's GitHub accounts before that date."
    },
    {
        title: "EU AI Act Amended: Nudifier Ban Now, Watermarking by November 2026, High-Risk Delays to 2027-28",
        slug: "eu-ai-act-amendments-watermarking-2026",
        excerpt: "The EU's amendments deliver mixed signals: immediate 'nudifier' app bans and a November 2026 watermarking mandate, but high-risk compliance deadlines delayed to late 2027 and August 2028.",
        sourceName: "Euronews",
        sourceUrl: "https://www.euronews.com/next/2026/04/02/eu-ai-act-amendments-watermarking-mandate",
        publishedAt: "2026-04-02T00:00:00.000Z",
        featured: true,
        imageName: "image8.png",
        content: "The EU AI Act was amended this week, delivering both tightening and loosening of AI regulation. Immediate changes: nudifier applications are banned outright. By November 2026: machine-readable watermarking becomes legally required for all AI-generated media. High-risk AI system compliance deadlines are delayed to late 2027 and August 2028. Simultaneously, Anthropic's interpretability team published research showing that Claude Sonnet 4.5 exhibits emotion-like functional states — patterns of activation that influence model behavior across ethical and unethical actions. These findings have profound implications for how AI safety frameworks are constructed. If creating AI media for Europe, start procuring watermarking solutions now."
    },
    {
        title: "The Practitioner's Action Agenda: 5 Moves to Make This Week",
        slug: "practitioners-action-agenda-march-30-2026",
        excerpt: "Audit GitHub before April 24, pilot a real agent today, benchmark Gemma 4 against your highest-cost API use case, adopt multi-model workflows, and plan for EU watermarking.",
        sourceName: "AI Onboarded Weekly Strategy Dossier",
        sourceUrl: "https://aionboarded.ai/news",
        publishedAt: "2026-04-05T00:00:00.000Z",
        featured: false,
        imageName: "image9.png",
        content: "Five actionable moves for practitioners this week: (1) Audit your GitHub accounts before April 24 when Copilot's default opt-in training policy takes effect. (2) Pilot one of the three newly production-ready agentic tools — Claude Computer Use on Windows, Google Workspace Flows, or OpenAI Codex with 20+ integrations. (3) Run a Gemma 4 benchmark against your highest-volume closed-API use case and compare cost and quality. (4) Build a multi-model research habit — one model drafts, a different model critiques, you synthesize. (5) Begin procuring watermarking solutions for AI-generated media if you operate in the EU."
    },
    {
        title: "Week at a Glance: From Models to Ecosystems — March 30 to April 5, 2026",
        slug: "week-at-a-glance-march-30-2026",
        excerpt: "Capital concentration at sovereign scale, cross-stack agentic automation, and governance entering its legal phase — the three defining shifts of the week AI swallowed the enterprise stack.",
        sourceName: "AI Onboarded Weekly Strategy Dossier",
        sourceUrl: "https://aionboarded.ai/news",
        publishedAt: "2026-03-30T00:00:00.000Z",
        featured: false,
        imageName: "image2.png",
        content: "The week of March 30 – April 5, 2026 will be remembered as the week AI crossed from models to ecosystems. Three dominant themes: (1) Capital Concentration — OpenAI's $122B round at $852B valuation confirmed the AI infrastructure race is now a multi-hundred-billion-dollar competition. (2) Cross-Stack Automation — Microsoft, Google, and Anthropic simultaneously launched always-on agentic workflows, making AI the reorganizing principle of the enterprise. (3) High-Stakes Arena — Product liability verdicts, privacy lawsuits, and energy moratoriums prove AI is now a highly regulated ecosystem."
    },
    {
        title: "The Horizon: What to Watch Next — Liability Fallout, Video Price War, and the Policy Vacuum",
        slug: "horizon-watch-next-april-2026",
        excerpt: "Watch for copycat liability lawsuits, Google's April 7 Veo video price reduction, and how the White House reshuffles AI governance after David Sacks exits after just 130 days.",
        sourceName: "AI Onboarded Weekly Strategy Dossier",
        sourceUrl: "https://aionboarded.ai/news",
        publishedAt: "2026-04-05T00:00:00.000Z",
        featured: false,
        imageName: "image10.png",
        content: "Three forward-looking signals to monitor: (1) The Product Liability Fallout — expect a wave of copycat lawsuits targeting enterprise recommendation systems following the Meta/Google LA jury verdict that bypassed Section 230 by classifying algorithms as 'defective products.' (2) The Video AI Price War — watch the scheduled April 7 price reduction for Google's Veo 3.1 Fast, signaling aggressive push for enterprise video market share. (3) The Policy Vacuum — how the White House reshuffles AI governance priorities and industry oversight following David Sacks' exit as AI Czar after just 130 days in the role."
    }
]

async function ingestNews() {
    const client = new Client({ connectionString: DATABASE_URL })

    try {
        console.log('📰 Starting news ingestion for Week 11 (March 30 – April 5, 2026)...')
        await client.connect()

        if (!fs.existsSync(MEDIA_DIR)) {
            fs.mkdirSync(MEDIA_DIR, { recursive: true })
        }

        for (const item of newsItems) {
            console.log(`\n🔹 Processing: ${item.title}`)

            // Handle Image
            let imageId = null
            const sourcePath = path.join(SEED_IMAGES_DIR, item.imageName)
            const destPath = path.join(MEDIA_DIR, `w11_${item.imageName}`)
            const destFilename = `w11_${item.imageName}`

            if (fs.existsSync(sourcePath)) {
                console.log(`🖼️  Copying image: ${item.imageName}`)
                fs.copyFileSync(sourcePath, destPath)
                const stats = fs.statSync(destPath)

                const mediaCheck = await client.query(
                    'SELECT id FROM media WHERE filename = $1',
                    [destFilename]
                )

                if (mediaCheck.rows.length > 0) {
                    imageId = mediaCheck.rows[0].id
                    console.log(`✅ Media exists: ${imageId}`)
                } else {
                    const mediaRes = await client.query(
                        `INSERT INTO media (filename, alt, mime_type, filesize, url, updated_at, created_at)
                         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`,
                        [destFilename, item.title, 'image/png', stats.size, `/media/${destFilename}`]
                    )
                    imageId = mediaRes.rows[0].id
                    console.log(`✅ Image inserted: ${imageId}`)
                }
            } else {
                console.warn(`⚠️  Source image missing: ${sourcePath}`)
            }

            // Handle News Item
            const contentJson = {
                root: {
                    type: 'root',
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                        {
                            type: 'paragraph',
                            children: [{ type: 'text', text: item.content, format: 0, mode: 'normal' }]
                        }
                    ]
                }
            }

            const existing = await client.query(
                'SELECT id FROM news_items WHERE slug = $1',
                [item.slug]
            )

            if (existing.rows.length > 0) {
                console.log(`🔄 Updating: ${item.slug}`)
                await client.query(
                    `UPDATE news_items SET
                        title = $1, excerpt = $2, status = $3, published_at = $4,
                        source_name = $5, source_url = $6, featured = $7,
                        hero_image_id = $8, content = $9, updated_at = NOW()
                     WHERE slug = $10`,
                    [
                        item.title, item.excerpt, 'published', item.publishedAt,
                        item.sourceName, item.sourceUrl, item.featured,
                        imageId, JSON.stringify(contentJson), item.slug
                    ]
                )
            } else {
                console.log(`➕ Creating: ${item.slug}`)
                await client.query(
                    `INSERT INTO news_items (
                        title, slug, excerpt, status, published_at,
                        source_name, source_url, featured,
                        hero_image_id, content, updated_at, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
                    [
                        item.title, item.slug, item.excerpt, 'published', item.publishedAt,
                        item.sourceName, item.sourceUrl, item.featured,
                        imageId, JSON.stringify(contentJson)
                    ]
                )
            }
        }

        console.log('\n✅ Week 11 news ingestion complete!')
        process.exit(0)
    } catch (e) {
        console.error('❌ Error:', e.message)
        console.error(e.stack)
        process.exit(1)
    } finally {
        await client.end().catch(() => {})
    }
}

ingestNews()
