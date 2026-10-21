import { describe, expect, it } from 'vitest'
import { emptyContact, parseContact } from './contact-schema'

const valid = {
  name: 'Ana Petrova',
  email: 'ana@studio.mk',
  need: 'An online store' as const,
  message: 'We sell ceramics and need a new store before spring.',
}

describe('parseContact', () => {
  it('accepts a valid message and trims it', () => {
    const { data, errors } = parseContact({ ...valid, name: '  Ana Petrova ' })
    expect(errors).toBeUndefined()
    expect(data?.name).toBe('Ana Petrova')
  })

  it('treats "what do you need" as optional', () => {
    expect(parseContact({ ...valid, need: '' }).errors).toBeUndefined()
  })

  it('returns one short message per invalid field', () => {
    expect(parseContact(emptyContact).errors).toEqual({
      name: 'Required',
      email: 'Required',
      message: 'At least 20 characters',
    })
  })

  it('rejects a malformed email', () => {
    expect(parseContact({ ...valid, email: 'ana@' }).errors).toEqual({ email: 'Check the address' })
  })

  it('counts message length after trimming', () => {
    expect(parseContact({ ...valid, message: `   ${'a'.repeat(19)}   ` }).errors).toEqual({ message: 'At least 20 characters' })
  })
})
