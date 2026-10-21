import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendContact } from '@/app/actions/contact'
import { ContactForm } from './ContactForm'

vi.mock('@/app/actions/contact', () => ({
  sendContact: vi.fn(async () => ({ status: 'sent', name: 'Ana', email: 'ana@studio.mk' })),
}))

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ana Petrova')
  await user.type(screen.getByLabelText('Email'), 'ana@studio.mk')
  await user.type(screen.getByLabelText('Message'), 'We need a new store before spring.')
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.mocked(sendContact).mockClear()
  })

  it('shows no errors before the first submit', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Email'), 'nope')
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
  })

  it('blocks an invalid submit, shows errors and focuses the first bad field', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(sendContact).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('Required')
    expect(screen.getByLabelText('Message')).toHaveAccessibleDescription('At least 20 characters')
    expect(screen.getByLabelText('Name')).toHaveFocus()
  })

  it('clears an error as soon as the field becomes valid', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Send message' }))
    await user.type(screen.getByLabelText('Name'), 'Ana')

    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
  })

  it('sends a valid form and shows the sent panel, then resets on "Send another"', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillValid(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByRole('heading', { name: 'Message sent.' })).toBeInTheDocument()
    expect(sendContact).toHaveBeenCalledOnce()
    expect(screen.getByText(/Thanks, Ana\./)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send another' }))
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })
})
