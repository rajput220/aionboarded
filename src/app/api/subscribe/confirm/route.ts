import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get('token')
        if (!token) {
            return NextResponse.redirect(new URL('/newsletter?error=invalid-token', req.url))
        }

        const payload = await getPayloadClient()
        const result = await payload.find({
            collection: 'subscribers',
            where: { confirmToken: { equals: token } },
            limit: 1,
        })

        if (result.docs.length === 0) {
            return NextResponse.redirect(new URL('/newsletter?error=invalid-token', req.url))
        }

        const subscriber = result.docs[0]
        await payload.update({
            collection: 'subscribers',
            id: subscriber.id,
            data: { confirmed: true, confirmToken: '' },
        })

        return NextResponse.redirect(new URL('/newsletter?confirmed=true', req.url))
    } catch (error) {
        console.error('Confirm error:', error)
        return NextResponse.redirect(new URL('/newsletter?error=server-error', req.url))
    }
}
