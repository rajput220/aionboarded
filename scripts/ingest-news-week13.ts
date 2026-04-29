import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function ingestNews() {
    console.log('📰 Starting news ingestion for Week 13 (April 13-19, 2026)...')
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
                title: "GPT-Rosalind: OpenAI Launches Specialized AI for Life Sciences",
                slug: "gpt-rosalind-openai-life-sciences-2026",
                excerpt: "On April 16, OpenAI launched GPT-Rosalind, a frontier reasoning model purpose-built for drug discovery, genomics, and protein engineering — the clearest signal yet that horizontal scaling is giving way to deep domain specialization.",
                sourceName: "OpenAI",
                sourceUrl: "https://openai.com/index/introducing-gpt-rosalind/",
                publishedAt: "2026-04-16T00:00:00.000Z",
                featured: true,
                imagePath: "seed/week13_images/slide3.png",
                content: "On April 16, OpenAI launched GPT-Rosalind, a frontier reasoning model purpose-built for drug discovery, genomics, and protein engineering — named after pioneering chemist Rosalind Franklin.\n\nKey highlights:\n• GPT-Rosalind is fine-tuned across genomics, protein engineering, and chemistry, supporting hypothesis generation, experimental planning, and multi-step scientific workflows.\n• On BixBench (real-world bioinformatics), it achieved the leading performance among models with published scores; it also outperformed GPT-5.4 on 6 of 11 LABBench2 tasks.\n• Launching as a research preview for qualified Enterprise customers including Amgen, Moderna, the Allen Institute, and Thermo Fisher Scientific.\n• A new Codex research plugin connects scientists to 50+ data sources and tools for accelerated research workflows.\n\nWhy it matters: This is the clearest signal yet that the era of one-size-fits-all frontier models is ending. Specialization at the reasoning layer is how AI crosses from general productivity into genuine scientific value. Drug discovery timelines — historically measured in decades — could compress dramatically."
            },
            {
                title: "Codex for (Almost) Everything: OpenAI's Agent Expands Beyond Code",
                slug: "codex-computer-agent-expands-beyond-code-2026",
                excerpt: "OpenAI released a major update to its Codex desktop app, transforming it from a coding assistant into a broad-purpose computer agent with native computer use, an in-app browser, persistent memory, and 90+ new plugins.",
                sourceName: "OpenAI",
                sourceUrl: "https://openai.com/index/codex-for-almost-everything/",
                publishedAt: "2026-04-16T00:00:00.000Z",
                featured: true,
                imagePath: "seed/week13_images/slide4.png",
                content: "OpenAI released a major update to its Codex desktop app on April 16, transforming it from a coding assistant into a broad-purpose computer agent with native computer use, an in-app browser, persistent memory, and 90+ new plugins.\n\nKey highlights:\n• Codex can now use any Mac app using its own cursor — clicking, typing, and interacting visually. Multiple agents can work in parallel without interfering with the user's own work.\n• A new in-app browser lets users comment directly on web pages to provide precise agent instructions.\n• Memory preview allows Codex to remember context from previous sessions.\n• 90+ new plugins added including Atlassian Rovo, CircleCI, GitLab Issues, and Microsoft tools. Codex can also schedule future work across days or weeks autonomously.\n\nWhy it matters: The gap between 'coding assistant' and 'autonomous agent' has effectively closed in one update. Codex now operates more like a digital coworker than a smart autocomplete. The scheduling and memory features are what separates this from prior agentic demos."
            },
            {
                title: "Gemini 3.1 Gains Real-Time Voice & Image Analysis",
                slug: "gemini-31-real-time-voice-image-analysis-2026",
                excerpt: "Google's Gemini 3.1 series received a significant multimodal update, adding real-time voice and image analysis capabilities that allow the model to see, hear, and respond within live interactions.",
                sourceName: "Crescendo AI",
                sourceUrl: "https://www.crescendo.ai/news/latest-ai-news-and-updates",
                publishedAt: "2026-04-15T00:00:00.000Z",
                featured: true,
                imagePath: "seed/week13_images/slide2.png",
                content: "Google's Gemini 3.1 series received a significant multimodal update this week, adding real-time voice and image analysis capabilities that allow the model to see, hear, and respond within live interactions rather than processing uploaded media after the fact.\n\nKey highlights:\n• Real-time voice analysis enables Gemini to respond to spoken input with low-latency feedback, positioning it directly against GPT-4o's voice mode.\n• Real-time image analysis allows the model to interpret a live camera feed or screen content during an interaction.\n• The update continues Google's strategy of building multimodal 'sense-and-respond' capabilities natively into Gemini.\n• Google's underlying KV-cache compression — which reduces memory requirements sixfold — is what makes these real-time capabilities economically viable at scale.\n\nWhy it matters: Real-time multimodal interaction is the next UX frontier for AI assistants. Google is making a significant push to match or surpass OpenAI's voice and vision capabilities."
            },
            {
                title: "Google DeepMind & the Department of Energy: The Genesis Project",
                slug: "deepmind-doe-genesis-project-national-ai-2026",
                excerpt: "Google DeepMind announced a partnership with the U.S. Department of Energy on Project Genesis, a national mission to apply AI to accelerate scientific discovery across nuclear energy, materials science, and climate research.",
                sourceName: "BNL Newsroom",
                sourceUrl: "https://www.bnl.gov/newsroom/news.php?a=222774",
                publishedAt: "2026-04-14T00:00:00.000Z",
                featured: true,
                imagePath: "seed/week13_images/slide6.png",
                content: "Google DeepMind announced a partnership with the U.S. Department of Energy on Project Genesis, a national mission to apply AI to accelerate scientific discovery across nuclear energy, materials science, and climate research.\n\nKey highlights:\n• Genesis is framed as a national infrastructure initiative — not a product launch — placing DeepMind's capabilities directly in service of government-scale scientific programs.\n• The partnership covers multiple DOE national laboratories including Brookhaven, Oak Ridge, and Argonne, applying AI to problems such as fusion energy modeling, new materials discovery, and climate simulation.\n• This follows a broader trend of frontier AI labs embedding themselves in critical national infrastructure programs.\n• Google DeepMind's scientific AI capabilities — demonstrated through AlphaFold and AlphaMissense — make it the natural partner.\n\nWhy it matters: Government-scale AI partnerships are becoming a new competitive moat. The energy and climate application of AI is moving from peripheral to central — Genesis signals that the US government sees AI as essential infrastructure for national scientific competitiveness."
            },
            {
                title: "Claude Opus 4.7: The Self-Verifying Engineer",
                slug: "claude-opus-47-self-verifying-engineer-2026",
                excerpt: "Anthropic released Claude Opus 4.7 on April 16, its most capable commercial model to date, introducing self-verification as a core feature alongside a major leap in visual acuity and enhanced coding performance.",
                sourceName: "Anthropic",
                sourceUrl: "https://www.anthropic.com/news/claude-opus-4-7",
                publishedAt: "2026-04-16T00:00:00.000Z",
                featured: true,
                imagePath: "seed/week13_images/slide3.png",
                content: "Anthropic released Claude Opus 4.7 on April 16, its most capable commercial model to date, introducing self-verification as a core feature — the ability to check its own outputs before returning them — alongside a major leap in visual acuity and enhanced coding performance.\n\nKey highlights:\n• Self-verification: Opus 4.7 reviews and validates its own outputs before reporting back, dramatically reducing the 'human correction tax' in technical workflows.\n• Vision resolution increased from 54.5% to 98.5% on proprietary visual-reasoning benchmarks; images up to 2,576 pixels on the long edge are now supported — more than 3x the prior limit.\n• New 'xhigh' reasoning effort level gives users finer control over the tradeoff between deep reasoning and latency.\n• First model to carry automated cybersecurity safeguards.\n• Pricing unchanged from Opus 4.6: $5/million input tokens, $25/million output tokens.\n\nWhy it matters: Self-verification is a structural shift in how AI handles complex tasks. It moves responsibility for output quality from the human reviewer to the model itself — a prerequisite for true agentic autonomy. The visual acuity jump effectively unlocks a new category of use cases."
            },
            {
                title: "Claude Design: Anthropic Takes Aim at Figma and Adobe",
                slug: "claude-design-anthropic-figma-disruption-2026",
                excerpt: "Anthropic launched Claude Design on April 17, a standalone product powered by Opus 4.7 that turns natural language prompts into complete, interactive UI prototypes — sending shares of Figma and Adobe sharply lower.",
                sourceName: "VentureBeat",
                sourceUrl: "https://venturebeat.com/technology/anthropic-just-launched-claude-design-an-ai-tool-that-turns-prompts-into-prototypes-and-challenges-figma",
                publishedAt: "2026-04-17T00:00:00.000Z",
                featured: true,
                imagePath: "seed/week13_images/slide4.png",
                content: "Anthropic launched Claude Design on April 17, a standalone product powered by Opus 4.7 that turns natural language prompts into complete, interactive UI prototypes, presentations, and marketing materials — sending shares of Figma and Adobe sharply lower on its debut.\n\nKey highlights:\n• Claude Design generates complete, interactive prototypes from text descriptions and allows refinement through conversation, inline comments, or direct edits.\n• Users can upload codebases and design files, enabling Claude to build a design system that automatically applies a team's colors, typography, and components across projects.\n• Anthropic CPO Mike Krieger resigned from Figma's board on April 14 — removing any conflict of interest ahead of the launch.\n• Access is being rolled out to Claude Pro, Max, Team, and Enterprise subscribers.\n• The product lowers the barrier to professional-grade prototyping for founders, PMs, and marketers.\n\nWhy it matters: Design tools are the latest SaaS category to face structural disruption from AI. Claude Design doesn't just assist designers — it makes Figma's primary value proposition accessible without Figma. The Krieger board resignation signals Anthropic is playing to win."
            },
            {
                title: "Microsoft MAI Trinity: Transcribe-1, Voice-1, and Image-2",
                slug: "microsoft-mai-trinity-transcribe-voice-image-2026",
                excerpt: "Microsoft announced three new foundational AI models — MAI-Transcribe-1, MAI-Voice-1, and MAI-Image-2 — representing the company's clearest strategic move to build its own model capabilities rather than relying on OpenAI.",
                sourceName: "Microsoft",
                sourceUrl: "https://blogs.microsoft.com/blog/2026/04/14/microsoft-foundry-mai-models/",
                publishedAt: "2026-04-14T00:00:00.000Z",
                featured: false,
                imagePath: "seed/week13_images/slide5.png",
                content: "Microsoft announced three new foundational AI models — MAI-Transcribe-1, MAI-Voice-1, and MAI-Image-2 — available through Microsoft Foundry, representing the company's clearest strategic move to build its own model capabilities rather than relying entirely on OpenAI.\n\nKey highlights:\n• MAI-Transcribe-1: Enterprise-grade speech recognition across 25 languages at approximately 50% lower GPU cost than leading alternatives; 2.5x the batch transcription speed of Azure's current Fast offering.\n• MAI-Voice-1: Produces 60 seconds of expressive, high-fidelity audio in under one second on a single GPU.\n• MAI-Image-2: Microsoft's highest-capability text-to-image model, debuting at #3 on the Arena.ai leaderboard.\n• This represents a significant strategic shift: Microsoft is building its own frontier capabilities, reducing its dependency on OpenAI.\n\nWhy it matters: Microsoft building its own frontier model capabilities signals a fundamental strategic pivot — from distributing OpenAI's intelligence to originating its own, prioritizing enterprise economics and independence."
            },
            {
                title: "Stanford AI Index 2026: The State of AI in Numbers",
                slug: "stanford-ai-index-2026-state-of-ai-numbers",
                excerpt: "Stanford's 2026 AI Index shows foundation model transparency dropped from 58 to 40, coding benchmarks approaching saturation, 58% of Americans viewing AI negatively, and Gallup approval at 38%.",
                sourceName: "Stanford HAI",
                sourceUrl: "https://aiindex.stanford.edu/report/",
                publishedAt: "2026-04-15T00:00:00.000Z",
                featured: false,
                imagePath: "seed/week13_images/slide7.png",
                content: "Stanford's 2026 AI Index — the most comprehensive annual survey of the field — reveals a complex picture: unprecedented capability gains, declining public trust, and a transparency crisis in the foundation model ecosystem.\n\nKey highlights:\n• Foundation Model Transparency Index scores dropped from 58 to 40 out of 100 in a single year — the most significant trust metric decline in the report.\n• Coding benchmarks are approaching saturation, with top models nearing 100% on standard evaluations.\n• 58% of Americans now view AI negatively according to CNBC survey data cited in the report.\n• Gallup AI approval rating dropped to 38%.\n• $156B in data center projects were canceled or delayed due to community pushback.\n• 40% of investors show hesitation regarding upcoming AI IPOs based on public sentiment.\n\nWhy it matters: The most capable AI systems are becoming less transparent just as they become more powerful and more embedded in daily life. This is not a communications problem — it is a governance gap."
            },
            {
                title: "Public Opinion on AI Is Souring — And It's a Financial Risk",
                slug: "public-opinion-ai-souring-financial-risk-2026",
                excerpt: "CNBC reports 58% of Americans now view AI negatively, $156B in data center projects face cancellation from community pushback, and 40% of investors show hesitation regarding AI IPOs.",
                sourceName: "CNBC",
                sourceUrl: "https://www.cnbc.com/2026/04/13/ai-public-sentiment-financial-risk/",
                publishedAt: "2026-04-13T00:00:00.000Z",
                featured: false,
                imagePath: "seed/week13_images/slide7.png",
                content: "Three separate data points converged this week to establish that public sentiment toward AI has become a material financial risk: CNBC's survey showing 58% negative public opinion, $156 billion in canceled data center projects, and investor hesitation around upcoming AI IPOs.\n\nKey highlights:\n• 58% of Americans now view AI negatively — a dramatic acceleration from the cautious optimism of 2024.\n• $156 billion in data center projects were canceled or delayed due to community opposition.\n• 40% of surveyed institutional investors express 'meaningful hesitation' regarding upcoming AI IPOs.\n• The trust deficit is compounding: as AI models become more capable, the transparency scores documenting their behavior are falling.\n\nWhy it matters: The combination of declining public trust and declining model transparency creates a governance gap that has real financial consequences. Organizations deploying AI must treat trust-building as a strategic function."
            },
            {
                title: "The OpenAI-Anthropic Rivalry: From Polite Competition to Ideological Warfare",
                slug: "openai-anthropic-rivalry-ideological-warfare-2026",
                excerpt: "Internal OpenAI research memos reveal a systematic 'Anthropic Problem' — framing Anthropic's safety-first approach as restrictive and fear-based. The rivalry has hardened from politely competitive to openly adversarial.",
                sourceName: "Axios",
                sourceUrl: "https://www.axios.com/2026/04/13/openai-microsoft-anthropic-amazon",
                publishedAt: "2026-04-13T00:00:00.000Z",
                featured: false,
                imagePath: "seed/week13_images/slide8.png",
                content: "Internal OpenAI research memos, reported by Axios, reveal a systematic 'Anthropic Problem' narrative — framing Anthropic's safety-first approach as restrictive and fear-based, while positioning OpenAI's approach as 'positive and open.'\n\nKey highlights:\n• Internal OpenAI memos characterize Anthropic's safety-first positioning as a 'restrictive narrative built on fear' and frame OpenAI's approach as 'positive, open, and optimistic.'\n• Anthropic's financial momentum continues: Dario Amodei flagged Anthropic's revenue trajectory as unusually strong, with investors beginning to allocate more capital to Anthropic as a hedge against OpenAI concentration.\n• The rivalry is hardening from politely competitive to openly adversarial — a signal that market share stakes are high enough to warrant public framing battles.\n\nWhy it matters: The ideological framing of this rivalry — 'open and positive' vs. 'safe and restricted' — is how the AI governance debate will be fought in the public arena. Understanding both sides is essential for any informed practitioner."
            },
            {
                title: "The Agent Value Multiple: How Organizations Are Measuring AI ROI",
                slug: "agent-value-multiple-measuring-ai-roi-2026",
                excerpt: "A new economic metric — the Agent Value Multiple (AVM) — is gaining traction as the successor to 'time saved' as the primary measure of AI return on investment, quantifying financial value per unit of agent cost.",
                sourceName: "AI Weekly Research",
                sourceUrl: "https://docs.google.com/document/d/1epvSEcju9Aml5lmzFecU-fmQXFXwbVOVWQH7qMFj4C4/edit",
                publishedAt: "2026-04-18T00:00:00.000Z",
                featured: false,
                imagePath: "seed/week13_images/slide9.png",
                content: "A new economic metric — the Agent Value Multiple (AVM) — is gaining traction as the successor to 'time saved' as the primary measure of AI return on investment. AVM quantifies the financial value generated per unit of agent cost.\n\nKey highlights:\n• AVM replaces vanity metrics such as token consumption and task completion rates with direct financial value measurement: revenue generated, cost eliminated, or error risk reduced per dollar of agent spend.\n• The metric is driven by the release of self-verifying models like Opus 4.7, which reduce the 'human correction tax' and make it feasible to assign financial accountability to agent outputs.\n• Early enterprise adopters are building AVM dashboards to justify AI budget expansion.\n• Organizations without an AVM-equivalent framework are increasingly finding it difficult to justify AI investment to finance and board stakeholders.\n\nWhy it matters: The shift from 'time saved' to P&L impact is how AI moves from a department expense to a strategic investment. AVM also changes accountability: when AI is measured in financial value, responsibility for its failures becomes concrete and owned."
            },
            {
                title: "SLxAI Summit: Building Disability-Inclusive AI",
                slug: "slxai-summit-disability-inclusive-ai-deaf-safe-2026",
                excerpt: "The SLxAI Summit convened in Boston, bringing together researchers, advocates, and technologists to address the critical gap in AI accessibility for deaf communities, establishing 'Deaf-Safe' AI design principles.",
                sourceName: "AI Weekly Research",
                sourceUrl: "https://docs.google.com/document/d/1epvSEcju9Aml5lmzFecU-fmQXFXwbVOVWQH7qMFj4C4/edit",
                publishedAt: "2026-04-17T00:00:00.000Z",
                featured: false,
                imagePath: "seed/week13_images/slide6.png",
                content: "The SLxAI Summit convened in Boston this week, bringing together researchers, advocates, and technologists to address the critical gap in AI accessibility for deaf and hard-of-hearing communities, establishing 'Deaf-Safe' AI design principles.\n\nKey highlights:\n• The summit focused on sign language AI development, identifying significant gaps in current large language and vision models for ASL and other sign languages.\n• Key concern: most AI assistants — including voice-based models — are designed for hearing users by default, creating systemic exclusion for the deaf community.\n• 'Deaf-Safe' principles proposed: AI systems should never assume voice as the primary interface, should support visual-spatial communication natively, and should include deaf community representatives in development.\n• As AI replaces more human-to-human services (customer support, healthcare triage, education), the exclusion risk for non-auditory users grows proportionally.\n\nWhy it matters: Accessibility is not a feature add-on — it is a design prerequisite. As AI becomes the interface layer for essential services, exclusion of any community becomes a rights and equity issue."
            },
            {
                title: "The AI Specialization Turn: Week 13 Strategic Briefing",
                slug: "ai-specialization-turn-week-13-briefing",
                excerpt: "Five themes defined the week: domain specialization replaces generalist scaling, AI swallows entire professional software categories, self-verification enables agentic autonomy, the trust deficit deepens, and the P&L accountability shift begins.",
                sourceName: "AI Onboarded",
                sourceUrl: "https://aionboarded.ai/newsletter",
                publishedAt: "2026-04-19T00:00:00.000Z",
                featured: false,
                imagePath: "seed/week13_images/slide1.png",
                content: "The week of April 13-19, 2026 marks the AI Specialization Turn — the moment frontier labs pivoted from generalist scaling to purposeful domain expertise.\n\nFive dominant themes:\n1. The Vertical Turn — GPT-Rosalind and Claude Opus 4.7 signal that value is shifting from 'can use AI' to 'can use AI for my specific domain with depth.' The era of generalist models has ended at the frontier.\n2. Category Displacement — Claude Design's launch is a bellwether for AI displacing professional creative software. What Figma did to Photoshop a decade ago, AI-native design tools are now doing to Figma.\n3. Self-Verification as the New Safety Layer — Claude Opus 4.7's self-verification capability is a prerequisite for true long-horizon autonomy. As self-verification becomes standard, the threshold for delegating complex tasks drops.\n4. The Trust Deficit Deepens — Stanford AI Index transparency scores dropped from 58 to 40. 58% of Americans view AI negatively. Organizations must treat trust-building as a strategic function.\n5. The P&L Accountability Shift — The Agent Value Multiple signals AI graduating from innovation budget to core P&L contributor. Financial accountability for AI output is now concrete.\n\nAction agenda:\n• Deploy Codex's computer use feature for frontend iteration this week\n• Identify 2-3 domain-specific AI models emerging in your field\n• Try Claude Design for rapid prototyping on your existing plan\n• Calculate your first AVM for one AI use case"
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
                        children: item.content.split('\n\n').map(paragraph => ({ 
                            type: 'paragraph', 
                            children: [{ type: 'text', text: paragraph, format: 0, mode: 'normal' }] 
                        }))
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
