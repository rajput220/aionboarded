'use client'

import { useState } from 'react'

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus('success')
                setMessage(data.message || 'Check your email to confirm your subscription!')
                setEmail('')
            } else {
                setStatus('error')
                setMessage(data.error || 'Something went wrong. Please try again.')
            }
        } catch {
            setStatus('error')
            setMessage('Network error. Please try again.')
        }
    }

    if (status === 'success') {
        return (
            <div className={`flex items-center gap-2 ${compact ? 'text-sm' : 'text-base'}`}>
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ color: 'var(--text-secondary)' }}>{message}</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className={`flex ${compact ? 'flex-col gap-2' : 'flex-col sm:flex-row gap-2'}`}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={`flex-1 px-4 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent ${compact ? 'py-2.5 text-sm' : 'py-3 text-base'
                        }`}
                    style={{
                        background: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                    }}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`gradient-bg text-white font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-60 shadow-md ${compact ? 'px-4 py-2.5 text-sm' : 'px-6 py-3 text-base'
                        }`}
                >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
            </div>
            {status === 'error' && (
                <p className="text-sm text-red-500">{message}</p>
            )}
        </form>
    )
}
