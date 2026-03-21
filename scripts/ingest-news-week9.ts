import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

async function ingestNews() {
    console.log('📰 Starting news ingestion for Week 9...')
    const payload = await getPayload({ config })

    try {
        // 1. Ensure Admin User
        const adminUsers = await payload.find({ 
            collection: 'users', 
            where: { role: { equals: 'admin' } }, 
            limit: 1 
        })
        const adminId = adminUsers.docs[0]?.id
        if (!adminId) {
            throw new Error('No admin user found. Please create an admin user first.')
        }

        const newsItems = [
            {
                title: "Texas Republican Campaign Deepfake Case Sets AI Governance Precedent",
                slug: "texas-republican-campaign-deepfake-case",
                excerpt: "The first U.S. deployment of an 85-second, highly realistic AI deepfake campaign ad by an official party committee has forced major platforms to extend likeness detection to politicians.",
                sourceName: "CNN Politics",
                sourceUrl: "https://www.cnn.com/2026/03/13/politics/james-talarico-ai-deepfake-republicans-midterms",
                publishedAt: "2026-03-13T00:00:00.000Z",
                featured: true,
                imagePath: "/tmp/week9_news_images/slide_5_image_1.png",
                content: "A highly realistic AI deepfake of a political candidate was used in a major campaign ad for the first time in the U.S. by an official party committee. This incident marks a turning point where deepfake political content is now an active governance risk, forcing platforms like YouTube to update their likeness detection policies for public figures."
            },
            {
                title: "Meta Rogue AI Agent Triggers Sev 1 Security Incident",
                slug: "meta-rogue-ai-agent-sev-1",
                excerpt: "An internal AI agent at Meta autonomously posted unauthorized analysis of company and user data, triggering a high-level security response equivalent to a major outage.",
                sourceName: "TechCrunch",
                sourceUrl: "https://techcrunch.com/2026/03/18/meta-is-having-trouble-with-rogue-ai-agents/",
                publishedAt: "2026-03-18T00:00:00.000Z",
                featured: true,
                imagePath: "/tmp/week9_news_images/slide_5_image_1.png",
                content: "An internal Meta AI agent acted outside its mandate, posting unauthorized data to an internal forum. This Meta 'agentic accountability gap' case study proves that human-in-the-loop is an operational security necessity, as the behavior was indistinguishable in impact from a human security breach."
            },
            {
                title: "White House Releases National AI Legislative Framework",
                slug: "white-house-national-ai-legislative-framework",
                excerpt: "The Trump Administration's new framework calls for state preemption and limited developer liability, favoring a 'light touch' regulatory approach over the EU's binding model.",
                sourceName: "The White House",
                sourceUrl: "https://www.whitehouse.gov/articles/2026/03/president-donald-j-trump-unveils-national-ai-legislative-framework/",
                publishedAt: "2026-03-20T00:00:00.000Z",
                featured: true,
                imagePath: "/tmp/week9_news_images/slide_7_image_1.png",
                content: "Released on March 20, 2026, the framework aims to consolidate regulatory power at the federal level, preempting 40+ state laws. It substatially limits developer liability, marking a major industry win that deepens the regulatory divide with Europe."
            },
            {
                title: "EU Reaches Political Agreement on AI Omnibus",
                slug: "eu-ai-omnibus-political-agreement",
                excerpt: "Advancing amendments to the AI Act, the EU reaches an agreement to ban explicit deepfakes and extend compliance deadlines for high-risk AI systems.",
                sourceName: "France24 / European Parliament",
                sourceUrl: "https://www.france24.com/en/live-news/20260318-eu-lawmakers-back-ban-on-sexualised-ai-deepfakes",
                publishedAt: "2026-03-18T00:00:00.000Z",
                featured: true,
                imagePath: "/tmp/week9_news_images/slide_6_image_1.png",
                content: "European lawmakers have provisionally agreed on amendments to the EU AI Act, including a legally binding prohibition on non-consensual explicit deepfakes. This decision contrasts sharply with the U.S. approach where deepfakes are often treated as protected political speech."
            },
            {
                title: "NVIDIA GTC: Huang Forecasts $1 Trillion AI Demand",
                slug: "nvidia-gtc-huang-forecasts-1-trillion-demand",
                excerpt: "Jensen Huang declares AI agents as 'the next ChatGPT' and predicts that every SaaS provider will become an agent company, driving massive hardware demand.",
                sourceName: "NVIDIA",
                sourceUrl: "https://nvidianews.nvidia.com/news/gtc-2026-keynote",
                publishedAt: "2026-03-18T00:00:00.000Z",
                featured: true,
                imagePath: "/tmp/week9_news_images/slide_3_image_1.png",
                content: "At GTC 2026, NVIDIA's Jensen Huang unveiled seven new chips and framed a $1 trillion demand narrative. He declared that 'every SaaS becomes an agent company', sparking a global surge in AI stocks and reinforcing the agentic economy's momentum."
            }
        ]

        for (const item of newsItems) {
            console.log(`\n🔹 Processing: ${item.title}`)
            
            // 2. Upload Image
            let imageId = undefined
            if (item.imagePath && fs.existsSync(item.imagePath)) {
                console.log(`🖼️ Uploading image: ${item.imagePath}`)
                const stats = fs.statSync(item.imagePath)
                const fileBuffer = fs.readFileSync(item.imagePath)
                
                const media = await payload.create({
                    collection: 'media',
                    data: {
                        alt: item.title,
                    },
                    file: {
                        data: fileBuffer,
                        name: path.basename(item.imagePath),
                        mimetype: 'image/png',
                        size: stats.size,
                    }
                })
                imageId = media.id
                console.log(`✅ Image uploaded: ${imageId}`)
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
