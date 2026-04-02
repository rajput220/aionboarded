/**
 * AIOnboarded - Standalone News Ingest (Week 10)
 * Self-contained: queries Postgres directly, no Payload CMS dependency.
 * Run inside the Docker container with: node scripts/ingest-news-week10-standalone.mjs
 */

import pg from 'pg'
import fs from 'fs'
import path from 'path'

const { Client } = pg
const DATABASE_URL = process.env.DATABASE_URL
const MEDIA_DIR = '/app/public/media'
const SEED_IMAGES_DIR = '/app/seed/week10_images'

// News content from DOCX report
const newsItems = [
    {
        title: "White House National AI Policy Framework: Federal Preemption Revealed",
        slug: "white-house-national-ai-policy-framework-2026",
        excerpt: "The U.S. government's new framework prioritizes federal oversight, preempting state-level AI regulations to accelerate American AI dominance.",
        sourceName: "WilmerHale Privacy Blog",
        sourceUrl: "https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20260323-white-house-releases-national-policy-framework-for-artificial-intelligence",
        publishedAt: "2026-03-23T00:00:00.000Z",
        featured: true,
        imageName: "image6.png",
        content: "The U.S. government released the National Policy Framework for Artificial Intelligence on March 20, 2026. A comprehensive blueprint for federal AI governance that prioritizes American AI dominance and recommends preempting state-level AI regulations. The framework targets state-level safety mandates as barriers to innovation, seeking a single federal standard for frontier model oversight."
    },
    {
        title: "Claude Mythos Leak: Anthropic's 'Capybara' Tier Exposed",
        slug: "claude-mythos-capybara-leak",
        excerpt: "A configuration error in Anthropic's CMS revealed 'Claude Mythos', a new tier above Opus, significantly more capable in software coding and cybersecurity.",
        sourceName: "Fortune",
        sourceUrl: "https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/",
        publishedAt: "2026-03-26T00:00:00.000Z",
        featured: true,
        imageName: "image5.png",
        content: "On March 28, 2026, an internal error made documentation of an unreleased model codenamed Claude Mythos discoverable. Representing the first entry into a new capability tier called 'Capybara', it sits above the current Opus flagship with step-change performance in academic reasoning and cybersecurity tasks."
    },
    {
        title: "Anthropic vs. Pentagon: The Legal Battle for AI Ethics",
        slug: "anthropic-vs-pentagon-lawsuit",
        excerpt: "Anthropic has sued the DoD after being blacklisted for refusing to allow Claude's use in autonomous lethal weapons systems.",
        sourceName: "State of Surveillance",
        sourceUrl: "https://stateofsurveillance.org/news/anthropic-pentagon-supply-chain-risk-amicus-tech-coalition-2026/",
        publishedAt: "2026-03-23T00:00:00.000Z",
        featured: true,
        imageName: "image10.png",
        content: "Anthropic sued the U.S. Department of Defense after being designated a supply-chain risk. The dispute centers on Anthropic's safety charter, which prohibits lethal action without human intervention. The case will determine if private AI safety charters have legal standing against national security mandates."
    },
    {
        title: "OpenAI Acquires Astral: Command of the Python Development Stack",
        slug: "openai-acquires-astral-python-tools",
        excerpt: "OpenAI has acquired the creator of high-performance Python tools like uv and Ruff, aiming to control the software development lifecycle.",
        sourceName: "InfoWorld",
        sourceUrl: "https://www.infoworld.com/article/4147837/openai-buys-python-tools-builder-astral.html",
        publishedAt: "2026-03-19T00:00:00.000Z",
        featured: true,
        imageName: "image8.png",
        content: "OpenAI announced the acquisition of Astral, the startup behind 'uv' and 'Ruff'. OpenAI plans to integrate these tools directly into its Codex models, allowing AI agents to plan changes, lint, and verify code autonomously before human review."
    },
    {
        title: "Anthropic 'Computer Use' for Mac: The Agentic Productivity Leap",
        slug: "anthropic-computer-use-mac-2026",
        excerpt: "New 'Computer Use' feature allows Claude to view screens, click, and type to complete task across any software on a user's Mac.",
        sourceName: "The New Stack",
        sourceUrl: "https://thenewstack.io/anthropic-march-2026-roundup/",
        publishedAt: "2026-03-23T00:00:00.000Z",
        featured: true,
        imageName: "image2.png",
        content: "Anthropic released a research preview allowing Claude to interact with user interfaces directly. By seeing the screen, moving the cursor, and typing, Claude can now complete multi-step tasks across legacy software and proprietary tools that lack official AI APIs."
    },
    {
        title: "Microsoft and Nvidia Partner on AI-Driven Nuclear Energy",
        slug: "microsoft-nvidia-ai-nuclear-partnership",
        excerpt: "Tech giants team up to use Azure AI and digital twins to accelerate nuclear reactor design and permitting to power future AI growth.",
        sourceName: "Microsoft Industry Blog",
        sourceUrl: "https://www.microsoft.com/en-us/industry/blog/content-type/news-and-announcements/",
        publishedAt: "2026-03-24T00:00:00.000Z",
        featured: true,
        imageName: "image7.png",
        content: "Microsoft and Nvidia announced a partnership to use AI for building nuclear energy infrastructure. Digital Twin technology will simulate safety tests and performance, potentially cutting years off permitting. This energy-compute co-design aims to solve the energy wall threatening AI scaling."
    },
    {
        title: "MiniMax M2.5: Chinese AI Disrupts Western Pricing Models",
        slug: "minimax-m2-5-chinese-ai-cost-war",
        excerpt: "New model M2.5 rivals Claude Opus performance at one-tenth the cost, triggering a commoditization surge in the global AI market.",
        sourceName: "Mean CEO Blog",
        sourceUrl: "https://blog.mean.ceo/new-ai-model-releases-news-march-2026/",
        publishedAt: "2026-03-25T00:00:00.000Z",
        featured: true,
        imageName: "image3.png",
        content: "MiniMax M2.5 released with performance rivaling Claude Opus in coding and agentic tasks but at one-tenth the operational cost. This triggers a global cost war, enabling startups to build complex agentic workflows previously too expensive to scale."
    },
    {
        title: "Strategic Insight: Apple's Platform Broker Strategy",
        slug: "apple-platform-broker-strategy",
        excerpt: "By owning the daily touchpoint for 2 billion users, Apple retains structural leverage over every AI lab regardless of benchmark rankings.",
        sourceName: "Weekly Strategy Dossier",
        sourceUrl: "https://aionboarded.ai/news",
        publishedAt: "2026-03-27T00:00:00.000Z",
        featured: false,
        imageName: "image4.png",
        content: "Apple's iOS 27 repositions Siri as a traffic broker, completely abstracting the underlying AI models away from the user. Control of the interface is the ultimate moat in the agentic era."
    },
    {
        title: "Action Plan: 5 Mandates for the Week of March 23",
        slug: "action-plan-march-23-2026",
        excerpt: "Delegate at the OS level, own the orchestrator identity, and audit enterprise ethics: five actionable steps for this week.",
        sourceName: "Weekly Strategy Dossier",
        sourceUrl: "https://aionboarded.ai/news",
        publishedAt: "2026-03-29T00:00:00.000Z",
        featured: false,
        imageName: "image9.png",
        content: "The action plan for this week emphasizes OS-level delegation via Claude Dispatch and the importance of auditing AI plugins for security. This week marks the shift from chatbot interaction to agentic orchestration."
    },
    {
        title: "The Agentic Inflection: Week at a Glance Briefing",
        slug: "week-at-a-glance-briefing-2026",
        excerpt: "Technical shifts, governance collisions, and infrastructure co-design: the structural shifts defining the week of March 23.",
        sourceName: "Weekly Strategy Dossier",
        sourceUrl: "https://aionboarded.ai/news",
        publishedAt: "2026-03-22T00:00:00.000Z",
        featured: false,
        imageName: "image1.png",
        content: "A high-level summary of the week's intelligence briefing, highlighting the technical, governance, and infrastructure shifts defining the Agentic Era."
    }
]

async function ingestNews() {
    const client = new Client({ connectionString: DATABASE_URL })

    try {
        console.log('Connecting to database...')
        await client.connect()

        if (!fs.existsSync(MEDIA_DIR)) {
            fs.mkdirSync(MEDIA_DIR, { recursive: true })
        }

        for (const item of newsItems) {
            console.log(`\n🔹 Processing: ${item.title}`)

            // 1. Handle Image
            let imageId = null
            const sourcePath = path.join(SEED_IMAGES_DIR, item.imageName)
            const destPath = path.join(MEDIA_DIR, item.imageName)

            if (fs.existsSync(sourcePath)) {
                console.log(`🖼️ Copying image: ${item.imageName}`)
                fs.copyFileSync(sourcePath, destPath)

                const stats = fs.statSync(destPath)
                
                // Check if media already exists
                const mediaCheck = await client.query(
                    'SELECT id FROM media WHERE filename = $1',
                    [item.imageName]
                )

                if (mediaCheck.rows.length > 0) {
                    imageId = mediaCheck.rows[0].id
                    console.log(`✅ Media exists: ${imageId}`)
                } else {
                    const mediaRes = await client.query(
                        `INSERT INTO media (filename, mime_type, filesize, url, updated_at, created_at) 
                         VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
                        [item.imageName, 'image/png', stats.size, `/media/${item.imageName}`]
                    )
                    imageId = mediaRes.rows[0].id
                    console.log(`✅ Image inserted: ${imageId}`)
                }
            } else {
                console.warn(`⚠️ Source image missing: ${sourcePath}`)
            }

            // 2. Handle News Item
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
                console.log(`🔄 Updating existing: ${item.slug}`)
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
                console.log(`➕ Creating new: ${item.slug}`)
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

        console.log('\n✅ News ingestion complete!')
        process.exit(0)
    } catch (e) {
        console.error('❌ Error:', e.message)
        process.exit(1)
    } finally {
        await client.end()
    }
}

ingestNews()
