import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
        }

        // Send via Resend if configured
        if (process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import('resend')
                const resend = new Resend(process.env.RESEND_API_KEY)

                await resend.emails.send({
                    from: 'AI Onboarded Contact <contact@aionboarded.ai>',
                    to: 'hello@aionboarded.ai',
                    replyTo: email,
                    subject: `Contact Form: ${name}`,
                    html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
                })
            } catch (emailErr) {
                console.error('Failed to send contact email:', emailErr)
            }
        }

        // Log the contact form submission
        console.log('[Contact Form]', { name, email, message: message.slice(0, 100) })

        return NextResponse.json({ message: 'Message sent successfully!' })
    } catch (error) {
        console.error('Contact error:', error)
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
    }
}
