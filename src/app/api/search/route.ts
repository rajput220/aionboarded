import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get('q')
        if (!q || q.length < 2) {
            return NextResponse.json({ blogPosts: [], podcastEpisodes: [], newsletterIssues: [], newsItems: [] })
        }

        const payload = await getPayloadClient()

        const searchFilter = (field: string) => ({
            and: [
                { status: { equals: 'published' as const } },
                { [field]: { contains: q } },
            ],
        })

        const [blogPosts, podcastEpisodes, newsletterIssues, newsItems] = await Promise.all([
            payload.find({
                collection: 'blog-posts',
                where: searchFilter('title'),
                sort: '-publishedAt',
                limit: 10,
            }),
            payload.find({
                collection: 'podcast-episodes',
                where: searchFilter('title'),
                sort: '-publishedAt',
                limit: 10,
            }),
            payload.find({
                collection: 'newsletter-issues',
                where: searchFilter('title'),
                sort: '-publishedAt',
                limit: 10,
            }),
            payload.find({
                collection: 'news-items',
                where: searchFilter('title'),
                sort: '-publishedAt',
                limit: 10,
            }),
        ])

        return NextResponse.json({
            blogPosts: blogPosts.docs,
            podcastEpisodes: podcastEpisodes.docs,
            newsletterIssues: newsletterIssues.docs,
            newsItems: newsItems.docs,
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
}
