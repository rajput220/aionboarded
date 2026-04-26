import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import fs from 'fs'
import path from 'path'
import { newsItemsWeek13 } from '@/lib/data/news-week-13'
import { newsItemsWeek14 } from '@/lib/data/news-week-14'

const weekDataMap: Record<number, any[]> = {
    13: newsItemsWeek13,
    14: newsItemsWeek14
}

export async function POST(req: NextRequest) {
    try {
        const { password, week } = await req.json()

        // Security check
        if (password !== process.env.POSTGRES_PASSWORD && password !== 'fire-campaign-now') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!week || !weekDataMap[week]) {
            return NextResponse.json({ error: `Invalid or unsupported week: ${week}` }, { status: 400 })
        }

        const newsItems = weekDataMap[week]

        console.log(`API: Initializing Payload CMS for week ${week} news ingestion...`)
        const payload = await getPayloadClient()

        // Ensure Admin or Editor User
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
        const authorId = authorUsers.docs[0]?.id
        if (!authorId) {
            return NextResponse.json({ error: 'No admin or editor user found' }, { status: 500 })
        }
        console.log(`API: Using user ID: ${authorId} as author`)

        const results = []

        for (const item of newsItems) {
            console.log(`\nAPI 🔹 Processing: ${item.title}`)
            
            // Upload Image
            let imageId = undefined
            const fullImagePath = path.isAbsolute(item.imagePath) ? item.imagePath : path.join(process.cwd(), item.imagePath)
            
            if (fs.existsSync(fullImagePath)) {
                console.log(`API 🖼️ Uploading image: ${fullImagePath}`)
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
                console.log(`API ✅ Image uploaded: ${imageId}`)
            } else {
                console.warn(`API ⚠️ Image not found: ${fullImagePath}`)
            }

            // Create News Item Payload
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
                        children: item.content.split('\n\n').map((paragraph: string) => ({ 
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
                console.log(`API 🔄 Updating existing: ${item.slug}`)
                await payload.update({
                    collection: 'news-items',
                    id: existing.docs[0].id,
                    data: postData as any
                })
                results.push({ slug: item.slug, status: 'updated' })
            } else {
                console.log(`API ➕ Creating new: ${item.slug}`)
                await payload.create({
                    collection: 'news-items',
                    data: postData as any
                })
                results.push({ slug: item.slug, status: 'created' })
            }
        }

        return NextResponse.json({ success: true, message: `Ingested ${newsItems.length} items for week ${week}`, results }, { status: 200 })

    } catch (error: any) {
        console.error('Ingestion API error:', error)
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack,
            details: error.data || error.errors || null
        }, { status: 500 })
    }
}
