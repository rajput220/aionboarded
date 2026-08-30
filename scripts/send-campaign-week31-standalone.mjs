/**
 * AIOnboarded - Standalone Campaign Sender (Week 31)
 * Self-contained: queries Postgres directly, no Payload CMS dependency.
 * Run inside the Docker container with: node scripts/send-campaign-week31-standalone.mjs
 *
 * Theme: Anthropic Takes the Crown
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
      `SELECT email, first_name FROM subscribers WHERE confirmed = true`
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
      const firstName = sub.first_name || 'there'
      const email = sub.email

      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #334155; line-height: 1.7;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #0A84FF, #1DB954); color: white; display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 20px; margin-bottom: 12px;">AI</div>
            <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0;">AI Onboarded Weekly Brief</h1>
            <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Week 31: Anthropic Takes the Crown</p>
          </div>

          <p style="font-size: 16px;">Hi ${firstName},</p>

          <p style="font-size: 16px; font-weight: 500; color: #0F172A;">Anthropic surpasses OpenAI in revenue and becomes the first profitable frontier AI lab. Stripe acquires OpenRouter for $7B+. ChatGPT launches for teens. The EU orders Google to open Android to rival AI assistants.</p>

          <p style="font-size: 16px;">In this week's edition, we cover <strong>Anthropic Takes the Crown</strong> — the week Anthropic crossed from ambitious challenger to commercial leader. Highlights include:</p>

          <ul style="padding-left: 20px; font-size: 15px;">
            <li style="margin-bottom: 8px;"><strong>Anthropic $65B Revenue Run Rate:</strong> Surpasses OpenAI's $40B, reports the first positive adjusted operating income for any frontier AI lab. IPO targeting fall 2026.</li>
            <li style="margin-bottom: 8px;"><strong>Stripe Acquires OpenRouter ($7B+):</strong> AI model routing becomes financial infrastructure — Stripe now controls how enterprises route and pay for AI inference across 300+ models.</li>
            <li style="margin-bottom: 8px;"><strong>ChatGPT for Teens:</strong> Specialized version for ages 13-17 with parental controls, content restrictions, quiet hours, and study-focused design.</li>
            <li style="margin-bottom: 8px;"><strong>Claude Autonomous Workflows:</strong> Doubles protein design success rates in drug discovery — the first evidence of AI autonomous agents outperforming human researchers in a critical scientific domain.</li>
            <li style="margin-bottom: 8px;"><strong>EU vs Google Android:</strong> Regulators order Google to grant rival AI assistants default-assistant access on Android — the biggest AI platform ruling since the EU AI Act.</li>
          </ul>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${SITE_URL}/newsletter/week-31.html"
               style="display: inline-block; background: linear-gradient(135deg, #0A84FF, #1DB954); color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3);">
              Read the Full Week 31 Newsletter
            </a>
          </div>

          <div style="background: #F8FAFC; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #E2E8F0;">
            <h3 style="color: #1a1a1a; font-size: 18px; margin-top: 0; margin-bottom: 12px;">Join the Community</h3>
            <p style="font-size: 14px; margin-bottom: 20px;">Connect with 150+ AI practitioners sharing strategic insights and staying ahead of the curve:</p>
            <div style="display: flex; gap: 12px;">
              <a href="https://chat.whatsapp.com/Gwl3CkJ6hsXFRsJD14VyJJ" style="color: #0A84FF; text-decoration: none; font-weight: 600; font-size: 14px;">WhatsApp Group</a>
              <span style="color: #CBD5E1;">&bull;</span>
              <a href="https://discord.com/invite/SW4HZAv37" style="color: #0A84FF; text-decoration: none; font-weight: 600; font-size: 14px;">Discord Server</a>
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
          subject: 'Week 31: Anthropic Overtakes OpenAI & The $7B AI Infrastructure Bet',
          html: htmlBody,
        })
        successCount++
        console.log(`Sent to ${email}`)
      } catch (err) {
        failureCount++
        console.error(`Failed to send to ${email}:`, err)
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }

    await client.end()
    console.log(`\nWeek 31 Campaign Complete.`)
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
