import { getPayload } from 'payload'
import config from '../src/payload.config'
import { fileURLToPath } from 'url'

async function seed() {
    console.log('🌱 Seeding database...')

    const payload = await getPayload({ config })

    // --- Create admin user ---
    let admin
    try {
        admin = await payload.create({
            collection: 'users',
            data: {
                email: 'admin@aionboarded.ai',
                password: 'admin123!',
                name: 'Admin',
                role: 'admin',
            },
        })
        console.log('✅ Admin user created')
    } catch {
        const existing = await payload.find({ collection: 'users', where: { email: { equals: 'admin@aionboarded.ai' } }, limit: 1 })
        admin = existing.docs[0]
        console.log('ℹ️  Admin user already exists')
    }

    // --- Tags ---
    const tagNames = ['AI', 'Machine Learning', 'LLMs', 'ChatGPT', 'Open Source', 'Computer Vision', 'NLP', 'Robotics', 'Ethics', 'Productivity']
    const tags: any[] = []
    for (const name of tagNames) {
        try {
            const tag = await payload.create({
                collection: 'tags',
                data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
            })
            tags.push(tag)
        } catch {
            const existing = await payload.find({ collection: 'tags', where: { name: { equals: name } }, limit: 1 })
            tags.push(existing.docs[0])
        }
    }
    console.log(`✅ ${tags.length} tags created`)

    // --- Categories ---
    const categoryData = [
        { name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides on AI tools' },
        { name: 'Analysis', slug: 'analysis', description: 'Deep dives into AI trends and technologies' },
        { name: 'Tools', slug: 'tools', description: 'Reviews and comparisons of AI tools' },
        { name: 'Industry', slug: 'industry', description: 'AI industry news and analysis' },
    ]
    const categories: any[] = []
    for (const cat of categoryData) {
        try {
            const c = await payload.create({ collection: 'categories', data: cat })
            categories.push(c)
        } catch {
            const existing = await payload.find({ collection: 'categories', where: { name: { equals: cat.name } }, limit: 1 })
            categories.push(existing.docs[0])
        }
    }
    console.log(`✅ ${categories.length} categories created`)

    // --- Blog Posts ---
    const blogPosts = [
        {
            title: '10 AI Tools Every Developer Should Know in 2025',
            slug: '10-ai-tools-developers-2025',
            excerpt: 'A curated list of the most impactful AI tools that are transforming software development workflows, from code generation to testing.',
            status: 'published',
            publishedAt: '2025-02-15T10:00:00Z',
            readingTime: 8,
            author: admin?.id,
            categories: [categories[2]?.id],
            tags: [tags[0]?.id, tags[9]?.id],
            content: {
                root: {
                    type: 'root',
                    children: [
                        { type: 'paragraph', children: [{ type: 'text', text: 'The AI landscape is evolving rapidly, and developers have more powerful tools at their disposal than ever before. Here are the top 10 AI tools that every developer should be familiar with in 2025.', format: 0, mode: 'normal' }] },
                        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: '1. GitHub Copilot', format: 0, mode: 'normal' }] },
                        { type: 'paragraph', children: [{ type: 'text', text: 'GitHub Copilot continues to be the gold standard for AI-powered code completion. With its latest multi-model support, it now offers suggestions from multiple AI providers, giving developers more choice and better results.', format: 0, mode: 'normal' }] },
                        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: '2. Cursor', format: 0, mode: 'normal' }] },
                        { type: 'paragraph', children: [{ type: 'text', text: 'Cursor has emerged as a powerful AI-first code editor that integrates AI deeply into the development workflow. Its ability to understand entire codebases and make contextual suggestions sets it apart.', format: 0, mode: 'normal' }] },
                        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: '3. Claude (Anthropic)', format: 0, mode: 'normal' }] },
                        { type: 'paragraph', children: [{ type: 'text', text: 'Claude has become the go-to AI assistant for many developers thanks to its large context window, nuanced understanding of code, and ability to handle complex multi-step tasks.', format: 0, mode: 'normal' }] },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                },
            },
        },
        {
            title: 'Understanding RAG: A Practical Guide to Retrieval-Augmented Generation',
            slug: 'understanding-rag-practical-guide',
            excerpt: 'Learn how Retrieval-Augmented Generation works, when to use it, and how to implement it effectively in your AI applications.',
            status: 'published',
            publishedAt: '2025-02-10T10:00:00Z',
            readingTime: 12,
            author: admin?.id,
            categories: [categories[0]?.id, categories[1]?.id],
            tags: [tags[0]?.id, tags[1]?.id, tags[2]?.id],
            content: {
                root: {
                    type: 'root',
                    children: [
                        { type: 'paragraph', children: [{ type: 'text', text: 'Retrieval-Augmented Generation (RAG) has become one of the most important patterns in AI application development. It allows you to ground LLM responses in your own data, reducing hallucinations and providing more accurate answers.', format: 0, mode: 'normal' }] },
                        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'What is RAG?', format: 0, mode: 'normal' }] },
                        { type: 'paragraph', children: [{ type: 'text', text: 'RAG combines the power of large language models with a retrieval system that can search through your documents, databases, or knowledge bases. When a user asks a question, the system first retrieves relevant context, then uses that context to generate a more accurate response.', format: 0, mode: 'normal' }] },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                },
            },
        },
        {
            title: 'The State of Open Source AI Models in 2025',
            slug: 'state-of-open-source-ai-2025',
            excerpt: 'From Llama to Mistral to DeepSeek, open source AI models are challenging proprietary alternatives. Here\'s the current landscape.',
            status: 'published',
            publishedAt: '2025-02-05T10:00:00Z',
            readingTime: 10,
            author: admin?.id,
            categories: [categories[1]?.id, categories[3]?.id],
            tags: [tags[0]?.id, tags[4]?.id, tags[2]?.id],
            content: {
                root: {
                    type: 'root',
                    children: [
                        { type: 'paragraph', children: [{ type: 'text', text: 'The open source AI movement has gained incredible momentum. Models like Llama 3, Mistral, and DeepSeek are now competitive with proprietary alternatives for many use cases. Let\'s explore what this means for developers and organizations.', format: 0, mode: 'normal' }] },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                },
            },
        },
    ]

    for (const post of blogPosts) {
        try {
            await payload.create({ collection: 'blog-posts', data: post as any })
        } catch (e: any) {
            console.log(`  ⚠ Blog post "${post.title}" - ${e.message?.slice(0, 50)}`)
        }
    }
    console.log('✅ Blog posts created')

    // --- Podcast Episodes ---
    const episodes = [
        {
            title: 'The Future of AI Agents',
            slug: 'future-of-ai-agents',
            episodeNumber: 5,
            seasonNumber: 1,
            description: 'We explore the rapidly evolving world of AI agents — autonomous systems that can plan, reason, and take action. What does this mean for the future of work?',
            duration: 45,
            status: 'published',
            publishedAt: '2025-02-20T10:00:00Z',
            hosts: [admin?.id],
            tags: [tags[0]?.id, tags[2]?.id],
            spotifyUrl: 'https://open.spotify.com/episode/example',
            showNotes: {
                root: {
                    type: 'root',
                    children: [
                        { type: 'paragraph', children: [{ type: 'text', text: 'In this episode, we dive deep into AI agents and their potential to transform how we work and interact with technology.', format: 0, mode: 'normal' }] },
                        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Topics Covered', format: 0, mode: 'normal' }] },
                        {
                            type: 'list', listType: 'bullet', children: [
                                { type: 'listitem', children: [{ type: 'text', text: 'What are AI agents and how do they differ from chatbots?', format: 0, mode: 'normal' }] },
                                { type: 'listitem', children: [{ type: 'text', text: 'Current state of agent frameworks (LangGraph, CrewAI, AutoGen)', format: 0, mode: 'normal' }] },
                                { type: 'listitem', children: [{ type: 'text', text: 'Real-world use cases in production', format: 0, mode: 'normal' }] },
                            ]
                        },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                },
            },
        },
        {
            title: 'Building with Local LLMs',
            slug: 'building-with-local-llms',
            episodeNumber: 4,
            seasonNumber: 1,
            description: 'Running AI models locally is becoming more accessible. We discuss Ollama, llama.cpp, and the growing ecosystem of tools for local AI.',
            duration: 38,
            status: 'published',
            publishedAt: '2025-02-13T10:00:00Z',
            hosts: [admin?.id],
            tags: [tags[0]?.id, tags[4]?.id],
        },
        {
            title: 'AI Ethics: Building Responsibly',
            slug: 'ai-ethics-building-responsibly',
            episodeNumber: 3,
            seasonNumber: 1,
            description: 'A thoughtful conversation about the ethical considerations every AI practitioner should keep in mind. Bias, safety, and responsible deployment.',
            duration: 52,
            status: 'published',
            publishedAt: '2025-02-06T10:00:00Z',
            hosts: [admin?.id],
            tags: [tags[0]?.id, tags[8]?.id],
        },
    ]

    for (const ep of episodes) {
        try {
            await payload.create({ collection: 'podcast-episodes', data: ep as any })
        } catch (e: any) {
            console.log(`  ⚠ Episode "${ep.title}" - ${e.message?.slice(0, 50)}`)
        }
    }
    console.log('✅ Podcast episodes created')

    // --- Newsletter Issues ---
    const newsletters = [
        {
            title: 'AI Agents Are Having Their Moment',
            slug: 'ai-agents-having-their-moment',
            issueNumber: 12,
            excerpt: 'This week: AI agents go mainstream, OpenAI launches operator, Google unveils Gemini 2.0 agent capabilities, and the best open-source agent frameworks.',
            status: 'published',
            publishedAt: '2025-02-21T10:00:00Z',
            author: admin?.id,
            tags: [tags[0]?.id, tags[2]?.id],
            content: {
                root: {
                    type: 'root',
                    children: [
                        { type: 'paragraph', children: [{ type: 'text', text: 'Welcome to Issue #12 of the AI Onboarded newsletter! This week has been massive for AI agents.', format: 0, mode: 'normal' }] },
                        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: '🔥 Top Story: AI Agents Go Mainstream', format: 0, mode: 'normal' }] },
                        { type: 'paragraph', children: [{ type: 'text', text: 'The era of AI agents is officially here. Multiple major companies have launched agent platforms this week, signaling a fundamental shift in how we interact with AI systems.', format: 0, mode: 'normal' }] },
                        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: '🛠️ Tool of the Week: CrewAI', format: 0, mode: 'normal' }] },
                        { type: 'paragraph', children: [{ type: 'text', text: 'CrewAI makes it easy to build multi-agent systems where different AI agents collaborate to accomplish complex tasks. Think of it as building a team of AI specialists.', format: 0, mode: 'normal' }] },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                },
            },
        },
        {
            title: 'The Rise of Multimodal AI',
            slug: 'rise-of-multimodal-ai',
            issueNumber: 11,
            excerpt: 'Exploring how AI models that understand text, images, audio, and video are changing the game. Plus: 5 tools to try this week.',
            status: 'published',
            publishedAt: '2025-02-14T10:00:00Z',
            author: admin?.id,
            tags: [tags[0]?.id, tags[5]?.id],
            content: {
                root: {
                    type: 'root',
                    children: [
                        { type: 'paragraph', children: [{ type: 'text', text: 'Welcome to Issue #11! This week we\'re exploring the fascinating world of multimodal AI.', format: 0, mode: 'normal' }] },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                },
            },
        },
    ]

    for (const nl of newsletters) {
        try {
            await payload.create({ collection: 'newsletter-issues', data: nl as any })
        } catch (e: any) {
            console.log(`  ⚠ Newsletter "${nl.title}" - ${e.message?.slice(0, 50)}`)
        }
    }
    console.log('✅ Newsletter issues created')

    // --- News Items ---
    const newsItems = [
        {
            title: 'OpenAI Announces GPT-5 with Reasoning Capabilities',
            slug: 'openai-announces-gpt5',
            excerpt: 'OpenAI has unveiled GPT-5, featuring advanced reasoning, improved multimodal understanding, and lower latency across all use cases.',
            sourceUrl: 'https://openai.com',
            sourceName: 'OpenAI',
            featured: true,
            status: 'published',
            publishedAt: '2025-02-22T10:00:00Z',
            author: admin?.id,
            tags: [tags[0]?.id, tags[2]?.id],
            content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'OpenAI has officially launched GPT-5, marking a significant leap in AI capabilities. The new model features built-in reasoning abilities similar to the o1 series but with much lower latency.', format: 0, mode: 'normal' }] }], direction: 'ltr', format: '', indent: 0, version: 1 } },
        },
        {
            title: 'Google DeepMind Achieves Breakthrough in Protein Design',
            slug: 'deepmind-protein-design-breakthrough',
            excerpt: 'AlphaFold 3 can now design novel proteins from scratch, opening new doors for drug discovery and materials science.',
            sourceUrl: 'https://deepmind.google',
            sourceName: 'Google DeepMind',
            featured: true,
            status: 'published',
            publishedAt: '2025-02-21T10:00:00Z',
            author: admin?.id,
            tags: [tags[0]?.id, tags[1]?.id],
            content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Google DeepMind has announced a major breakthrough with AlphaFold 3, which can now design entirely new proteins from scratch. This advancement has massive implications for drug discovery.', format: 0, mode: 'normal' }] }], direction: 'ltr', format: '', indent: 0, version: 1 } },
        },
        {
            title: 'Meta Releases Llama 4 as Open Source',
            slug: 'meta-releases-llama-4-open-source',
            excerpt: 'Meta has released Llama 4 under an open license, featuring 400B parameters and competitive performance with GPT-4.',
            sourceUrl: 'https://ai.meta.com',
            sourceName: 'Meta AI',
            featured: true,
            status: 'published',
            publishedAt: '2025-02-20T10:00:00Z',
            author: admin?.id,
            tags: [tags[0]?.id, tags[4]?.id, tags[2]?.id],
            content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Meta continues to champion open source AI with the release of Llama 4. The 400B parameter model matches or exceeds GPT-4 on most benchmarks.', format: 0, mode: 'normal' }] }], direction: 'ltr', format: '', indent: 0, version: 1 } },
        },
        {
            title: 'EU AI Act Enforcement Begins',
            slug: 'eu-ai-act-enforcement-begins',
            excerpt: 'The European Union has begun enforcing the AI Act, with new requirements for high-risk AI systems and transparency obligations.',
            sourceName: 'Reuters',
            featured: false,
            status: 'published',
            publishedAt: '2025-02-19T10:00:00Z',
            author: admin?.id,
            tags: [tags[0]?.id, tags[8]?.id],
            content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'The EU AI Act enforcement has officially begun, requiring companies to comply with new regulations around high-risk AI systems.', format: 0, mode: 'normal' }] }], direction: 'ltr', format: '', indent: 0, version: 1 } },
        },
        {
            title: 'Anthropic Launches Claude for Enterprise Teams',
            slug: 'anthropic-claude-enterprise',
            excerpt: 'Anthropic introduces new enterprise features for Claude, including custom fine-tuning, advanced security controls, and team collaboration.',
            sourceName: 'Anthropic',
            featured: true,
            status: 'published',
            publishedAt: '2025-02-18T10:00:00Z',
            author: admin?.id,
            tags: [tags[0]?.id, tags[2]?.id],
            content: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Anthropic has launched Claude for Enterprise, bringing advanced security controls, custom fine-tuning capabilities, and team collaboration features to business users.', format: 0, mode: 'normal' }] }], direction: 'ltr', format: '', indent: 0, version: 1 } },
        },
    ]

    for (const item of newsItems) {
        try {
            await payload.create({ collection: 'news-items', data: item as any })
        } catch (e: any) {
            console.log(`  ⚠ News "${item.title}" - ${e.message?.slice(0, 50)}`)
        }
    }
    console.log('✅ News items created')

    console.log('\n🎉 Seeding complete!')
    console.log('📧 Admin login: admin@aionboarded.ai / admin123!')

    process.exit(0)
}

seed().catch((err) => {
    console.error('❌ Seed error:', err)
    process.exit(1)
})
