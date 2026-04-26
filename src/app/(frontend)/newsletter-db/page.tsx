import { getPayloadClient } from '@/lib/payload'
import { SubscribeForm } from '@/components/ui/SubscribeForm'
import { formatDate } from '@/lib/utils'
import { generateSeo } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = generateSeo({
    title: 'Newsletter Archive',
    description: 'Browse past issues of the AI Onboarded weekly newsletter. AI insights delivered to your inbox.',
})

export const dynamic = 'force-dynamic'

export default async function NewsletterPage() {
    const payload = await getPayloadClient()
    const issues = await payload.find({
        collection: 'newsletter-issues',
        where: { status: { equals: 'published' } },
        sort: '-issueNumber',
        limit: 50,
    })

    return (
        <div className="pt-36 lg:pt-44 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header + Subscribe */}
                <div className="max-w-2xl mb-16">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                        Newsletter
                    </h1>
                    <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Weekly AI insights, tool reviews, and news — curated for builders and enthusiasts.
                    </p>
                    <SubscribeForm />
                    <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Free weekly newsletter. No spam, unsubscribe anytime.
                    </p>
                </div>

                {/* Archive */}
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Archive</h2>
                {issues.docs.length > 0 ? (
                    <div className="grid gap-4">
                        {issues.docs.map((issue: any) => (
                            <Link key={issue.id} href={`/newsletter/${issue.slug}`} className="card group block p-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                                        #{issue.issueNumber}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold group-hover:text-[var(--color-brand-600)] transition-colors truncate" style={{ color: 'var(--text-primary)' }}>
                                            {issue.title}
                                        </h3>
                                        <p className="text-sm line-clamp-1 mt-1" style={{ color: 'var(--text-secondary)' }}>
                                            {issue.excerpt}
                                        </p>
                                    </div>
                                    {issue.publishedAt && (
                                        <span className="text-sm shrink-0 hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                                            {formatDate(issue.publishedAt)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            No issues yet. Subscribe to be the first to know!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
