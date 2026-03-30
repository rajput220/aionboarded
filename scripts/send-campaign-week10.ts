/**
 * AIOnboarded - Newsletter Campaign Sender (Week 10)
 * 
 * Theme: The Agentic Inflection: AI Becomes Your Digital Coworker
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from './../src/payload.config'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendCampaign() {
  try {
    console.log('Initializing Payload CMS connection...')
    const payload = await getPayload({ config })

    console.log('Fetching confirmed subscribers...')
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
    console.log(`Found ${confirmedSubs.length} confirmed subscribers.`)

    if (confirmedSubs.length === 0) {
      console.log('No confirmed subscribers found. Exiting.')
      process.exit(0)
    }

    console.log('Preparing to send Week 10 Campaign...')
    
    let successCount = 0
    let failureCount = 0

    for (const sub of confirmedSubs) {
      const firstName = ((sub as unknown) as Record<string, unknown>).firstName || 'there'
      const email = ((sub as unknown) as Record<string, unknown>).email as string
      
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #334155; line-height: 1.7;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #FF9500, #FF3B30); color: white; display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 20px; margin-bottom: 12px;">AI</div>
            <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0;">AI Onboarded Weekly Brief</h1>
            <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Week 10: The Agentic Inflection</p>
          </div>

          <p style="font-size: 16px;">Hi ${firstName},</p>
          
          <p style="font-size: 16px; font-weight: 500; color: #0F172A;">From OpenAI's agentic commerce protocol to Anthropic's 'Computer Use' for Mac and the White House's new regulatory framework — the agentic era has officially arrived.</p>
          
          <p style="font-size: 16px;">In this week's edition, we cover <strong>The Agentic Inflection</strong>. Highlights include:</p>
          
          <ul style="padding-left: 20px; font-size: 15px;">
            <li style="margin-bottom: 8px;"><strong>OpenAI Agentic Commerce:</strong> ChatGPT transforms into a shopping agent, enabling real-time product discovery and procurement.</li>
            <li style="margin-bottom: 8px;"><strong>Claude Mythos / Capybara:</strong> A configuration leak revealed a new capability tier from Anthropic that steps beyond current frontier models.</li>
            <li style="margin-bottom: 12px;"><strong>Anthropic Computer Use for Mac:</strong> A research preview allowing Claude to view screens, click, and type across any software.</li>
            <li style="margin-bottom: 8px;"><strong>White House AI Framework:</strong> A new federal standard that preempts state regulations to accelerate American AI dominance.</li>
            <li style="margin-bottom: 8px;"><strong>Google Memory Migration:</strong> The switcher war begins as Google allows users to import personalized history from competing models.</li>
          </ul>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'}/newsletter/week-10.html"
               style="display: inline-block; background: #FF9500; color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);">
              Read the Full Week 10 Newsletter
            </a>
          </div>
          
          <div style="background: #F8FAFC; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #E2E8F0;">
            <h3 style="color: #1a1a1a; font-size: 18px; margin-top: 0; margin-bottom: 12px;">Join the Community</h3>
            <p style="font-size: 14px; margin-bottom: 20px;">Connect with 150+ fellow AI enthusiasts and get early access to agent demos:</p>
            <div style="display: flex; gap: 12px;">
              <a href="https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ" style="color: #FF9500; text-decoration: none; font-weight: 600; font-size: 14px;">💬 WhatsApp Group</a>
              <span style="color: #CBD5E1;">&bull;</span>
              <a href="https://discord.com/invite/SW4HZAv37" style="color: #FF9500; text-decoration: none; font-weight: 600; font-size: 14px;">🎮 Discord Server</a>
            </div>
          </div>
          
          <p style="color: #94A3B8; font-size: 13px; margin-top: 48px; border-top: 1px solid #E2E8F0; padding-top: 24px;">
            You received this because you subscribed to AI Onboarded updates. <br>
            <strong>The AI Onboarded Team</strong><br>
            <a href="https://aionboarded.ai" style="color: #94A3B8;">aionboarded.ai</a>
          </p>
        </div>
      `

      try {
        await resend.emails.send({
          from: 'AI Onboarded <newsletter@aionboarded.ai>',
          to: email,
          subject: 'The Agentic Inflection: AI Becomes Your Digital Coworker 🤖',
          html: htmlBody,
        })
        successCount++
        console.log(`✅ Sent to ${email}`)
      } catch (err) {
        failureCount++
        console.error(`❌ Failed to send to ${email}:`, err)
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`\nWeek 10 Campaign Complete.`)
    console.log(`Successfully sent: ${successCount}`)
    console.log(`Failed: ${failureCount}`)
    
    process.exit(0)
  } catch (error) {
    console.error('Fatal Error executing campaign:', error)
    process.exit(1)
  }
}

sendCampaign()
