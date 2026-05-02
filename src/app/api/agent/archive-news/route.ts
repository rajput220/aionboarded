import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// ---------------------------------------------------------
// POST /api/agent/archive-news
//
// Archives news items older than N weeks by setting their
// status to 'archived'. Keeps the website news section fresh
// with only the most recent content. Secured by AGENT_API_KEY.
//
// Body:
//   apiKey       : string  — must match AGENT_API_KEY
//   keepWeeks    : number  — number of weeks to keep active (default: 4)
// ---------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey, keepWeeks = 4 } = body as {
      apiKey: string
      keepWeeks?: number
    }

    // Auth check
    if (apiKey !== process.env.AGENT_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate cutoff date
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - keepWeeks * 7)
    const cutoffISO = cutoffDate.toISOString()

    console.log(`[Agent] Archiving news items published before ${cutoffISO} (keepWeeks=${keepWeeks})`)

    const payload = await getPayloadClient()

    // Find articles older than cutoff that are still published
    const oldArticles = await payload.find({
      collection: 'news-items',
      where: {
        and: [
          { status: { equals: 'published' } },
          { publishedAt: { less_than: cutoffISO } },
        ],
      },
      limit: 500,
    })

    console.log(`[Agent] Found ${oldArticles.totalDocs} articles to archive`)

    const archived: string[] = []
    for (const article of oldArticles.docs) {
      await payload.update({
        collection: 'news-items',
        id: article.id,
        data: { status: 'archived' } as any,
      })
      archived.push(article.id as string)
    }

    console.log(`[Agent] Archived ${archived.length} articles`)
    return NextResponse.json({
      success: true,
      keepWeeks,
      cutoffDate: cutoffISO,
      archivedCount: archived.length,
      archivedIds: archived,
    })
  } catch (error: any) {
    console.error('[Agent] Archive error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET — check how many active articles exist
export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get('apiKey')
  if (apiKey !== process.env.AGENT_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const active = await payload.find({
    collection: 'news-items',
    where: { status: { equals: 'published' } },
    limit: 0,
  })

  return NextResponse.json({ publishedCount: active.totalDocs })
}
