import { generateSeo } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = generateSeo({
    title: 'Newsletter Archive',
    description: 'Browse all past editions of the AI Onboarded weekly newsletter — weekly AI intelligence briefings organized by week.',
})

// Static newsletter archive — new entries are added automatically by the pipeline
// Add new weeks at the TOP of this array (newest first)
const newsletters = [
    {
        week: 27,
        slug: 'week-27',
        title: 'Containment Fails, Markets Split',
        subtitle: 'Week 27 AI Intelligence Briefing',
        dateRange: 'July 26, 2026',
        theme: 'Containment Fails, Markets Split',
        highlights: [
            'OpenAI Agent Autonomously Hacked Hugging Face',
            '25-Firm Open-Weight Coalition Letter',
            'Google Releases Three New Gemini Models',
            'ChatGPT Launches Self-Serve Ads Platform',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-27.html',
    },
    {
        week: 26,
        slug: 'week-26',
        title: 'Competitors Become Infrastructure Partners',
        subtitle: 'Week 26 AI Intelligence Briefing',
        dateRange: 'July 19, 2026',
        theme: 'Competitors Become Infrastructure Partners',
        highlights: [
            'Meta-Anthropic $10B Compute Deal',
            'Kimi K3 Open-Weight Model',
            'Thinking Machines Launches Inkling',
            'Microsoft Turns on AI Partners',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-26.html',
    },
    {
        week: 25,
        slug: 'week-25',
        title: 'The Platform Wars Begin',
        subtitle: 'Week 25 AI Intelligence Briefing',
        dateRange: 'July 12, 2026',
        theme: 'The Platform Wars Begin',
        highlights: [
            'GPT-5.6 Goes Global',
            'Grok 4.5 Undercuts Everyone',
            'Microsoft Builds Its Own',
            'Illinois Sets the Standard',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-25.html',
    },
    {
        week: 24,
        slug: 'week-24',
        title: 'Access, Control, and the Last Mile',
        subtitle: 'Week 24 AI Intelligence Briefing',
        dateRange: 'July 5, 2026',
        theme: 'Access, Control, and the Last Mile',
        highlights: [
            'Claude Fable 5 Restored',
            'Claude Sonnet 5 Launches',
            'OpenAI Proposes 5% Government Stake',
            'Microsoft Launches $2.5B Frontier Co.',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-24.html',
    },
    {
        week: 23,
        slug: 'week-23',
        title: 'The Containment and Customization Era',
        subtitle: 'Week 23 AI Intelligence Briefing',
        dateRange: 'June 27, 2026',
        theme: 'The Containment and Customization Era',
        highlights: [
            'OpenAI Jalapeño Chip',
            'Claude Tag in Slack',
            'GPT-5.6 Staggered Release',
            'Gemini 3.5 Flash Computer Use',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-23.html',
    },
    {
        week: 22,
        slug: 'week-22',
        title: 'Borders, Blueprints, and Battles',
        subtitle: 'Week 22 AI Intelligence Briefing',
        dateRange: 'June 21, 2026',
        theme: 'Borders, Blueprints, and Battles',
        highlights: [
            'Noam Shazeer Joins OpenAI',
            'ARD Protocol Launches',
            'Fable 5 Returns With Restrictions',
            'GLM-5.2 Challenges US Pricing',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-22.html',
    },
    {
        week: 21,
        slug: 'week-21',
        title: 'Emergency Controls Meet Trillion-Dollar Ambitions',
        subtitle: 'Week 21 AI Intelligence Briefing',
        dateRange: 'June 14, 2026',
        theme: 'Emergency Controls Meet Trillion-Dollar Ambitions',
        highlights: [
            'Anthropic Claude Fable 5 & Mythos 5 Recalled',
            'OpenAI T+ IPO Amid Legal Storm',
            'Visa Enables AI Autonomous Payments',
            'Munich Court Rules Google Liable for AI Hallucinations',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-21.html',
    },
    {
        week: 20,
        slug: 'week-20',
        title: 'AI Valuation Wars and Labor Frontlines',
        subtitle: 'Week 20 AI Intelligence Briefing',
        dateRange: 'June 7, 2026',
        theme: 'AI Valuation Wars and Labor Frontlines',
        highlights: [
            'Anthropic Hits $965B Valuation',
            'Claude Opus 4.8 Launches',
            'GPT-4.5 Passes Turing Test',
            'Connecticut Signs AI Employment Law',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-20.html',
    },
    {
        week: 19,
        slug: 'week-19',
        title: 'AI Enters the Capital Markets Era',
        subtitle: 'Week 19 AI Intelligence Briefing',
        dateRange: 'May 31, 2026',
        theme: 'AI Enters the Capital Markets Era',
        highlights: [
            'OpenAI IPO Filing',
            'Anthropic First Profit',
            'Google I/O 2026',
            'Project Glasswing',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-19.html',
    },
    {
        week: 18,
        slug: 'week-18',
        title: 'AI Enters the Capital Markets Era',
        subtitle: 'Week 18 AI Intelligence Briefing',
        dateRange: 'May 24, 2026',
        theme: 'AI Enters the Capital Markets Era',
        highlights: [
            'OpenAI IPO Filing',
            'Anthropic\'s First Profit',
            'Google I/O 2026',
            '10,000+ Vulnerabilities',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-18.html',
    },
    {
        week: 17,
        slug: 'week-17',
        title: 'AI Moves from Advisor to Operator',
        subtitle: 'Week 17 AI Intelligence Briefing',
        dateRange: 'May 17, 2026',
        theme: 'AI Moves from Advisor to Operator',
        highlights: [
            'OpenAI Launches DeployCo',
            'Google Gemini Intelligence',
            'Claude Mythos Cracks Apple M5',
            'Microsoft MDASH',
            'US Ranks 21st in AI Adoption'
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-17.html',
    },


    {
        week: 16,
        slug: 'week-16',
        title: 'Infrastructure, Security, and Accountability Converge',
        subtitle: 'Week 16 AI Intelligence Briefing',
        dateRange: 'May 10, 2026',
        theme: 'Infrastructure, Security, and Accountability Converge',
        highlights: [
            'OpenAI GPT-5.5-Cyber Launch',
            'Critical Agent Framework Vulnerabilities',
            'U.S. House AI Governance Package',
            'DeepMind Staff Unionize',
        ],
        emoji: '📡',
        htmlFile: '/newsletter/week-16.html',
    },
    {
        week: 15,
        slug: 'week-15',
        title: 'Governance Stakes Get Real',
        subtitle: 'Pentagon Picks Sides, AI Capex Hits $725B',
        dateRange: 'April 27 – May 3, 2026',
        theme: 'The US defense establishment draws hard lines on AI alliances, Big Tech commits $725B in infrastructure, and EU governance reform stalls.',
        highlights: [
            'Pentagon excludes Anthropic from key AI contracts',
            'Big Tech commits $725B in AI capex for 2026',
            'EU AI Act reform talks collapse',
            'Microsoft-OpenAI partnership confirmed non-exclusive to 2032',
        ],
        emoji: '🔒',
        htmlFile: '/newsletter/week-15.html',
    },
    {
        week: 14,
        slug: 'week-14',
        title: "The Agentic Threshold",
        subtitle: "GPT-5.5 'Spud' Launches as AI Escapes the Sandbox",
        dateRange: 'April 20–26, 2026',
        theme: 'From GPT-5.5 reaching new agentic heights to the first public AI sandbox escape and a massive $100B Amazon-Anthropic alliance.',
        highlights: [
            "GPT-5.5 'Spud' omnimodal agentic model launches",
            "ChatGPT Images 2.0 learns to think before drawing",
            "Google's Agentic Data Cloud natively integrates Oracle",
            "Claude Mythos escapes sandbox in 'Sandwich Incident'",
        ],
        emoji: '🔓',
        htmlFile: '/newsletter/week-14.html',
    },
    {
        week: 13,
        slug: 'week-13',
        title: 'The AI Specialization Turn',
        subtitle: 'Platform Disruption and the Deepening Trust Deficit',
        dateRange: 'April 13–19, 2026',
        theme: 'Domain specialization replaces generalist models, AI swallows entire software categories, and the trust deficit deepens as capabilities surge.',
        highlights: [
            'GPT-Rosalind: AI enters the drug discovery lab',
            'Claude Opus 4.7 introduces self-verification',
            'Claude Design disrupts Figma & Adobe, stocks drop',
            'Codex expands to full computer use with 90+ plugins',
        ],
        emoji: '🔬',
        htmlFile: '/newsletter/week-13.html',
    },
    {
        week: 12,
        slug: 'week-12',
        title: 'The Sovereign Intelligence Threshold',
        subtitle: 'Claude Mythos is too capable to release. The SaaSpocalypse erases $2T. Meta reaches 3B users.',
        dateRange: 'April 6–12, 2026',
        theme: 'AI crosses from powerful tool to autonomous actor — Claude Mythos breaks containment, the $2T SaaSpocalypse accelerates, and a two-person startup hits $1.8B.',
        highlights: [
            'Claude Mythos Preview: Too capable to release, restricted to 40+ orgs',
            'SaaSpocalypse: $2T enterprise software wipeout from AI agents',
            'Meta Muse Spark reasoning model reaches 3 billion users',
            'Medvi: $1.8B company built by 2 people with AI tools',
        ],
        emoji: '🛡️',
        htmlFile: '/newsletter/week-12.html',
    },
    {
        week: 11,
        slug: 'week-10', // HTML file name (week-10.html maps to week 11 content)
        title: 'From Models to Ecosystems',
        subtitle: 'AI Swallows the Enterprise Stack',
        dateRange: 'March 30 – April 5, 2026',
        theme: 'Capital concentration at sovereign scale, cross-stack agentic automation, and AI accountability entering its legal phase.',
        highlights: [
            'OpenAI closes $122B raise at $852B valuation',
            'Google Gemma 4: open-weight frontier, Apache 2.0',
            'Anthropic Conway always-on agent + Claude on Windows',
            'Meta/Google product liability verdict bypasses Section 230',
        ],
        emoji: '🏗️',
        htmlFile: '/newsletter/week-10.html',
    },
    {
        week: 10,
        slug: 'week-9',
        title: 'The Agentic Inflection',
        subtitle: 'AI Becomes Your Digital Coworker',
        dateRange: 'March 23–29, 2026',
        theme: 'OS-level agents, vendor lock-in challenges, and federal AI governance shifts — the era of passive chatbots is over.',
        highlights: [
            'Anthropic launches Claude OS-level agents',
            'Apple stirs AI portability with MiM OS 5',
            'Federal AI governance shifts accelerate',
            'Strategic market shifts: from lock-in to portability',
        ],
        emoji: '🤖',
        htmlFile: '/newsletter/week-9.html',
    },
    {
        week: 9,
        slug: 'week-8',
        title: 'The Intelligence Layer',
        subtitle: "AI's Enterprise Acceleration",
        dateRange: 'March 16–22, 2026',
        theme: 'Enterprise AI tools go mainstream, research benchmarks advance, and major cloud providers double down on AI infrastructure.',
        highlights: [
            'Microsoft Copilot Critique + Council features launch',
            'Google Workspace AI expansion',
            'OpenAI API pricing restructured',
            'EU AI Act high-risk categories clarified',
        ],
        emoji: '⚡',
        htmlFile: '/newsletter/week-8.html',
    },
    {
        week: 8,
        slug: 'week-7',
        title: 'The Foundation Models Race',
        subtitle: 'Benchmark Season Arrives',
        dateRange: 'March 9–15, 2026',
        theme: 'A new wave of foundation model releases pushes capability benchmarks across reasoning, vision, and code generation.',
        highlights: [
            'GPT-5 preview benchmarks released',
            'Anthropic Claude 3.7 ships with extended thinking',
            'Google Gemini 2.0 multimodal improvements',
            'Open-source LLaMA 4 leaked benchmarks circulate',
        ],
        emoji: '🚀',
        htmlFile: '/newsletter/week-7.html',
    },
]

export default function NewsletterArchivePage() {
    return (
        <div className="pt-36 lg:pt-44 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                        📬 Newsletter Archive
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                        Weekly AI <span className="gradient-text">Intelligence Briefings</span>
                    </h1>
                    <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                        Every week, we distill the most important AI developments into a strategic briefing. Browse all past editions below.
                    </p>
                </div>

                {/* Latest Issue CTA */}
                <div className="relative mb-12 rounded-3xl overflow-hidden gradient-bg p-8 text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl" />
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="text-white/70 text-sm font-medium mb-1">Latest Edition — Week {newsletters[0].week}</div>
                            <h2 className="text-2xl font-black mb-1">{newsletters[0].title}</h2>
                            <p className="text-white/80 text-sm">{newsletters[0].dateRange} · {newsletters[0].subtitle}</p>
                        </div>
                        <a
                            href={newsletters[0].htmlFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-brand-600)] rounded-2xl font-bold text-sm hover:bg-white/90 transition-all duration-200 shadow-lg"
                        >
                            Read Now →
                        </a>
                    </div>
                </div>

                {/* Archive Grid */}
                <div className="grid gap-4">
                    {newsletters.map((nl, index) => (
                        <div
                            key={nl.week}
                            className="group rounded-2xl border p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start gap-5">

                                {/* Week badge */}
                                <div className="shrink-0 w-16 h-16 rounded-2xl gradient-bg flex flex-col items-center justify-center text-white shadow-md">
                                    <span className="text-lg font-black leading-none">W{nl.week}</span>
                                    <span className="text-xs opacity-80">2026</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    {nl.emoji} {nl.title}
                                                </span>
                                                {index === 0 && (
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        Latest
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                {nl.dateRange} · {nl.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                        {nl.theme}
                                    </p>

                                    {/* Highlights */}
                                    <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 mb-4">
                                        {nl.highlights.map((h) => (
                                            <li key={h} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                <span className="text-[var(--color-brand-500)] mt-0.5 shrink-0">→</span>
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <a
                                            href={nl.htmlFile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-sm"
                                        >
                                            📖 Read Full Issue
                                        </a>
                                        <Link
                                            href={`/news?week=${nl.week}`}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--bg-tertiary)]"
                                            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                                        >
                                            📰 News for this week
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subscribe CTA */}
                <div className="mt-12 p-8 rounded-3xl border text-center"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Don&apos;t miss next week&apos;s briefing
                    </h2>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                        Join 150+ AI practitioners getting the weekly strategic intelligence briefing every Sunday.
                    </p>
                    <Link
                        href="/#subscribe"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white gradient-bg hover:opacity-90 transition-opacity shadow-md"
                    >
                        Subscribe Free →
                    </Link>
                </div>

            </div>
        </div>
    )
}
