import { Resend } from 'resend'
import type { ContactData } from './contact-schema'

// Sends a contact message to the studio inbox with Resend. Server only: it reads the API key.
// Settings (Netlify → Site configuration → Environment variables):
//   RESEND_API_KEY  the key from resend.com
//   CONTACT_TO      the inbox that receives messages
//   CONTACT_FROM    optional sender; until a domain is verified in Resend, its test sender is used
// Without RESEND_API_KEY (local dev, tests, previews) nothing is sent and the message is only logged.
export type MailResult = 'sent' | 'failed'

const FALLBACK_FROM = 'MartCube website <onboarding@resend.dev>'

export async function sendContactEmail(data: ContactData): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO
  if (!key || !to) {
    console.warn('Contact email not sent: RESEND_API_KEY or CONTACT_TO is not set.')
    return 'sent'
  }

  const { error } = await new Resend(key).emails.send({
    from: process.env.CONTACT_FROM || FALLBACK_FROM,
    to,
    replyTo: data.email,
    subject: `New project inquiry from ${oneLine(data.name)}`,
    text: contactText(data),
  })
  if (error) {
    console.error('Contact email failed:', error.message)
    return 'failed'
  }
  return 'sent'
}

// Plain text only, so nothing a visitor types can be read as HTML.
export function contactText({ name, email, need, message }: ContactData): string {
  return [
    `Name: ${name}`,
    `Email: ${email}`,
    `Needs: ${need || 'Not specified'}`,
    '',
    message,
    '',
    '—',
    'Sent from the contact form on martcube. Reply to this email to answer them.',
  ].join('\n')
}

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim()
