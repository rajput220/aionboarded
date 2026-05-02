import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// ---------------------------------------------------------
// POST /api/agent/ingest-news
//
// Generic news ingestion endpoint for the automated pipeline.
// Accepts full news item data in the request body — no
// hardcoded week data required. Secured by AGENT_API_KEY.
//
// Body:
//   apiKey      : string  — must match AGENT_API_KEY env var
//   weekNumber  : number  — e.g. 15
//   newsItems   : Array<NewsItemInput>
//
// NewsItemInput:
//   title       : string
//   slug        : string  — URL-safe, unique
//   excerpt     : string  — 50-80 words
//   content     : string  — full article text (paragraphs separated by \n\n)
//   whyItMatters: string  — 1-2 sentences
//   sourceName  : string
//   sourceUrl   : string
//   publishedAt : string  — ISO 8601
//   featured    : boolean
//   category    : string  — e.g. "OpenAI", "Anthropic", "Governance"
// ---------------------------------------------------------

interface NewsItemInput {
  title: string
  slug: string
  excerpt: string
  content: string
  whyItMatters?: string
  sourceName: string
  sourceUrl: string
  publishedAt: string
  featured: boolean
  category?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey, weekNumber, newsItems } = body as {
      apiKey: string
      weekNumber: number
      newsItems: NewsItemInput[]
    }

    // Auth check
    if (apiKey !== process.env.AGENT_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!weekNumber || typeof weekNumber !== 'number') {
      return NextResponse.json({ error: 'weekNumber is required' }, { status: 400 })
    }

    if (!Array.isArray(newsItems) || newsItems.length === 0) {
      return NextResponse.json({ error: 'newsItems array is required and must not be empty' }, { status: 400 })
    }

    console.log(`[Agent] Ingesting ${newsItems.length} news items for week ${weekNumber}...`)
    const payload = await getPayloadClient()

    // Resolve author
    const authorUsers = await payload.find({
      collection: 'users',
      where: {
        or: [
          { role: { equals: 'admin' } },
          { role: { equals: 'editor' } },
        ],
      },
      limit: 1,
    })
    const authorId = authorUsers.docs[0]?.id
    if (!authorId) {
      return NextResponse.json({ error: 'No admin or editor user found' }, { status: 500 })
    }

    const results: Array<{ slug: string; status: 'created' | 'updated' }> = []

    for (const item of newsItems) {
      console.log(`[Agent] Processing: ${item.title}`)

      // Build full content from content + whyItMatters
      const fullContent = item.whyItMatters
        ? `${item.content}\n\nWhy It Matters:\n${item.whyItMatters}`
        : item.content

      const postData = {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        status: 'published',
        publishedAt: item.publishedAt,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        featured: item.featured ?? false,
        content: {
          root: {
            type: 'root',
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            children: fullContent.split('\n\n').map((paragraph: string) => ({
              type: 'paragraph',
              children: [{ type: 'text', text: paragraph.trim(), format: 0, mode: 'normal' }],
            })),
          },
        },
      }

      const existing = await payload.find({
        collection: 'news-items',
        where: { slug: { equals: item.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'news-items',
          id: existing.docs[0].id,
          data: postData as any,
        })
        results.push({ slug: item.slug, status: 'updated' })
      } else {
        await payload.create({
          collection: 'news-items',
          data: postData as any,
        })
        results.push({ slug: item.slug, status: 'created' })
      }
    }

    console.log(`[Agent] Ingest complete for week ${weekNumber}. ${results.length} items processed.`)
    return NextResponse.json({
      success: true,
      weekNumber,
      message: `Ingested ${results.length} news items for week ${weekNumber}`,
      results,
    })
  } catch (error: any) {
    console.error('[Agent] Ingest error:', error)
    return NextResponse.json(
      { error: error.message, details: error.data || error.errors || null },
      { status: 500 },
    )
  }
}
