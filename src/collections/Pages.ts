import type { CollectionConfig } from 'payload'

const isAdminOrEditor = ({ req: { user } }: any) =>
    user?.role === 'admin' || user?.role === 'editor'

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
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
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'published',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
            ],
            admin: { position: 'sidebar' },
        },
        {
            name: 'seo',
            type: 'group',
            fields: [
                { name: 'metaTitle', type: 'text', maxLength: 70 },
                { name: 'metaDescription', type: 'textarea', maxLength: 160 },
            ],
        },
    ],
}
