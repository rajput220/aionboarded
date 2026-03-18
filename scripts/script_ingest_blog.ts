import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

async function ingestBlog() {
    console.log('📝 Starting blog ingestion...')
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

        // 2. Ensure Tag "AI"
        let aiTag = (await payload.find({ 
            collection: 'tags', 
            where: { name: { equals: 'AI' } }, 
            limit: 1 
        })).docs[0]
        
        if (!aiTag) {
            console.log('➕ Creating "AI" tag...')
            aiTag = await payload.create({
                collection: 'tags',
                data: { name: 'AI', slug: 'ai' }
            })
        }

        // 3. Ensure Category "Analysis"
        let analysisCat = (await payload.find({ 
            collection: 'categories', 
            where: { name: { equals: 'Analysis' } }, 
            limit: 1 
        })).docs[0]
        
        if (!analysisCat) {
            console.log('➕ Creating "Analysis" category...')
            analysisCat = await payload.create({
                collection: 'categories',
                data: { name: 'Analysis', slug: 'analysis', description: 'Deep dives into AI trends' }
            })
        }

        // 4. Handle Hero Image (Optional)
        let heroImageId = undefined
        const imagePath = process.argv[2] // Pass image path as first argument

        if (imagePath && fs.existsSync(imagePath)) {
            console.log(`🖼️ Uploading hero image: ${imagePath}`)
            const stats = fs.statSync(imagePath)
            const fileBuffer = fs.readFileSync(imagePath)
            
            const media = await payload.create({
                collection: 'media',
                data: {
                    alt: 'Claude vs ChatGPT Comparison',
                },
                file: {
                    data: fileBuffer,
                    name: path.basename(imagePath),
                    mimetype: 'image/png', // Assume PNG for this specific post
                    size: stats.size,
                }
            })
            heroImageId = media.id
            console.log(`✅ Hero image uploaded with ID: ${heroImageId}`)
        }

        // 5. Create/Update Blog Post
        const slug = 'claude-vs-chatgpt-philosophies'
        const existingPost = await payload.find({
            collection: 'blog-posts',
            where: { slug: { equals: slug } },
            limit: 1
        })

        const postData = {
            title: "Why Claude and ChatGPT Feel So Different: A Tale of Two AI Philosophies",
            slug: slug,
            excerpt: "The AI “expectation gap” isn’t about human likeness; it’s a reflection of divergent design tradeoffs. While developers describe Claude’s logic as “surgical” and deterministic, ChatGPT remains the versatile generalist.",
            status: 'published',
            publishedAt: new Date().toISOString(),
            author: adminId,
            tags: [aiTag.id],
            categories: [analysisCat.id],
            heroImage: heroImageId,
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
                            children: [{ type: 'text', text: 'The AI “expectation gap” isn’t about human likeness; it’s a reflection of divergent design tradeoffs. While developers describe Claude’s logic as “surgical” and deterministic, ChatGPT remains the versatile generalist, optimized for conversational flow and high-throughput execution.', format: 0, mode: 'normal' }] 
                        },
                        { 
                            type: 'heading', 
                            tag: 'h2', 
                            children: [{ type: 'text', text: 'Architecture vs. Orchestration: The Underlying Why', format: 0, mode: 'normal' }] 
                        },
                        { 
                            type: 'paragraph', 
                            children: [{ type: 'text', text: 'The distinct “feel” of these systems often comes down to their product and training choices—how they manage context, apply safety policies, and handle uncertainty—more than any single headline benchmark.', format: 0, mode: 'normal' }] 
                        },
                        {
                            type: 'list', 
                            listType: 'bullet', 
                            children: [
                                { type: 'listitem', children: [{ type: 'text', text: 'Claude (Anthropic): Leans into Constitutional AI (principle-guided behavior). In practice, that can look like more cautious refusals and a measured tone—often helpful when you want consistent constraints and careful reasoning.', format: 0, mode: 'normal' }] },
                                { type: 'listitem', children: [{ type: 'text', text: 'ChatGPT (OpenAI): Heavily shaped by RLHF and product tuning for usability. That tends to produce a strong “generalist” experience—fast, conversational, and broad—sometimes prioritizing flow over strict determinism in edge cases.', format: 0, mode: 'normal' }] }
                            ]
                        },
                        { 
                            type: 'paragraph', 
                            children: [{ type: 'text', text: 'Note: model names, versions, and benchmark numbers change quickly, and real-world results depend heavily on prompts, tools, and your codebase. Treat comparisons as directional—not absolute.', format: 2, mode: 'normal' }] 
                        },
                        { 
                            type: 'heading', 
                            tag: 'h2', 
                            children: [{ type: 'text', text: 'Philosophy at a Glance', format: 0, mode: 'normal' }] 
                        },
                        { 
                            type: 'paragraph', 
                            children: [{ type: 'text', text: '• Primary Design Goal - ChatGPT: All-in-one productivity toolkit | Claude: Deep reasoning & architectural rigor', format: 0, mode: 'normal' }] 
                        },
                        { 
                            type: 'paragraph', 
                            children: [{ type: 'text', text: '• Cost & Efficiency - ChatGPT: High speed / Lower API cost | Claude: High reasoning / High TCO', format: 0, mode: 'normal' }] 
                        },
                        { 
                            type: 'heading', 
                            tag: 'h2', 
                            children: [{ type: 'text', text: 'Strategic Implication for Tech Leaders', format: 0, mode: 'normal' }] 
                        },
                        { 
                            type: 'paragraph', 
                            children: [{ type: 'text', text: 'For a senior architect, the choice usually isn’t “better vs. worse”—it’s your escalation path when the problem stops being routine. ChatGPT can be your high-volume productivity driver for daily work: rapid prototyping, drafting, and fast iteration loops. Claude can serve as the escalation option for complex, high-context architectural challenges where subtle bugs and hidden assumptions matter.', format: 0, mode: 'normal' }] 
                        }
                    ]
                }
            }
        }

        if (existingPost.docs.length > 0) {
            console.log('🔄 Updating existing blog post...')
            await payload.update({
                collection: 'blog-posts',
                id: existingPost.docs[0].id,
                data: postData as any
            })
            console.log(`✅ Blog post updated: ${slug}`)
        } else {
            console.log('➕ Creating new blog post...')
            await payload.create({
                collection: 'blog-posts',
                data: postData as any
            })
            console.log(`✅ Blog post created: ${slug}`)
        }

    } catch (e: any) {
        console.error('❌ Error during ingestion:', e.stack || e.message)
    }
    
    process.exit(0)
}

ingestBlog()
