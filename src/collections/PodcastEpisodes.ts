import type { CollectionConfig } from 'payload'

const isAdminOrEditor = ({ req: { user } }: any) =>
    user?.role === 'admin' || user?.role === 'editor'

export const PodcastEpisodes: CollectionConfig = {
    slug: 'podcast-episodes',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'episodeNumber', 'status', 'publishedAt'],
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
            name: 'episodeNumber',
            type: 'number',
            required: true,
            admin: { position: 'sidebar' },
        },
        {
            name: 'seasonNumber',
            type: 'number',
            defaultValue: 1,
            admin: { position: 'sidebar' },
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'showNotes',
            type: 'richText',
        },
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Audio Sources',
                    fields: [
                        {
                            name: 'audioFile',
                            type: 'upload',
                            relationTo: 'media',
                            admin: { description: 'Upload self-hosted audio (MP3)' },
                        },
                        {
                            name: 'spotifyUrl',
                            type: 'text',
                            admin: { description: 'Spotify episode URL' },
                        },
                        {
                            name: 'applePodcastUrl',
                            type: 'text',
                            admin: { description: 'Apple Podcasts episode URL' },
                        },
                        {
                            name: 'youtubeUrl',
                            type: 'text',
                            admin: { description: 'YouTube video URL' },
                        },
                    ],
                },
                {
                    label: 'Transcript',
                    fields: [
                        {
                            name: 'transcript',
                            type: 'richText',
                        },
                    ],
                },
            ],
        },
        {
            name: 'duration',
            type: 'number',
            admin: {
                position: 'sidebar',
                description: 'Duration in minutes',
            },
        },
        {
            name: 'hosts',
            type: 'relationship',
            relationTo: 'users',
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
    ],
}
