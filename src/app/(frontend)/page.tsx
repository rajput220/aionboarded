import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { SubscribeForm } from '@/components/ui/SubscribeForm'
import { ContentCard, EpisodeCard, NewsCard } from '@/components/ui/ContentCards'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [blogPosts, episodes, newsletters, newsItems] = await Promise.all([
    payload.find({ collection: 'blog-posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 3 }),
    payload.find({ collection: 'podcast-episodes', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 3 }),
    payload.find({ collection: 'newsletter-issues', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 1 }),
    payload.find({ collection: 'news-items', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 4 }),
  ])

  const latestNewsletter = newsletters.docs[0]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-bg-subtle" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-brand-400)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-[var(--color-accent-400)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              100+ members and growing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]" style={{ color: 'var(--text-primary)' }}>
              Navigate the Future of{' '}
              <span className="gradient-text">Artificial Intelligence</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Your weekly guide to AI tools, developments, and insights. Join our community of
              innovators, builders, and curious minds exploring the AI revolution.
            </p>

            <div className="max-w-md mx-auto">
              <SubscribeForm />
              <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                Free weekly newsletter. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { value: '100+', label: 'Community Members' },
              { value: `${episodes.totalDocs}+`, label: 'Podcast Episodes' },
              { value: `${newsletters.totalDocs}+`, label: 'Newsletter Issues' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Newsletter */}
      {latestNewsletter && (
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Latest Newsletter</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Issue #{(latestNewsletter as any).issueNumber}</p>
              </div>
              <Link href="/newsletter" className="text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-500)] transition-colors">
                View all →
              </Link>
            </div>
            <Link href={`/newsletter/${(latestNewsletter as any).slug}`} className="card block p-8 group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
                  #{(latestNewsletter as any).issueNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-brand-600)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {(latestNewsletter as any).title}
                  </h3>
                  <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                    {(latestNewsletter as any).excerpt}
                  </p>
                </div>
                <span className="text-sm font-medium text-[var(--color-brand-600)]">Read →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Latest Podcast Episodes */}
      {episodes.docs.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Latest Episodes</h2>
              <Link href="/podcast" className="text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-500)] transition-colors">
                All episodes →
              </Link>
            </div>
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
          </div>
        </section>
      )}

      {/* AI News / Updates */}
      {newsItems.docs.length > 0 && (
        <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Developments</h2>
              <Link href="/news" className="text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-500)] transition-colors">
                All news →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {newsItems.docs.map((item: any) => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  href={`/news/${item.slug}`}
                  sourceName={item.sourceName}
                  date={item.publishedAt}
                  featured={item.featured}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Blog Posts */}
      {blogPosts.docs.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Latest from the Blog</h2>
              <Link href="/blog" className="text-sm font-medium text-[var(--color-brand-600)] hover:text-[var(--color-brand-500)] transition-colors">
                All posts →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.docs.map((post: any) => (
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Ahead of the AI Curve</h2>
          <p className="text-lg opacity-90 mb-8">
            Get curated AI insights, tool reviews, and development updates delivered to your inbox every week.
          </p>
          <div className="max-w-md mx-auto">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  )
}
