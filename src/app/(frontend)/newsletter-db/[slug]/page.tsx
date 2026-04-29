import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/ui/RichText'
import { formatDate } from '@/lib/utils'
import { generateSeo } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'newsletter-issues',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
    })
    const issue = result.docs[0] as any
    if (!issue) return {}
    return generateSeo({
        title: `Issue #${issue.issueNumber}: ${issue.title}`,
        description: issue.excerpt,
        url: `/newsletter/${issue.slug}`,
        type: 'article',
    })
}

export const dynamic = 'force-dynamic'

export default async function NewsletterIssuePage({ params }: Props) {
    const { slug } = await params
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'newsletter-issues',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
        depth: 2,
    })

    const issue = result.docs[0] as any
    if (!issue) notFound()

    return (
        <article className="pt-36 lg:pt-44 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Link href="/newsletter" className="hover:text-[var(--color-brand-600)] transition-colors">Newsletter</Link>
                    <span className="mx-2">→</span>
                    <span style={{ color: 'var(--text-primary)' }}>Issue #{issue.issueNumber}</span>
                </nav>

                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-bold px-3 py-1 rounded-full gradient-bg text-white">
                            Issue #{issue.issueNumber}
                        </span>
                        {issue.publishedAt && (
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {formatDate(issue.publishedAt)}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                        {issue.title}
                    </h1>
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                        {issue.excerpt}
                    </p>
                </header>

                <div className="max-w-3xl mx-auto">
                    <RichText content={issue.content} />
                </div>

                {issue.tags?.length > 0 && (
                    <div className="max-w-3xl mx-auto mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tags:</span>
                            {issue.tags.map((tag: any) => (
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
