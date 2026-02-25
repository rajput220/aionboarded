import { getPayloadClient } from '@/lib/payload'
import { NewsCard } from '@/components/ui/ContentCards'
import { generateSeo } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSeo({
    title: 'AI Developments',
    description: 'Stay updated with the latest AI developments, tools, and curated news from across the industry.',
})

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
    const payload = await getPayloadClient()

    const [featured, allNews] = await Promise.all([
        payload.find({
            collection: 'news-items',
            where: { status: { equals: 'published' }, featured: { equals: true } },
            sort: '-publishedAt',
            limit: 5,
        }),
        payload.find({
            collection: 'news-items',
            where: { status: { equals: 'published' } },
            sort: '-publishedAt',
            limit: 20,
        }),
    ])

    return (
        <div className="pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                        AI Developments
                    </h1>
                    <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                        Curated news and updates from the world of artificial intelligence.
                    </p>
                </div>

                {/* Top 5 This Week */}
                {featured.docs.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <span className="text-amber-500">⭐</span> Top This Week
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {featured.docs.map((item: any) => (
                                <NewsCard
                                    key={item.id}
                                    title={item.title}
                                    excerpt={item.excerpt}
                                    href={`/news/${item.slug}`}
                                    sourceName={item.sourceName}
                                    date={item.publishedAt}
                                    featured
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* All News */}
                <section>
                    <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>All Updates</h2>
                    {allNews.docs.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {allNews.docs.map((item: any) => (
                                <NewsCard
                                    key={item.id}
                                    title={item.title}
                                    excerpt={item.excerpt}
                                    href={`/news/${item.slug}`}
                                    sourceName={item.sourceName}
                                    date={item.publishedAt}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                                No news yet. Check back soon!
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
