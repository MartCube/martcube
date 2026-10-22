import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendContactEmail } from '@/lib/mail'
import { sendContact } from './contact'

vi.mock('@/lib/mail', () => ({ sendContactEmail: vi.fn(async () => 'sent') }))

function form(values: Record<string, string>) {
  const data = new FormData()
  for (const [k, v] of Object.entries(values)) data.set(k, v)
  return data
}

const valid = { name: 'Ana Petrova', email: 'ana@studio.mk', need: '', message: 'We need a new store before spring.' }

describe('sendContact', () => {
  beforeEach(() => {
    vi.mocked(sendContactEmail).mockClear()
  })

  it('emails a valid message and thanks the visitor by first name', async () => {
    const state = await sendContact({ status: 'idle' }, form(valid))
    expect(state).toEqual({ status: 'sent', name: 'Ana', email: 'ana@studio.mk' })
    expect(sendContactEmail).toHaveBeenCalledWith(expect.objectContaining({ email: 'ana@studio.mk' }))
  })

  it('returns the errors and sends nothing when the message is invalid', async () => {
    const state = await sendContact({ status: 'idle' }, form({ ...valid, message: 'Too short' }))
    expect(state.status).toBe('invalid')
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('pretends to send for bots that fill in the honeypot', async () => {
    const state = await sendContact({ status: 'idle' }, form({ ...valid, website: 'spam.example' }))
    expect(state.status).toBe('sent')
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it('reports a failure when the email cannot be sent', async () => {
    vi.mocked(sendContactEmail).mockResolvedValueOnce('failed')
    const state = await sendContact({ status: 'idle' }, form(valid))
    expect(state).toEqual({ status: 'failed' })
  })
})
