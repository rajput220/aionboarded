import { generateSeo } from '@/lib/seo'
import { SubscribeForm } from '@/components/ui/SubscribeForm'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSeo({
    title: 'About',
    description: 'Learn about AI Onboarded — a 100+ member community creating awareness and sharing knowledge on AI tools and developments.',
})

export default function AboutPage() {
    return (
        <div className="pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>
                    About <span className="gradient-text">AI Onboarded</span>
                </h1>

                <div className="prose max-w-none" style={{ color: 'var(--text-secondary)' }}>
                    <p className="text-lg leading-relaxed mb-6">
                        <strong style={{ color: 'var(--text-primary)' }}>AI Onboarded</strong> is a public community of 100+ members dedicated to creating awareness
                        and sharing knowledge about AI tools and the latest developments in artificial intelligence.
                    </p>

                    <div className="card p-8 my-8">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
                        <p className="text-lg">
                            To democratize AI knowledge by making cutting-edge AI developments, tools, and insights
                            accessible to everyone — from curious beginners to experienced practitioners.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mt-12 mb-6" style={{ color: 'var(--text-primary)' }}>What We Do</h2>

                    <div className="grid sm:grid-cols-2 gap-6 my-8">
                        {[
                            {
                                icon: '📰',
                                title: 'Weekly Newsletter',
                                desc: 'Curated AI insights, tool reviews, and news delivered to your inbox every week.',
                            },
                            {
                                icon: '🎙️',
                                title: 'Podcast',
                                desc: 'In-depth conversations with AI practitioners, researchers, and builders.',
                            },
                            {
                                icon: '📝',
                                title: 'Blog',
                                desc: 'Deep dives, tutorials, and thought pieces on AI tools and trends.',
                            },
                            {
                                icon: '🗞️',
                                title: 'AI News',
                                desc: 'Curated coverage of the latest AI developments and breakthroughs.',
                            },
                        ].map((item) => (
                            <div key={item.title} className="card p-6">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                                <p className="text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mt-12 mb-4" style={{ color: 'var(--text-primary)' }}>Join Our Community</h2>
                    <p className="mb-6">
                        Whether you&apos;re an AI enthusiast, developer, researcher, or just curious about the future of
                        artificial intelligence, there&apos;s a place for you in our community.
                    </p>
                </div>

                <div className="max-w-md mt-8">
                    <SubscribeForm />
                </div>
            </div>
        </div>
    )
}
