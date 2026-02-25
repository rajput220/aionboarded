import type { CollectionConfig } from 'payload'

const isAdminOrEditor = ({ req: { user } }: any) =>
    user?.role === 'admin' || user?.role === 'editor'

export const NewsletterIssues: CollectionConfig = {
    slug: 'newsletter-issues',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'issueNumber', 'status', 'publishedAt'],
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
            name: 'issueNumber',
            type: 'number',
            required: true,
            unique: true,
            admin: { position: 'sidebar' },
        },
        {
            name: 'excerpt',
            type: 'textarea',
            required: true,
            maxLength: 300,
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
    ],
}
