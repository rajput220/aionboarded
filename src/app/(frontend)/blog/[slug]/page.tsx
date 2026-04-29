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
        collection: 'blog-posts',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
        depth: 2,
    })
    const post = result.docs[0] as any
    if (!post) return {}
    return generateSeo({
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        image: post.seo?.ogImage?.url || post.heroImage?.url,
        url: `/blog/${post.slug}`,
        type: 'article',
        publishedAt: post.publishedAt,
        author: post.author?.name,
    })
}

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'blog-posts',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
        depth: 2,
    })

    const post = result.docs[0] as any
    if (!post) notFound()

    const structuredData = generateArticleStructuredData({
        title: post.title,
        description: post.excerpt,
        image: post.heroImage?.url,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
        publishedAt: post.publishedAt,
        author: post.author?.name || 'AI Onboarded',
    })

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <article className="pt-36 lg:pt-44 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Link href="/blog" className="hover:text-[var(--color-brand-600)] transition-colors">Blog</Link>
                        <span className="mx-2">→</span>
                        <span style={{ color: 'var(--text-primary)' }}>{post.title}</span>
                    </nav>

                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {post.categories?.map((cat: any) => (
                                <span key={cat.id} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4">
                            {post.author?.avatar?.url && (
                                <img src={post.author.avatar.url} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{post.author?.name}</p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {post.publishedAt && formatDate(post.publishedAt)} · {post.readingTime || 5} min read
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Hero Image */}
                    {post.heroImage?.url && (
                        <div className="mb-10 rounded-2xl overflow-hidden">
                            <img src={post.heroImage.url} alt={post.heroImage.alt || post.title} className="w-full" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="max-w-3xl mx-auto">
                        <RichText content={post.content} />
                    </div>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tags:</span>
                                {post.tags.map((tag: any) => (
                                    <span key={tag.id} className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </>
    )
}
