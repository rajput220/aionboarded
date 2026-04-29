import { getPayloadClient } from '@/lib/payload'
import { EpisodeCard } from '@/components/ui/ContentCards'
import { generateSeo } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSeo({
    title: 'Podcast',
    description: 'Listen to the AI Onboarded podcast — conversations about AI tools, trends, and the people building the future.',
})

export const dynamic = 'force-dynamic'

export default async function PodcastPage() {
    const payload = await getPayloadClient()
    const episodes = await payload.find({
        collection: 'podcast-episodes',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 50,
    })

    return (
        <div className="pt-36 lg:pt-44 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>Podcast</h1>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                {1 + episodes.totalDocs} episode{ (1 + episodes.totalDocs) !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                        Conversations about AI tools, emerging trends, and the people building the future of artificial intelligence.
                    </p>
                </div>

                {/* Episodes */}
                {episodes.docs.length > 0 ? (
                    <div className="grid gap-4">
                        {episodes.docs.map((ep: any) => (
                            <EpisodeCard
                                key={ep.id}
                                title={ep.title}
                                description={ep.description}
                                href={`/podcast/${ep.slug}`}
                                episodeNumber={ep.episodeNumber}
                                duration={ep.duration}
                                date={ep.publishedAt}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            No episodes yet. Stay tuned!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
