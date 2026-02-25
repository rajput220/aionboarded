import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const Subscribers: CollectionConfig = {
    slug: 'subscribers',
    admin: {
        useAsTitle: 'email',
        defaultColumns: ['email', 'confirmed', 'subscribedAt'],
        group: 'Newsletter',
    },
    access: {
        read: ({ req: { user } }) => user?.role === 'admin',
        create: () => true, // Public can subscribe
        update: ({ req: { user } }) => user?.role === 'admin',
        delete: ({ req: { user } }) => user?.role === 'admin',
    },
    hooks: {
        beforeChange: [
            ({ data, operation }) => {
                if (operation === 'create') {
                    data.confirmToken = crypto.randomBytes(32).toString('hex')
                    data.subscribedAt = new Date().toISOString()
                }
                return data
            },
        ],
    },
    fields: [
        {
            name: 'email',
            type: 'email',
            required: true,
            unique: true,
        },
        {
            name: 'confirmed',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Email confirmed via double opt-in',
            },
        },
        {
            name: 'confirmToken',
            type: 'text',
            admin: {
                readOnly: true,
                hidden: true,
            },
        },
        {
            name: 'subscribedAt',
            type: 'date',
            admin: {
                readOnly: true,
                position: 'sidebar',
            },
        },
    ],
}
