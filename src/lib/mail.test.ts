import { afterEach, describe, expect, it, vi } from 'vitest'
import { contactText, sendContactEmail } from './mail'

const send = vi.fn(async () => ({ data: { id: '1' }, error: null as { message: string } | null }))
vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return { emails: { send } }
  }),
}))

const data = { name: 'Ana\nPetrova', email: 'ana@studio.mk', need: '' as const, message: 'We need a new store before spring.' }

describe('sendContactEmail', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    send.mockClear()
  })

  it('sends nothing without the Resend settings', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(await sendContactEmail(data)).toBe('sent')
    expect(send).not.toHaveBeenCalled()
  })

  it('sends a plain text email to the inbox, with the visitor as reply-to', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('CONTACT_TO', 'hello@martcube.com')
    expect(await sendContactEmail(data)).toBe('sent')
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      to: 'hello@martcube.com',
      replyTo: 'ana@studio.mk',
      subject: 'New project inquiry from Ana Petrova',
    }))
  })

  it('reports a failure from Resend', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('CONTACT_TO', 'hello@martcube.com')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    send.mockResolvedValueOnce({ data: null as never, error: { message: 'bad key' } })
    expect(await sendContactEmail(data)).toBe('failed')
  })
})

describe('contactText', () => {
  it('lists the fields, then the message', () => {
    expect(contactText({ ...data, name: 'Ana' })).toMatch(/^Name: Ana\nEmail: ana@studio.mk\nNeeds: Not specified\n\nWe need a new store/)
  })
})
