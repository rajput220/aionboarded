import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/ui/RichText'
import { formatDate } from '@/lib/utils'
import { generateSeo, generateArticleStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'news-items',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
    })
    const item = result.docs[0] as any
    if (!item) return {}
    return generateSeo({
        title: item.title,
        description: item.excerpt,
        url: `/news/${item.slug}`,
        type: 'article',
    })
}

export const dynamic = 'force-dynamic'

export default async function NewsItemPage({ params }: Props) {
    const { slug } = await params
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'news-items',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
        depth: 2,
    })

    const item = result.docs[0] as any
    if (!item) notFound()

    return (
        <article className="pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Link href="/news" className="hover:text-[var(--color-brand-600)] transition-colors">AI Developments</Link>
                    <span className="mx-2">→</span>
                    <span style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                </nav>

                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {item.sourceName && (
                            <span className="text-xs font-medium px-3 py-1 rounded-md" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                Source: {item.sourceName}
                            </span>
                        )}
                        {item.publishedAt && (
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {formatDate(item.publishedAt)}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                    </h1>
                    {item.sourceUrl && (
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-brand-600)] hover:text-[var(--color-brand-500)] transition-colors">
                            View original source →
                        </a>
                    )}
                </header>

                {item.heroImage?.url && (
                    <div className="mb-10 rounded-2xl overflow-hidden">
                        <img src={item.heroImage.url} alt={item.heroImage.alt || item.title} className="w-full" />
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <RichText content={item.content} />
                </div>

                {item.tags?.length > 0 && (
                    <div className="max-w-3xl mx-auto mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tags:</span>
                            {item.tags.map((tag: any) => (
                                <span key={tag.id} className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    )
}
