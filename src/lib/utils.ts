export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function formatDateShort(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ')
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str
    return str.slice(0, length).trimEnd() + '…'
}

export function formatDuration(minutes: number): string {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hrs > 0) return `${hrs}h ${mins}m`
    return `${mins} min`
}

export function getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
