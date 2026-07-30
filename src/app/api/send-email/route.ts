import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

export async function POST(request: Request) {
  if (!resendApiKey) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY is not configured.' },
      { status: 500 },
    )
  }

  try {
    const body = await request.json()
    const { from, to, subject, html } = body

    if (!from || !to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, subject, html' },
        { status: 400 },
      )
    }

    const resend = new Resend(resendApiKey)
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Resend rejected the email.' },
        { status: 400 },
      )
    }

    return NextResponse.json({ id: data?.id })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Invalid email request.',
      },
      { status: 400 },
    )
  }
}
