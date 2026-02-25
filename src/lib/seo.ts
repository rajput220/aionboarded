import type { Metadata } from 'next'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'AI Onboarded'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

interface SeoParams {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    publishedAt?: string
    author?: string
}

export function generateSeo({
    title,
    description = 'AI Onboarded — Creating awareness and sharing knowledge on AI tools and latest AI developments.',
    image,
    url,
    type = 'website',
    publishedAt,
    author,
}: SeoParams = {}): Metadata {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const ogImage = image || `${SITE_URL}/og-default.png`

    return {
        title: fullTitle,
        description,
        metadataBase: new URL(SITE_URL),
        openGraph: {
            title: fullTitle,
            description,
            url: url || SITE_URL,
            siteName: SITE_NAME,
            images: [{ url: ogImage, width: 1200, height: 630 }],
            locale: 'en_US',
            type,
            ...(publishedAt && { publishedTime: publishedAt }),
            ...(author && { authors: [author] }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: url || SITE_URL,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    }
}

export function generateArticleStructuredData({
    title,
    description,
    image,
    url,
    publishedAt,
    author,
}: {
    title: string
    description: string
    image?: string
    url: string
    publishedAt: string
    author: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image: image || `${SITE_URL}/og-default.png`,
        url,
        datePublished: publishedAt,
        author: {
            '@type': 'Person',
            name: author,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
    }
}

export function generatePodcastEpisodeStructuredData({
    title,
    description,
    url,
    publishedAt,
    duration,
    audioUrl,
}: {
    title: string
    description: string
    url: string
    publishedAt: string
    duration?: number
    audioUrl?: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'PodcastEpisode',
        name: title,
        description,
        url,
        datePublished: publishedAt,
        ...(duration && { timeRequired: `PT${duration}M` }),
        ...(audioUrl && {
            associatedMedia: {
                '@type': 'MediaObject',
                contentUrl: audioUrl,
            },
        }),
        partOfSeries: {
            '@type': 'PodcastSeries',
            name: SITE_NAME,
            url: `${SITE_URL}/podcast`,
        },
    }
}
