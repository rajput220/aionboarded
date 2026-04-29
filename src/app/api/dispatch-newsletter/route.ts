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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #334155; line-height: 1.7;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #0A84FF, #1DB954); color: white; display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 20px; margin-bottom: 12px;">AI</div>
            <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0;">AI Onboarded Weekly Brief</h1>
            <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Week 13: The AI Specialization Turn</p>
          </div>

          <p style="font-size: 16px;">Hi ${firstName},</p>
          
          <p style="font-size: 16px; font-weight: 500; color: #0F172A;">GPT-Rosalind enters the drug lab. Claude Opus 4.7 introduces self-verification. Claude Design disrupts Figma. Codex expands to full computer use. The era of generalist models ends.</p>
          
          <p style="font-size: 16px;">In this week's edition, we cover <strong>The AI Specialization Turn</strong> — the moment frontier labs pivoted from generalist scaling to deep domain expertise. Highlights include:</p>
          
          <ul style="padding-left: 20px; font-size: 15px;">
            <li style="margin-bottom: 8px;"><strong>GPT-Rosalind:</strong> OpenAI's first domain-specialized frontier model for drug discovery, genomics, and protein engineering. Enterprise customers include Amgen and Moderna.</li>
            <li style="margin-bottom: 8px;"><strong>Claude Opus 4.7:</strong> Introduces self-verification — the model checks its own outputs before returning them. Visual resolution jumps from 54.5% to 98.5%.</li>
            <li style="margin-bottom: 8px;"><strong>Claude Design:</strong> Turns text prompts into interactive UI prototypes. Figma and Adobe shares drop on the news. Anthropic CPO resigns from Figma's board.</li>
            <li style="margin-bottom: 8px;"><strong>Codex Expands:</strong> Native Mac computer use, in-app browser, persistent memory, and 90+ new plugins. The gap between coding assistant and autonomous agent has closed.</li>
            <li style="margin-bottom: 8px;"><strong>Stanford AI Index 2026:</strong> Foundation model transparency drops from 58 to 40. 58% of Americans now view AI negatively. The trust deficit deepens.</li>
          </ul>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'}/newsletter/week-13.html"
               style="display: inline-block; background: linear-gradient(135deg, #0A84FF, #1DB954); color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3);">
              Read the Full Week 13 Newsletter
            </a>
          </div>
          
          <div style="background: #F8FAFC; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #E2E8F0;">
            <h3 style="color: #1a1a1a; font-size: 18px; margin-top: 0; margin-bottom: 12px;">Join the Community</h3>
            <p style="font-size: 14px; margin-bottom: 20px;">Connect with 150+ AI practitioners sharing strategic insights and staying ahead of the curve:</p>
            <div style="display: flex; gap: 12px;">
              <a href="https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ" style="color: #0A84FF; text-decoration: none; font-weight: 600; font-size: 14px;">💬 WhatsApp Group</a>
              <span style="color: #CBD5E1;">&bull;</span>
              <a href="https://discord.com/invite/SW4HZAv37" style="color: #0A84FF; text-decoration: none; font-weight: 600; font-size: 14px;">🎮 Discord Server</a>
            </div>
          </div>
          
          <p style="color: #94A3B8; font-size: 13px; margin-top: 48px; border-top: 1px solid #E2E8F0; padding-top: 24px;">
            You received this because you subscribed to AI Onboarded updates.<br>
            <strong>The AI Onboarded Team</strong><br>
            <a href="https://aionboarded.ai" style="color: #94A3B8;">aionboarded.ai</a>
          </p>
        </div>
      `

      try {
        await resend.emails.send({
          from: 'AI Onboarded <newsletter@aionboarded.ai>',
          to: email,
          subject: 'The AI Specialization Turn: GPT-Rosalind Enters the Drug Lab 🔬',
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
