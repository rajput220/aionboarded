'use client'

import { useState } from 'react'
import { generateSeo } from '@/lib/seo'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setStatus('success')
                setForm({ name: '', email: '', message: '' })
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    return (
        <div className="pt-36 lg:pt-44 pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                    Contact Us
                </h1>
                <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
                    Have a question, suggestion, or want to collaborate? We&apos;d love to hear from you.
                </p>

                {status === 'success' ? (
                    <div className="card p-8 text-center">
                        <div className="text-4xl mb-4">✉️</div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We&apos;ll get back to you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                Message
                            </label>
                            <textarea
                                id="message"
                                required
                                rows={5}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent resize-y"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3 rounded-xl text-white font-semibold gradient-bg hover:opacity-90 transition-opacity disabled:opacity-60 shadow-md"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>
                        {status === 'error' && (
                            <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    )
}
