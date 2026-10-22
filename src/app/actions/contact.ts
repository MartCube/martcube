'use server'

import { parseContact, type ContactErrors, type ContactInput } from '@/lib/contact-schema'
import { sendContactEmail } from '@/lib/mail'

export type ContactState
  = | { status: 'idle' }
    | { status: 'invalid', errors: ContactErrors }
    | { status: 'failed' }
    | { status: 'sent', name: string, email: string }

// Validates the message again on the server, then emails it to the studio inbox.
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactInput = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    need: String(formData.get('need') ?? '') as ContactInput['need'],
    message: String(formData.get('message') ?? ''),
  }
  const { data, errors } = parseContact(values)
  if (errors) return { status: 'invalid', errors }

  const firstName = data.name.split(/\s+/)[0] ?? data.name
  const sent: ContactState = { status: 'sent', name: firstName, email: data.email }

  // The hidden "website" field is a honeypot: people never see it, bots fill it in.
  // Bots get the same "sent" answer, so they learn nothing, but nothing is emailed.
  if (String(formData.get('website') ?? '')) return sent

  return (await sendContactEmail(data)) === 'sent' ? sent : { status: 'failed' }
}
