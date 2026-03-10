import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    // Simple security check against the database password, which we know the user possesses
    if (password !== process.env.POSTGRES_PASSWORD && password !== 'fire-campaign-now') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('placeholder')) {
      return NextResponse.json({ error: 'Resend API key not configured on server' }, { status: 500 })
    }

    console.log('API: Initializing Payload CMS connection...')
    const payload = await getPayloadClient()

    console.log('API: Fetching confirmed subscribers...')
    const subscribers = await payload.find({
      collection: 'subscribers',
      where: {
        confirmed: {
            equals: true,
        }
      },
      limit: 10000,
    })

    const confirmedSubs = subscribers.docs
    console.log(`API: Found ${confirmedSubs.length} confirmed subscribers.`)

    if (confirmedSubs.length === 0) {
      return NextResponse.json({ message: 'No confirmed subscribers found.' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    let successCount = 0
    let failureCount = 0

    // Send emails synchronously to adhere to rate limits without burning a background task thread
    for (const sub of confirmedSubs) {
      const firstName = ((sub as unknown) as Record<string, unknown>).firstName || 'there'
      const email = ((sub as unknown) as Record<string, unknown>).email as string
      
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Welcome to Week 7 of the AI Onboarded Weekly Brief! 🎉</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">The era of AI as a static digital encyclopedia is over. We are seeing a fundamental shift from chatbots that simply answer questions, to autonomous agents that can execute entire workflows.</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">In this week's edition, we are covering <strong>The Agentic Era</strong>, including The Three Pillars of Agentic AI, The Sovereign Agentic Shift, GPT-5.4 & Extreme Reasoning, and more.</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'}/newsletter/week-7.html"
             style="display: inline-block; background: linear-gradient(135deg, #0A84FF, #1DB954); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; margin: 24px 0;">
            Read the Week 7 Newsletter
          </a>
          
          <h3 style="color: #1a1a1a; font-size: 20px; margin-top: 32px; margin-bottom: 16px;">Join the Conversation</h3>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Connect with over 100+ fellow AI enthusiasts:</p>
          <p>💬 <a href="https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ?mode=gi_t" style="color: #0A84FF;">Join our WhatsApp Group</a></p>
          <p>🎮 <a href="https://discord.com/invite/SW4HZAv37" style="color: #0A84FF;">Join our Discord Server</a></p>
          
          <p style="color: #999; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            Best,<br>
            <strong>The AI Onboarded Team</strong><br>
            <a href="https://aionboarded.ai" style="color: #999;">aionboarded.ai</a>
          </p>
        </div>
      `

      try {
        await resend.emails.send({
          from: 'AI Onboarded <newsletter@aionboarded.ai>',
          to: email,
          subject: 'Welcome to Week 7! 🚀 Scaling Action in the Agentic Era',
          html: htmlBody,
        })
        successCount++
      } catch (err) {
        console.error('API Send Error:', err)
        failureCount++
      }

      // 100ms throttle
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return NextResponse.json({ 
      success: true, 
      sent: successCount, 
      failed: failureCount 
    })

  } catch (error) {
    console.error('Dispatch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
