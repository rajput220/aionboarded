'use client'

import { useState } from 'react'
import { ContentCard, EpisodeCard, NewsCard } from '@/components/ui/ContentCards'

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setResults(data)
        } catch {
            setResults({ blogPosts: [], podcastEpisodes: [], newsletterIssues: [], newsItems: [] })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl font-black mb-8" style={{ color: 'var(--text-primary)' }}>
                    Search
                </h1>

                <form onSubmit={handleSearch} className="mb-12">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: 'var(--text-secondary)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search blog posts, episodes, newsletters, news..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl border text-lg outline-none transition-all focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 rounded-xl text-white font-semibold gradient-bg hover:opacity-90 transition-opacity disabled:opacity-60 shadow-md"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {results && (
                    <div className="space-y-12">
                        {/* Blog Posts */}
                        {results.blogPosts?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Blog Posts</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {results.blogPosts.map((post: any) => (
                                        <ContentCard
                                            key={post.id}
                                            title={post.title}
                                            excerpt={post.excerpt}
                                            href={`/blog/${post.slug}`}
                                            date={post.publishedAt}
                                            readingTime={post.readingTime}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Podcast Episodes */}
                        {results.podcastEpisodes?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Podcast Episodes</h2>
                                <div className="grid gap-4">
                                    {results.podcastEpisodes.map((ep: any) => (
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
                            </section>
                        )}

                        {/* Newsletter Issues */}
                        {results.newsletterIssues?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Newsletter Issues</h2>
                                <div className="grid gap-4">
                                    {results.newsletterIssues.map((issue: any) => (
                                        <ContentCard
                                            key={issue.id}
                                            title={issue.title}
                                            excerpt={issue.excerpt}
                                            href={`/newsletter/${issue.slug}`}
                                            date={issue.publishedAt}
                                            tag={`Issue #${issue.issueNumber}`}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* News Items */}
                        {results.newsItems?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>AI Developments</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {results.newsItems.map((item: any) => (
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
                            </section>
                        )}

                        {/* No Results */}
                        {!results.blogPosts?.length && !results.podcastEpisodes?.length &&
                            !results.newsletterIssues?.length && !results.newsItems?.length && (
                                <div className="card p-12 text-center">
                                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                                        No results found for &quot;{query}&quot;. Try a different search term.
                                    </p>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    )
}
