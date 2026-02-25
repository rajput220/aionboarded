import Link from 'next/link'
import { formatDate, formatDuration } from '@/lib/utils'

export function ContentCard({
    title,
    excerpt,
    href,
    date,
    tag,
    readingTime,
    image,
}: {
    title: string
    excerpt: string
    href: string
    date?: string
    tag?: string
    readingTime?: number
    image?: string
}) {
    return (
        <Link href={href} className="card group block overflow-hidden">
            {image && (
                <div className="aspect-video overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
            )}
            <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    {tag && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
                            {tag}
                        </span>
                    )}
                    {date && (
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {formatDate(date)}
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold mb-2 leading-snug group-hover:text-[var(--color-brand-600)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {excerpt}
                </p>
                {readingTime && (
                    <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                        {readingTime} min read
                    </p>
                )}
            </div>
        </Link>
    )
}

export function EpisodeCard({
    title,
    description,
    href,
    episodeNumber,
    duration,
    date,
}: {
    title: string
    description: string
    href: string
    episodeNumber: number
    duration?: number
    date?: string
}) {
    return (
        <Link href={href} className="card group block p-6">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                    {episodeNumber}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        {date && (
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {formatDate(date)}
                            </span>
                        )}
                        {duration && (
                            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                🎧 {formatDuration(duration)}
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-[var(--color-brand-600)] transition-colors truncate" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </h3>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export function NewsCard({
    title,
    excerpt,
    href,
    sourceName,
    date,
    featured,
}: {
    title: string
    excerpt: string
    href: string
    sourceName?: string
    date?: string
    featured?: boolean
}) {
    return (
        <Link href={href} className="card group block p-6 relative overflow-hidden">
            {featured && (
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        ⭐ Featured
                    </span>
                </div>
            )}
            <div className="flex items-center gap-3 mb-3">
                {sourceName && (
                    <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {sourceName}
                    </span>
                )}
                {date && (
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(date)}
                    </span>
                )}
            </div>
            <h3 className="text-base font-bold mb-2 group-hover:text-[var(--color-brand-600)] transition-colors leading-snug" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h3>
            <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {excerpt}
            </p>
        </Link>
    )
}
