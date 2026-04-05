import { getPayloadClient } from '@/lib/payload'
import { generateSeo } from '@/lib/seo'
import type { Metadata } from 'next'
import NewsArchiveClient from './NewsArchiveClient'

export const metadata: Metadata = generateSeo({
    title: 'AI Developments',
    description: 'Browse weekly AI developments, tools, and curated news — organized by week.',
})

export const dynamic = 'force-dynamic'

function getWeekLabel(dateStr: string): string {
    const d = new Date(dateStr)
    // get Monday of that week
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(d.setDate(diff))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const fmt = (dt: Date) =>
        dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    return `${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`
}

function getWeekKey(dateStr: string): string {
    const d = new Date(dateStr)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(d.setDate(diff))
    return monday.toISOString().split('T')[0]
}

export default async function NewsPage() {
    const payload = await getPayloadClient()

    const allNews = await payload.find({
        collection: 'news-items',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 200,
    })

    // Group by week
    const weekMap = new Map<string, { label: string; items: any[] }>()

    for (const item of allNews.docs) {
        const key = getWeekKey(item.publishedAt as string)
        if (!weekMap.has(key)) {
            weekMap.set(key, {
                label: getWeekLabel(item.publishedAt as string),
                items: [],
            })
        }
        weekMap.get(key)!.items.push(item)
    }

    // Convert to sorted array (newest first)
    const weeks = Array.from(weekMap.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, val]) => ({ key, ...val }))

    return <NewsArchiveClient weeks={weeks} />
}
