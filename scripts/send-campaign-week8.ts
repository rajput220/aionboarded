/**
 * AIOnboarded - Newsletter Campaign Sender (Week 8)
 * 
 * Theme: The Agentic Pivot: From AI as Software to AI as Colleagues
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

    console.log('Preparing to send Week 8 Campaign...')
    
    let successCount = 0
    let failureCount = 0

    for (const sub of confirmedSubs) {
      const firstName = ((sub as unknown) as Record<string, unknown>).firstName || 'there'
      const email = ((sub as unknown) as Record<string, unknown>).email as string
      
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #334155; line-height: 1.7;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #0A84FF, #1DB954); color: white; display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 20px; margin-bottom: 12px;">AI</div>
            <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0;">AI Onboarded Weekly Brief</h1>
            <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Week 8: The Agentic Pivot</p>
          </div>

          <p style="font-size: 16px;">Hi ${firstName},</p>
          
          <p style="font-size: 16px; font-weight: 500; color: #0F172A;">The AI industry is undergoing a fundamental shift: we are moving from prompting passive software to delegating to active digital colleagues.</p>
          
          <p style="font-size: 16px;">In this week's edition, we explore <strong>The Agentic Pivot</strong> and what it means for the future of work. Highlights include:</p>
          
          <ul style="padding-left: 20px; font-size: 15px;">
            <li style="margin-bottom: 8px;"><strong>Sam Altman's Multi-Agent Vision:</strong> Preparing for the jump from chatbots to autonomous coworkers.</li>
            <li style="margin-bottom: 8px;"><strong>DeepMind's Gopher-Agent:</strong> AI that navigates complex enterprise software directly.</li>
            <li style="margin-bottom: 8px;"><strong>Apple MacBook Neo:</strong> How cheap, powerful local AI hardware is democratizing agentic work.</li>
            <li style="margin-bottom: 8px;"><strong>The Digital Janitor & News Analyst:</strong> Real-world demos of agents clearing the "boring" path.</li>
          </ul>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'}/newsletter/week-8.html"
               style="display: inline-block; background: #0A84FF; color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3);">
              Read the Full Week 8 Newsletter
            </a>
          </div>
          
          <div style="background: #F8FAFC; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #E2E8F0;">
            <h3 style="color: #1a1a1a; font-size: 18px; margin-top: 0; margin-bottom: 12px;">Join the Community</h3>
            <p style="font-size: 14px; margin-bottom: 20px;">Connect with 150+ fellow AI enthusiasts and get early access to agent demos:</p>
            <div style="display: flex; gap: 12px;">
              <a href="https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ" style="color: #0A84FF; text-decoration: none; font-weight: 600; font-size: 14px;">💬 WhatsApp Group</a>
              <span style="color: #CBD5E1;">&bull;</span>
              <a href="https://discord.com/invite/SW4HZAv37" style="color: #0A84FF; text-decoration: none; font-weight: 600; font-size: 14px;">🎮 Discord Server</a>
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
          subject: 'The Agentic Pivot: From AI as Software to AI as Colleagues 🤖',
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

    console.log(`\nWeek 8 Campaign Complete.`)
    console.log(`Successfully sent: ${successCount}`)
    console.log(`Failed: ${failureCount}`)
    
    process.exit(0)
  } catch (error) {
    console.error('Fatal Error executing campaign:', error)
    process.exit(1)
  }
}

sendCampaign()
