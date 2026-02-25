import type { CollectionConfig } from 'payload'

const isAdminOrEditor = ({ req: { user } }: any) =>
    user?.role === 'admin' || user?.role === 'editor'

export const BlogPosts: CollectionConfig = {
    slug: 'blog-posts',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'author', 'publishedAt'],
        group: 'Content',
    },
    access: {
        read: ({ req: { user } }) => {
            if (user) return true
            return { status: { equals: 'published' } }
        },
        create: isAdminOrEditor,
        update: isAdminOrEditor,
        delete: ({ req: { user } }) => user?.role === 'admin',
    },
    hooks: {
        beforeChange: [
            ({ data }) => {
                if (data?.content) {
                    const text = typeof data.content === 'string' ? data.content : JSON.stringify(data.content)
                    const wordCount = text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
                    data.readingTime = Math.max(1, Math.ceil(wordCount / 200))
                }
                return data
            },
        ],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: { position: 'sidebar' },
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
                        if (!value && data?.title) {
                            return data.title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '')
                        }
                        return value
                    },
                ],
            },
        },
        {
            name: 'excerpt',
            type: 'textarea',
            required: true,
            maxLength: 300,
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            admin: { position: 'sidebar' },
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            admin: { position: 'sidebar' },
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: { position: 'sidebar' },
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'draft',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
            ],
            admin: { position: 'sidebar' },
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: { pickerAppearance: 'dayAndTime' },
            },
        },
        {
            name: 'readingTime',
            type: 'number',
            admin: {
                position: 'sidebar',
                readOnly: true,
                description: 'Auto-calculated from content',
            },
        },
        {
            name: 'seo',
            type: 'group',
            fields: [
                { name: 'metaTitle', type: 'text', maxLength: 70 },
                { name: 'metaDescription', type: 'textarea', maxLength: 160 },
                { name: 'ogImage', type: 'upload', relationTo: 'media' },
            ],
        },
    ],
}
