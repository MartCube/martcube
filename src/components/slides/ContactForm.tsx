'use client'

import { useActionState, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { sendContact, type ContactState } from '@/app/actions/contact'
import { Field, inputClass } from '@/components/ui/Field'
import { contact } from '@/content/home'
import { emptyContact, parseContact, type ContactField, type ContactInput } from '@/lib/contact-schema'
import { useAppDispatch } from '@/store/hooks'
import { messageSent } from '@/store/uiSlice'

const initialState: ContactState = { status: 'idle' }
const fieldOrder: ContactField[] = ['name', 'email', 'need', 'message']

// "Send another" remounts the form through `key`, which resets both the fields and the action state.
export function ContactForm() {
  const [round, setRound] = useState(0)
  return <ContactFormRound key={round} onReset={() => setRound(r => r + 1)} />
}

function ContactFormRound({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendContact, initialState)
  const [values, setValues] = useState<ContactInput>(emptyContact)
  const [submitted, setSubmitted] = useState(false)
  const dispatch = useAppDispatch()
  const { form } = contact

  // Tell the rest of the page a message went out (the particle sphere bursts).
  useEffect(() => {
    if (state.status === 'sent') dispatch(messageSent())
  }, [state.status, dispatch])

  // Errors only show after the first submit, then update live as the visitor types.
  const errors = submitted ? (parseContact(values).errors ?? {}) : {}

  function update(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setSubmitted(true)
    const { errors } = parseContact(values)
    if (!errors) return

    // Invalid: stop the Server Action from running and move focus to the first problem.
    e.preventDefault()
    const first = fieldOrder.find(f => errors[f])
    if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus()
  }

  if (state.status === 'sent') {
    return <SentPanel name={state.name} email={state.email} onReset={onReset} />
  }

  const failed = state.status === 'failed' || state.status === 'invalid'
  const fieldProps = (name: ContactField) => ({
    'id': `contact-${name}`,
    name,
    'value': values[name],
    'onChange': update,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': `contact-${name}-error`,
    'className': inputClass,
  })

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="w-full rounded-[18px] border border-line bg-ink/85 p-5 backdrop-blur-sm sm:p-8"
    >
      {/* Honeypot: hidden from people and screen readers, filled in by bots. The server drops those messages. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />
      <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label={form.name.label} error={errors.name}>
          <input {...fieldProps('name')} type="text" autoComplete="name" placeholder={form.name.placeholder} />
        </Field>
        <Field id="contact-email" label={form.email.label} error={errors.email}>
          <input {...fieldProps('email')} type="email" autoComplete="email" placeholder={form.email.placeholder} />
        </Field>
        <Field id="contact-need" label={form.need.label} className="sm:col-span-2">
          <select {...fieldProps('need')} className={values.need ? inputClass : inputClass.replace('text-paper', 'text-[#8d8c86]')}>
            <option value="">{form.need.placeholder}</option>
            {form.need.options.map(option => <option key={option}>{option}</option>)}
          </select>
        </Field>
        <Field id="contact-message" label={form.message.label} error={errors.message} className="sm:col-span-2">
          <textarea {...fieldProps('message')} rows={4} placeholder={form.message.placeholder} className={`${inputClass} resize-y`} />
        </Field>

        <div className="flex items-center justify-between gap-4 sm:col-span-2">
          <p role="alert" className="min-w-0 text-sm text-error">{failed ? form.failed : ''}</p>
          <button
            type="submit"
            aria-busy={pending || undefined}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full bg-lime px-5 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-[#d8ff6a] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-paper disabled:cursor-progress disabled:opacity-80"
          >
            {pending && <LoadingDots />}
            {pending ? form.sending : form.submit}
          </button>
        </div>
      </fieldset>
    </form>
  )
}

function LoadingDots() {
  return (
    <span aria-hidden="true" className="inline-flex gap-1">
      {[0, 150, 300].map(delay => (
        <i key={delay} className="size-[5px] animate-pulse rounded-full bg-current" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  )
}

type SentPanelProps = {
  name: string
  email: string
  onReset: () => void
}

function SentPanel({ name, email, onReset }: SentPanelProps) {
  const { sent } = contact
  const againRef = useRef<HTMLButtonElement>(null)

  // Move focus to the panel's button so keyboard and screen reader users land on the result.
  useEffect(() => {
    againRef.current?.focus()
  }, [])

  return (
    <div role="status" className="flex w-full flex-col items-start gap-5 rounded-[18px] border border-line bg-ink/85 px-6 py-9 sm:px-8 sm:py-10">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <g fill="none" stroke="#C8F542" strokeLinecap="round" strokeWidth="5" strokeDasharray="0 10">
          <circle cx="32" cy="32" r="28" />
          <path d="M18 33 L28 43 L47 22" />
        </g>
      </svg>
      <h3 className="font-display text-[44px] leading-none font-bold tracking-[-0.04em]">{sent.title}</h3>
      <p className="max-w-[26em] text-soft">{sent.body(name, email)}</p>
      <button
        ref={againRef}
        type="button"
        onClick={onReset}
        className="cursor-pointer rounded-full border border-line px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:border-paper/40 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-paper"
      >
        {sent.again}
      </button>
    </div>
  )
}
