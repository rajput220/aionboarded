import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function ingestNews() {
    console.log('📰 Starting news ingestion for Week 10 (March 23-29, 2026)...')
    const payload = await getPayload({ config })

    try {
        // 1. Ensure User (Admin or first available)
        const users = await payload.find({ 
            collection: 'users',
            limit: 10
        })
        
        const adminId = users.docs.find((u: any) => u.role === 'admin')?.id || users.docs[0]?.id
        
        if (!adminId) {
            console.warn('⚠️ No user found in database. Please ensure a user exists.')
            process.exit(1)
        }
        console.log(`👤 Using user ID: ${adminId} as author`)

        const newsItems = [
            {
                title: "White House National AI Policy Framework: Federal Preemption Revealed",
                slug: "white-house-national-ai-policy-framework-2026",
                excerpt: "The U.S. government's new framework prioritizes federal oversight, preempting state-level AI regulations to accelerate American AI dominance.",
                sourceName: "WilmerHale Privacy Blog",
                sourceUrl: "https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20260323-white-house-releases-national-policy-framework-for-artificial-intelligence",
                publishedAt: "2026-03-23T00:00:00.000Z",
                featured: true,
                imagePath: "seed/week10_images/image6.png",
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
                imagePath: "seed/week10_images/image5.png",
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
                imagePath: "seed/week10_images/image10.png",
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
                imagePath: "seed/week10_images/image8.png",
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
                imagePath: "seed/week10_images/image2.png",
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
                imagePath: "seed/week10_images/image7.png",
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
                imagePath: "seed/week10_images/image3.png",
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
                imagePath: "seed/week10_images/image4.png",
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
                imagePath: "seed/week10_images/image9.png",
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
                imagePath: "seed/week10_images/image1.png",
                content: "A high-level summary of the week's intelligence briefing, highlighting the technical, governance, and infrastructure shifts defining the Agentic Era."
            }
        ]

        for (const item of newsItems) {
            console.log(`\n🔹 Processing: ${item.title}`)
            
            // 2. Upload Image
            let imageId = undefined
            const fullImagePath = path.isAbsolute(item.imagePath) ? item.imagePath : path.resolve(process.cwd(), item.imagePath)
            
            if (fs.existsSync(fullImagePath)) {
                console.log(`🖼️ Uploading image: ${fullImagePath}`)
                const stats = fs.statSync(fullImagePath)
                const fileBuffer = fs.readFileSync(fullImagePath)
                
                const media = await payload.create({
                    collection: 'media',
                    data: {
                        alt: item.title,
                    },
                    file: {
                        data: fileBuffer,
                        name: path.basename(fullImagePath),
                        mimetype: 'image/png',
                        size: stats.size,
                    }
                })
                imageId = media.id
                console.log(`✅ Image uploaded: ${imageId}`)
            } else {
                console.warn(`⚠️ Image not found: ${fullImagePath}`)
            }

            // 3. Create News Item
            const postData = {
                title: item.title,
                slug: item.slug,
                excerpt: item.excerpt,
                status: 'published',
                publishedAt: item.publishedAt,
                sourceName: item.sourceName,
                sourceUrl: item.sourceUrl,
                featured: item.featured,
                heroImage: imageId,
                content: {
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
            }

            const existing = await payload.find({
                collection: 'news-items',
                where: { slug: { equals: item.slug } },
                limit: 1
            })

            if (existing.docs.length > 0) {
                console.log(`🔄 Updating existing: ${item.slug}`)
                await payload.update({
                    collection: 'news-items',
                    id: existing.docs[0].id,
                    data: postData as any
                })
            } else {
                console.log(`➕ Creating new: ${item.slug}`)
                await payload.create({
                    collection: 'news-items',
                    data: postData as any
                })
            }
        }

        console.log('\n✅ News ingestion complete!')
    } catch (e: any) {
        console.error('❌ Error:', e.stack || e.message)
    }
    
    process.exit(0)
}

ingestNews()
