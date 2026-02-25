import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET() {
    const payload = await getPayloadClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const [posts, episodes, newsletters, news] = await Promise.all([
        payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, limit: 1000 }),
        payload.find({ collection: 'podcast-episodes', where: { status: { equals: 'published' } }, limit: 1000 }),
        payload.find({ collection: 'newsletter-issues', where: { status: { equals: 'published' } }, limit: 1000 }),
        payload.find({ collection: 'news-items', where: { status: { equals: 'published' } }, limit: 1000 }),
    ])

    const staticPages = [
        { loc: siteUrl, priority: '1.0', changefreq: 'daily' },
        { loc: `${siteUrl}/blog`, priority: '0.9', changefreq: 'daily' },
        { loc: `${siteUrl}/podcast`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${siteUrl}/newsletter`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${siteUrl}/news`, priority: '0.9', changefreq: 'daily' },
        { loc: `${siteUrl}/about`, priority: '0.7', changefreq: 'monthly' },
        { loc: `${siteUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
    ]

    const blogPages = posts.docs.map((p: any) => ({
        loc: `${siteUrl}/blog/${p.slug}`,
        lastmod: p.updatedAt || p.publishedAt,
        priority: '0.8',
        changefreq: 'weekly',
    }))

    const podcastPages = episodes.docs.map((ep: any) => ({
        loc: `${siteUrl}/podcast/${ep.slug}`,
        lastmod: ep.updatedAt || ep.publishedAt,
        priority: '0.8',
        changefreq: 'monthly',
    }))

    const newsletterPages = newsletters.docs.map((i: any) => ({
        loc: `${siteUrl}/newsletter/${i.slug}`,
        lastmod: i.updatedAt || i.publishedAt,
        priority: '0.7',
        changefreq: 'monthly',
    }))

    const newsPages = news.docs.map((n: any) => ({
        loc: `${siteUrl}/news/${n.slug}`,
        lastmod: n.updatedAt || n.publishedAt,
        priority: '0.7',
        changefreq: 'weekly',
    }))

    const allUrls: Array<{ loc: string; priority: string; changefreq: string; lastmod?: string }> = [...staticPages, ...blogPages, ...podcastPages, ...newsletterPages, ...newsPages]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    })
}
