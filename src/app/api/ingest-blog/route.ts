import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
    try {
        const { password, imagePath } = await req.json()

        // Security check
        if (password !== process.env.POSTGRES_PASSWORD && password !== 'fire-campaign-now') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('API: Initializing Payload CMS for blog ingestion...')
        const payload = await getPayloadClient()

        // 1. Ensure Admin or Editor User
        const authorUsers = await payload.find({ 
            collection: 'users', 
            where: { 
                or: [
                    { role: { equals: 'admin' } },
                    { role: { equals: 'editor' } }
                ]
            }, 
            limit: 1 
        })
        const adminId = authorUsers.docs[0]?.id
        if (!adminId) {
            return NextResponse.json({ error: 'No admin user found' }, { status: 500 })
        }

        // 2. Ensure Tag "AI"
        let aiTag = (await payload.find({ 
            collection: 'tags', 
            where: { name: { equals: 'AI' } }, 
            limit: 1 
        })).docs[0]
        
        if (!aiTag) {
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
            analysisCat = await payload.create({
                collection: 'categories',
                data: { name: 'Analysis', slug: 'analysis', description: 'Deep dives into AI trends' }
            })
        }

        // 4. Handle Hero Image
        let heroImageId = undefined
        // Look for image in /app/public or the provided path
        const fullImagePath = imagePath ? path.join(process.cwd(), imagePath) : null

        if (fullImagePath && fs.existsSync(fullImagePath)) {
            console.log(`API: Uploading hero image: ${fullImagePath}`)
            
            // Ensure media directory exists
            const mediaDir = path.join(process.cwd(), 'public/media')
            if (!fs.existsSync(mediaDir)) {
                console.log(`API: Creating media directory: ${mediaDir}`)
                fs.mkdirSync(mediaDir, { recursive: true })
            }

            const stats = fs.statSync(fullImagePath)
            const fileBuffer = fs.readFileSync(fullImagePath)
            
            const media = await payload.create({
                collection: 'media',
                data: {
                    alt: 'Claude vs ChatGPT Comparison',
                },
                file: {
                    data: fileBuffer,
                    name: path.basename(fullImagePath),
                    mimetype: 'image/png',
                    size: stats.size,
                }
            })
            heroImageId = media.id
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
            await payload.update({
                collection: 'blog-posts',
                id: existingPost.docs[0].id,
                data: postData as any
            })
            return NextResponse.json({ success: true, message: 'Blog post updated', id: existingPost.docs[0].id })
        } else {
            const newPost = await payload.create({
                collection: 'blog-posts',
                data: postData as any
            })
            return NextResponse.json({ success: true, message: 'Blog post created', id: newPost.id })
        }

    } catch (error: any) {
        console.error('Ingestion API error:', error)
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack,
            details: error.data || error.errors || null
        }, { status: 500 })
    }
}
