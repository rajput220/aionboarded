import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// Simple rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 }) // 1 minute window
    return true
  }
  if (entry.count >= 5) return false // 5 requests per minute
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const { email, firstName, lastName } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email.toLowerCase() } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0] as any
      if (subscriber.confirmed) {
        return NextResponse.json({ message: 'You are already subscribed!' })
      }
      // Update name fields if provided on re-submission
      if (firstName || lastName) {
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
          },
        })
      }
      return NextResponse.json({ message: 'Check your email to confirm your subscription!' })
    }

    // Create subscriber
    const subscriber = await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase(),
        confirmed: false,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
    })

    // Send confirmation email via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        await resend.emails.send({
          from: 'AI Onboarded <newsletter@aionboarded.ai>',
          to: email,
          subject: 'Confirm your subscription to AI Onboarded',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Welcome${firstName ? `, ${firstName}` : ''} to AI Onboarded! 🎉</h1>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for subscribing to our newsletter. Please confirm your email address by clicking the button below.
              </p>
              <a href="${siteUrl}/api/subscribe/confirm?token=${(subscriber as any).confirmToken}"
                 style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #3730a3); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; margin: 24px 0;">
                Confirm Subscription
              </a>
              <p style="color: #999; font-size: 14px; margin-top: 24px;">
                If you didn't subscribe, you can ignore this email.
              </p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr)
      }
    } else {
      // Auto-confirm if no email service configured (dev mode)
      await payload.update({
        collection: 'subscribers',
        id: subscriber.id,
        data: { confirmed: true },
      })
    }

    return NextResponse.json({
      message: process.env.RESEND_API_KEY
        ? 'Check your email to confirm your subscription!'
        : 'Successfully subscribed!',
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
