'use server'

import { parseContact, type ContactErrors, type ContactInput } from '@/lib/contact-schema'

export type ContactState
  = | { status: 'idle' }
    | { status: 'invalid', errors: ContactErrors }
    | { status: 'failed' }
    | { status: 'sent', name: string, email: string }

// Phase 1: validates and pretends to send. Phase 2 sends the email with Resend here.
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactInput = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    need: String(formData.get('need') ?? '') as ContactInput['need'],
    message: String(formData.get('message') ?? ''),
  }
  const { data, errors } = parseContact(values)
  if (errors) return { status: 'invalid', errors }

  await new Promise(resolve => setTimeout(resolve, 1200))

  const firstName = data.name.split(/\s+/)[0] ?? data.name
  return { status: 'sent', name: firstName, email: data.email }
}
