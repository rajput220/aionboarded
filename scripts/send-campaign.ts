/**
 * AIOnboarded - Newsletter Campaign Sender
 * 
 * Instructions:
 * 1. Upload this file to your Hostinger server (e.g. at the root of your aionboarded app)
 * 2. Ensure your Hostinger environment has RESEND_API_KEY and DATABASE_URL set.
 * 3. Run the script via cron or manually on Hostinger node.js terminal:
 *    npx tsx scripts/send-campaign.ts
 */

import { getPayload } from 'payload'
import config from './../src/payload.config'
import { Resend } from 'resend'
import * as fs from 'fs'
import * as path from 'path'

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

    // Read the email draft we created earlier
    const emailDraftPath = path.join(__dirname, '../../aionboarded-newsletter/content/week-7/email-draft.md')
    let emailContent = ''
    try {
        emailContent = fs.readFileSync(emailDraftPath, 'utf8')
    } catch (e) {
        console.warn("Could not read markdown draft, using fallback HTML.")
    }

    console.log('Sending emails via Resend...')
    
    // We send emails in batches to avoid rate limits
    let successCount = 0
    let failureCount = 0

    for (const sub of confirmedSubs) {
      const firstName = (sub as any).firstName || 'there'
      const email = (sub as any).email
      
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Welcome to Week 7 of the AI Onboarded Weekly Brief! 🎉</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">The era of AI as a static digital encyclopedia is over. We are seeing a fundamental shift from chatbots that simply answer questions, to autonomous agents that can execute entire workflows.</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">In this week's edition, we are covering <strong>The Agentic Era</strong>, including The Three Pillars of Agentic AI, The Sovereign Agentic Shift, GPT-5.4 & Extreme Reasoning, and more.</p>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/newsletter/week-7.html"
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
        console.log(`✅ Sent to ${email}`)
      } catch (err) {
        failureCount++
        console.error(`❌ Failed to send to ${email}:`, err)
      }

      // Sleep for 100ms between sends to respect Resend rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`\nCampaign Complete.`)
    console.log(`Successfully sent: ${successCount}`)
    console.log(`Failed: ${failureCount}`)
    
    process.exit(0)
  } catch (error) {
    console.error('Fatal Error executing campaign:', error)
    process.exit(1)
  }
}

sendCampaign()
