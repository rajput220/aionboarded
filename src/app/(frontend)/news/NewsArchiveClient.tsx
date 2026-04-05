'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NewsItem {
    id: string
    title: string
    slug: string
    excerpt?: string
    sourceName?: string
    sourceUrl?: string
    publishedAt: string
    featured?: boolean
    heroImage?: { url?: string; alt?: string }
}

interface Week {
    key: string
    label: string
    items: NewsItem[]
}

interface Props {
    weeks: Week[]
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

// Week theme metadata (hardcoded for known weeks, falls back gracefully)
const weekThemes: Record<string, { title: string; theme: string; emoji: string }> = {
    '2026-03-30': {
        title: 'Week 11',
        theme: 'From Models to Ecosystems — AI Swallows the Enterprise Stack',
        emoji: '🏗️',
    },
    '2026-03-23': {
        title: 'Week 10',
        theme: 'The Agentic Inflection — AI Becomes Your Digital Coworker',
        emoji: '🤖',
    },
    '2026-03-16': {
        title: 'Week 9',
        theme: "The Intelligence Layer — AI's Enterprise Acceleration",
        emoji: '⚡',
    },
}

export default function NewsArchiveClient({ weeks }: Props) {
    const [activeWeek, setActiveWeek] = useState<string>(weeks[0]?.key ?? '')

    const currentWeek = weeks.find((w) => w.key === activeWeek)
    const featuredItems = currentWeek?.items.filter((i) => i.featured) ?? []
    const otherItems = currentWeek?.items.filter((i) => !i.featured) ?? []
    const meta = weekThemes[activeWeek]

    return (
        <div className="pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                        AI Developments
                    </h1>
                    <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                        Weekly intelligence briefings — browse by week or scroll the full archive.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── Sidebar: Week selector ── */}
                    <aside className="lg:w-64 shrink-0">
                        <div
                            className="sticky top-24 rounded-2xl border p-4"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                        >
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 px-1" style={{ color: 'var(--text-secondary)' }}>
                                Browse by Week
                            </h2>
                            <nav className="flex flex-col gap-1">
                                {weeks.map((week) => {
                                    const m = weekThemes[week.key]
                                    const isActive = week.key === activeWeek
                                    return (
                                        <button
                                            key={week.key}
                                            onClick={() => setActiveWeek(week.key)}
                                            className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 group ${
                                                isActive
                                                    ? 'gradient-bg text-white shadow-md'
                                                    : 'hover:bg-[var(--bg-tertiary)]'
                                            }`}
                                        >
                                            <div className={`text-sm font-bold flex items-center gap-2 ${isActive ? 'text-white' : ''}`} style={isActive ? {} : { color: 'var(--text-primary)' }}>
                                                <span>{m?.emoji ?? '📰'}</span>
                                                <span>{m?.title ?? week.label.split(',')[0]}</span>
                                            </div>
                                            <div className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : ''}`} style={isActive ? {} : { color: 'var(--text-secondary)' }}>
                                                {week.label}
                                            </div>
                                            <div className={`text-xs mt-1 ${isActive ? 'text-white/70' : ''}`} style={isActive ? {} : { color: 'var(--text-secondary)' }}>
                                                {week.items.length} stories
                                            </div>
                                        </button>
                                    )
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* ── Main Content ── */}
                    <main className="flex-1 min-w-0">

                        {/* Week Banner */}
                        {currentWeek && (
                            <div
                                className="mb-8 p-5 rounded-2xl border"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">{meta?.emoji ?? '📅'}</span>
                                            <span
                                                className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                                            >
                                                {meta?.title ?? 'Weekly Briefing'}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                                            {currentWeek.label}
                                        </h2>
                                        {meta && (
                                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                                {meta.theme}
                                            </p>
                                        )}
                                    </div>
                                    <span
                                        className="shrink-0 text-sm font-medium px-3 py-1 rounded-full"
                                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                                    >
                                        {currentWeek.items.length} stories
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Featured stories */}
                        {featuredItems.length > 0 && (
                            <section className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="text-amber-500">⭐</span> Top This Week
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {featuredItems.map((item) => (
                                        <NewsItemCard key={item.id} item={item} featured />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Other stories */}
                        {otherItems.length > 0 && (
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
                                    All Stories This Week
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {otherItems.map((item) => (
                                        <NewsItemCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {currentWeek?.items.length === 0 && (
                            <div className="card p-12 text-center">
                                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                                    No stories for this week yet.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

function NewsItemCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
    return (
        <Link
            href={`/news/${item.slug}`}
            className="card group block p-5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}
        >
            {item.heroImage?.url && (
                <img
                    src={item.heroImage.url}
                    alt={item.heroImage.alt || item.title}
                    className="w-full h-36 object-cover rounded-xl mb-4"
                    style={{ objectFit: 'cover' }}
                />
            )}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                {featured && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        ⭐ Featured
                    </span>
                )}
                {item.sourceName && (
                    <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    >
                        {item.sourceName}
                    </span>
                )}
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(item.publishedAt)}
                </span>
            </div>
            <h3
                className="font-bold text-base leading-snug mb-2 group-hover:text-[var(--color-brand-600)] transition-colors"
                style={{ color: 'var(--text-primary)' }}
            >
                {item.title}
            </h3>
            {item.excerpt && (
                <p className="text-sm line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                    {item.excerpt}
                </p>
            )}
        </Link>
    )
}
