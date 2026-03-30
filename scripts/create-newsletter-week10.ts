import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createNewsletter() {
    console.log('📬 Creating Newsletter Issue for Week 10...')
    const payload = await getPayload({ config })

    try {
        // 1. Ensure User
        const users = await payload.find({ 
            collection: 'users',
            limit: 10
        })
        const adminId = users.docs.find((u: any) => u.role === 'admin')?.id || users.docs[0]?.id

        const content = `The week of March 23-29, 2026 marks a definitive inflection point in the AI industry: the shift from the era of chatbots to the era of agents is no longer a forecast — it is a fact. Three dominant themes defined this period. First, AI has broken out of the browser and entered the operating system: Anthropic's Computer Use for Mac, OpenAI's Agentic Commerce Protocol, and Apple's multi-AI Siri strategy all point to the conversational interface giving way to agentic execution. Second, governance and ethics reached a legal flashpoint with the Anthropic vs. Pentagon lawsuit. Third, user portability became a battleground as Google's Memory Migration tools signaled that vendor lock-in is being systematically dismantled.`

        const issueData = {
            title: "Week 10: The Agentic Inflection — AI Becomes Your Digital Coworker",
            slug: "week-10",
            issueNumber: 10,
            excerpt: "From OpenAI's agentic commerce protocol to Anthropic's 'Computer Use' for Mac and the White House's new regulatory framework — the agentic era has officially arrived.",
            status: 'published',
            author: adminId,
            publishedAt: new Date().toISOString(),
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
                            children: [{ type: 'text', text: content, format: 0, mode: 'normal' }] 
                        }
                    ]
                }
            }
        }

        const existing = await payload.find({
            collection: 'newsletter-issues',
            where: { issueNumber: { equals: 10 } },
            limit: 1
        })

        if (existing.docs.length > 0) {
            console.log(`🔄 Updating existing issue: Week 10`)
            await payload.update({
                collection: 'newsletter-issues',
                id: existing.docs[0].id,
                data: issueData as any
            })
        } else {
            console.log(`➕ Creating new issue: Week 10`)
            await payload.create({
                collection: 'newsletter-issues',
                data: issueData as any
            })
        }

        console.log('✅ Newsletter Issue created successfully!')
    } catch (e: any) {
        console.error('❌ Error:', e.stack || e.message)
    }
    
    process.exit(0)
}

createNewsletter()
