import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/ui/RichText'
import { formatDate, formatDuration } from '@/lib/utils'
import { generateSeo, generatePodcastEpisodeStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'podcast-episodes',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
    })
    const ep = result.docs[0] as any
    if (!ep) return {}
    return generateSeo({
        title: `Ep ${ep.episodeNumber}: ${ep.title}`,
        description: ep.description,
        url: `/podcast/${ep.slug}`,
    })
}

export const dynamic = 'force-dynamic'

export default async function PodcastEpisodePage({ params }: Props) {
    const { slug } = await params
    const payload = await getPayloadClient()
    const result = await payload.find({
        collection: 'podcast-episodes',
        where: { slug: { equals: slug }, status: { equals: 'published' } },
        limit: 1,
        depth: 2,
    })

    const ep = result.docs[0] as any
    if (!ep) notFound()

    const structuredData = generatePodcastEpisodeStructuredData({
        title: ep.title,
        description: ep.description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/podcast/${ep.slug}`,
        publishedAt: ep.publishedAt,
        duration: ep.duration,
        audioUrl: ep.audioFile?.url,
    })

    // Extract Spotify embed ID
    const spotifyEmbedUrl = ep.spotifyUrl
        ? ep.spotifyUrl.replace('open.spotify.com/', 'open.spotify.com/embed/')
        : null

    // Extract YouTube embed ID
    const youtubeId = ep.youtubeUrl
        ? ep.youtubeUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/)?.[1]
        : null

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <article className="pt-36 lg:pt-44 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Link href="/podcast" className="hover:text-[var(--color-brand-600)] transition-colors">Podcast</Link>
                        <span className="mx-2">→</span>
                        <span style={{ color: 'var(--text-primary)' }}>Episode {ep.episodeNumber}</span>
                    </nav>

                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                                {ep.episodeNumber}
                            </div>
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Season {ep.seasonNumber || 1} · Episode {ep.episodeNumber}
                                </p>
                                {ep.publishedAt && (
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {formatDate(ep.publishedAt)} {ep.duration ? `· ${formatDuration(ep.duration)}` : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                            {ep.title}
                        </h1>
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            {ep.description}
                        </p>
                    </header>

                    {/* Audio Player */}
                    {ep.audioFile?.url && (
                        <div className="mb-8 card p-6">
                            <audio controls className="w-full" preload="metadata">
                                <source src={ep.audioFile.url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}

                    {/* Platform Links */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        {ep.spotifyUrl && (
                            <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#1DB954] text-white hover:opacity-90 transition-opacity shadow-md">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                                Spotify
                            </a>
                        )}
                        {ep.applePodcastUrl && (
                            <a href={ep.applePodcastUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#9933CC] text-white hover:opacity-90 transition-opacity shadow-md">
                                Apple Podcasts
                            </a>
                        )}
                        {ep.youtubeUrl && (
                            <a href={ep.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#FF0000] text-white hover:opacity-90 transition-opacity shadow-md">
                                YouTube
                            </a>
                        )}
                    </div>

                    {/* Spotify Embed */}
                    {spotifyEmbedUrl && (
                        <div className="mb-8">
                            <iframe
                                src={spotifyEmbedUrl}
                                width="100%"
                                height="152"
                                allow="encrypted-media"
                                loading="lazy"
                                className="rounded-xl"
                                style={{ border: 'none' }}
                            />
                        </div>
                    )}

                    {/* YouTube Embed */}
                    {youtubeId && (
                        <div className="mb-8 aspect-video rounded-2xl overflow-hidden">
                            <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                width="100%"
                                height="100%"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                                className="w-full h-full"
                                style={{ border: 'none' }}
                            />
                        </div>
                    )}

                    {/* Show Notes */}
                    {ep.showNotes && (
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Show Notes</h2>
                            <RichText content={ep.showNotes} />
                        </section>
                    )}

                    {/* Transcript */}
                    {ep.transcript && (
                        <section className="mb-10 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Transcript</h2>
                            <RichText content={ep.transcript} />
                        </section>
                    )}

                    {/* Tags */}
                    {ep.tags?.length > 0 && (
                        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tags:</span>
                                {ep.tags.map((tag: any) => (
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
