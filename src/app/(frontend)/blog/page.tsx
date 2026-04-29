import { getPayloadClient } from '@/lib/payload'
import { ContentCard } from '@/components/ui/ContentCards'
import { generateSeo } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSeo({
    title: 'Blog',
    description: 'Latest articles on AI tools, developments, and insights from the AI Onboarded community.',
})

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
    const payload = await getPayloadClient()
    const posts = await payload.find({
        collection: 'blog-posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 20,
        depth: 2,
    })

    return (
        <div className="pt-36 lg:pt-44 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                        Blog
                    </h1>
                    <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                        Deep dives, tutorials, and insights on AI tools and the latest developments in artificial intelligence.
                    </p>
                </div>

                {/* Posts Grid */}
                {posts.docs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.docs.map((post: any) => (
                            <ContentCard
                                key={post.id}
                                title={post.title}
                                excerpt={post.excerpt}
                                href={`/blog/${post.slug}`}
                                date={post.publishedAt}
                                readingTime={post.readingTime}
                                image={post.heroImage?.url}
                                tag={post.categories?.[0]?.name}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            No posts yet. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
