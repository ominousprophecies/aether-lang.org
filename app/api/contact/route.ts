import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, org, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null

    // Save to Supabase
    const supabase = createAdminClient()
    const { error: dbError } = await supabase
      .from('contacts')
      .insert({ name, email, org: org || null, message, ip, source: 'aether-lang.org' })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      // Don't fail the request — still try to send email
    }

    // Send email via Resend if key is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Aether Site <noreply@aether-lang.org>',
          to: process.env.CONTACT_EMAIL_TO || 'info@bruno-protocol.org',
          subject: `New contact: ${name} — ${org || 'no org'}`,
          text: `Name: ${name}\nEmail: ${email}\nOrg: ${org || '—'}\n\n${message}\n\n---\nFrom: aether-lang.org`,
        })
      } catch (emailErr) {
        console.error('Resend error:', emailErr)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
