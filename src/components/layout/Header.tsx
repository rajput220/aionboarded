'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Podcast', href: '/podcast' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'shadow-lg'
            : 'bg-transparent'
        }`}
        style={
          scrolled || mobileOpen
            ? { background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }
            : undefined
        }
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
              <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="AI Onboarded Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                AI <span className="gradient-text">Onboarded</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Link
                href="/search"
                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                aria-label="Toggle theme"
              >
                {dark ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                )}
              </button>

              {/* Subscribe CTA — hidden on mobile */}
              <Link
                href="/newsletter"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-md"
              >
                Subscribe
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu — Full-screen overlay, rendered outside header so it fills viewport */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'var(--bg-primary)' }}
        >
          {/* Spacer to push content below header bar */}
          <div className="h-16" />

          {/* Scrollable content area */}
          <div
            className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 flex flex-col"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            {/* Nav Links */}
            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-4 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-[var(--bg-tertiary)] active:scale-[0.98]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Subscribe CTA at bottom */}
            <div className="pt-6 pb-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Link
                href="/newsletter"
                onClick={() => setMobileOpen(false)}
                className="block w-full py-4 rounded-2xl text-base font-bold text-white gradient-bg text-center shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
