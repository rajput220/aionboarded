import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import pg from 'pg'

const { Client } = pg

// ---------------------------------------------------------
// POST /api/agent/dispatch-newsletter
//
// Generic newsletter dispatch endpoint for the automated
// pipeline. Accepts dynamic subject + HTML body — no
// hardcoded week content. Secured by AGENT_API_KEY.
//
// Body:
//   apiKey        : string  — must match AGENT_API_KEY
//   weekNumber    : number  — e.g. 15
//   theme         : string  — e.g. "The Agentic Threshold"
//   subject       : string  — email subject line
//   htmlBody      : string  — full HTML email body
//   dryRun        : boolean — if true, sends only to AGENT_TEST_EMAIL
// ---------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey, weekNumber, theme, subject, htmlBody, dryRun } = body as {
      apiKey: string
      weekNumber: number
      theme: string
      subject: string
      htmlBody: string
      dryRun?: boolean
    }

    // Auth check
    if (apiKey !== process.env.AGENT_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!weekNumber || !subject || !htmlBody) {
      return NextResponse.json(
        { error: 'weekNumber, subject, and htmlBody are required' },
        { status: 400 },
      )
    }

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('placeholder')) {
      return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
    }

    // Fetch confirmed subscribers via direct DB query (faster than Payload for large lists)
    const client = new Client({ connectionString: process.env.DATABASE_URL })
    await client.connect()

    let subscribersQuery: pg.QueryResult
    if (dryRun) {
      const testEmail = process.env.AGENT_TEST_EMAIL
      if (!testEmail) {
        await client.end()
        return NextResponse.json({ error: 'AGENT_TEST_EMAIL not set for dry run' }, { status: 400 })
      }
      subscribersQuery = await client.query(
        `SELECT email, first_name FROM subscribers WHERE email = $1`,
        [testEmail],
      )
      console.log(`[Agent] DRY RUN — sending only to ${testEmail}`)
    } else {
      subscribersQuery = await client.query(
        `SELECT email, first_name FROM subscribers WHERE confirmed = true`,
      )
    }

    await client.end()

    const subscribers = subscribersQuery.rows
    console.log(`[Agent] Week ${weekNumber} "${theme}" — dispatching to ${subscribers.length} subscribers${dryRun ? ' (DRY RUN)' : ''}`)

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No confirmed subscribers found.' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    let successCount = 0
    let failureCount = 0

    for (const sub of subscribers) {
      const firstName = (sub.first_name as string) || 'there'
      const email = sub.email as string

      // Personalise the greeting in the HTML body
      const personalisedHtml = htmlBody.replace(/\{\{firstName\}\}/g, firstName)

      try {
        await resend.emails.send({
          from: 'AI Onboarded <newsletter@aionboarded.ai>',
          to: email,
          subject,
          html: personalisedHtml,
        })
        successCount++
      } catch (err) {
        console.error(`[Agent] Failed to send to ${email}:`, err)
        failureCount++
      }

      // 100ms throttle to respect Resend rate limits
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(`[Agent] Dispatch complete. Sent: ${successCount}, Failed: ${failureCount}`)
    return NextResponse.json({
      success: true,
      weekNumber,
      theme,
      dryRun: dryRun ?? false,
      sent: successCount,
      failed: failureCount,
    })
  } catch (error: any) {
    console.error('[Agent] Dispatch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
