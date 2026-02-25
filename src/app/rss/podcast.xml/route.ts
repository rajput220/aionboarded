import { getPayloadClient } from '@/lib/payload'

export async function GET() {
    const payload = await getPayloadClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const episodes = await payload.find({
        collection: 'podcast-episodes',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 50,
        depth: 1,
    })

    const items = episodes.docs
        .map((ep: any) => {
            const audioUrl = ep.audioFile?.url ? `${siteUrl}${ep.audioFile.url}` : ''
            return `
    <item>
      <title><![CDATA[${ep.title}]]></title>
      <link>${siteUrl}/podcast/${ep.slug}</link>
      <guid>${siteUrl}/podcast/${ep.slug}</guid>
      <description><![CDATA[${ep.description}]]></description>
      <pubDate>${new Date(ep.publishedAt).toUTCString()}</pubDate>
      ${audioUrl ? `<enclosure url="${audioUrl}" type="audio/mpeg"/>` : ''}
      ${ep.duration ? `<itunes:duration>${ep.duration * 60}</itunes:duration>` : ''}
      <itunes:episode>${ep.episodeNumber}</itunes:episode>
      <itunes:season>${ep.seasonNumber || 1}</itunes:season>
    </item>`
        })
        .join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>AI Onboarded Podcast</title>
    <link>${siteUrl}/podcast</link>
    <description>Conversations about AI tools, emerging trends, and the people building the future of artificial intelligence.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss/podcast.xml" rel="self" type="application/rss+xml"/>
    <itunes:author>AI Onboarded</itunes:author>
    <itunes:category text="Technology"/>
    ${items}
  </channel>
</rss>`

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    })
}
