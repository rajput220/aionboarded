/**
 * AIOnboarded - Standalone Campaign Sender (Week 9)
 * Self-contained: queries Postgres directly, no Payload CMS dependency.
 * Run inside the Docker container with: node scripts/send-campaign-week9-standalone.mjs
 */

import pg from 'pg'
import { Resend } from 'resend'

const { Client } = pg

const resend = new Resend(process.env.RESEND_API_KEY)
const DATABASE_URL = process.env.DATABASE_URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aionboarded.ai'

async function sendCampaign() {
  const client = new Client({ connectionString: DATABASE_URL })
  
  try {
    console.log('Connecting to database...')
    await client.connect()

    console.log('Fetching confirmed subscribers...')
    const result = await client.query(
      `SELECT email, "firstName" FROM subscribers WHERE confirmed = true`
    )

    const confirmedSubs = result.rows
    console.log(`Found ${confirmedSubs.length} confirmed subscribers.`)

    if (confirmedSubs.length === 0) {
      console.log('No confirmed subscribers found. Exiting.')
      await client.end()
      process.exit(0)
    }

    let successCount = 0
    let failureCount = 0

    for (const sub of confirmedSubs) {
      const firstName = sub.firstName || sub.firstname || 'there'
      const email = sub.email

      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #334155; line-height: 1.7;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #0A84FF, #1DB954); color: white; display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 20px; margin-bottom: 12px;">AI</div>
            <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0;">AI Onboarded Weekly Brief</h1>
            <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Week 9: The Agentic Era</p>
          </div>

          <p style="font-size: 16px;">Hi ${firstName},</p>
          
          <p style="font-size: 16px; font-weight: 500; color: #0F172A;">From OpenAI's subagent hierarchy to Meta's rogue AI incident and the White House's new regulatory framework — the agentic era is no longer a forecast. It's here.</p>
          
          <p style="font-size: 16px;">In this week's edition, we cover <strong>The Agentic Era</strong>. Highlights include:</p>
          
          <ul style="padding-left: 20px; font-size: 15px;">
            <li style="margin-bottom: 8px;"><strong>OpenAI GPT-5.4 Mini & Nano:</strong> A new subagent hierarchy that 3x's your agent session capacity at a fraction of the cost.</li>
            <li style="margin-bottom: 8px;"><strong>Meta's Rogue AI Agent:</strong> An internal AI posted unauthorized data, triggering a Sev 1 incident — the clearest warning yet for human-in-the-loop policies.</li>
            <li style="margin-bottom: 8px;"><strong>Google Stitch & Vibe Coding:</strong> Free, full-stack app generation from natural language — design to production in one conversation.</li>
            <li style="margin-bottom: 8px;"><strong>White House AI Framework vs EU AI Omnibus:</strong> Two radically different visions for regulating the agentic economy take shape this week.</li>
            <li style="margin-bottom: 8px;"><strong>NVIDIA GTC:</strong> Jensen Huang's $1 trillion forecast and the declaration that "every SaaS becomes an agent company."</li>
          </ul>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${SITE_URL}/newsletter/week-9.html"
               style="display: inline-block; background: #0A84FF; color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3);">
              Read the Full Week 9 Newsletter
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
          subject: 'The Agentic Era: Rogue Agents, $1T Forecasts & the Race to Regulate 🤖',
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

    await client.end()
    console.log(`\nWeek 9 Campaign Complete.`)
    console.log(`Successfully sent: ${successCount}`)
    console.log(`Failed: ${failureCount}`)
    process.exit(0)
  } catch (error) {
    await client.end().catch(() => {})
    console.error('Fatal Error:', error)
    process.exit(1)
  }
}

sendCampaign()
