import Link from 'next/link'
import Image from 'next/image'
import { SubscribeForm } from '@/components/ui/SubscribeForm'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      className="border-t mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6 group">
              <div className="relative w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] group-hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="AI Onboarded Logo" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Creating awareness and sharing knowledge on AI tools and latest AI developments. Join
              100+ members in our growing community.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  label: 'Twitter',
                  href: '#',
                  icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  label: 'YouTube',
                  href: 'https://www.youtube.com/@aionboarded',
                  icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z',
                },
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/groups/16692012/',
                  icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Content
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'Podcast', href: '/podcast' },
                { label: 'Newsletter', href: '/newsletter' },
                { label: 'AI News', href: '/news' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--color-brand-500)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Community
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'RSS Feeds', href: '/rss/blog.xml' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--color-brand-500)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Stay Updated
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Get the latest AI insights delivered to your inbox weekly.
            </p>
            <SubscribeForm compact />
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            © {currentYear} AI Onboarded. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Made with ❤️ for the AI community
          </p>
        </div>
      </div>
    </footer>
  )
}
