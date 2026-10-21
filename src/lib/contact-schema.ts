import { z } from 'zod'
import { contact } from '@/content/home'

// One schema for both sides: the form checks it in the browser for instant errors,
// and the Server Action checks it again, because the browser can't be trusted.
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Required').max(100, 'Too long'),
  email: z.string().trim().min(1, 'Required').pipe(z.email('Check the address')),
  need: z.union([z.enum(contact.form.need.options), z.literal('')]),
  message: z.string().trim().min(20, 'At least 20 characters').max(5000, 'Too long'),
})

export type ContactInput = z.input<typeof contactSchema>
export type ContactField = keyof ContactInput
export type ContactErrors = Partial<Record<ContactField, string>>

export const emptyContact: ContactInput = { name: '', email: '', need: '', message: '' }

export type ContactData = z.output<typeof contactSchema>

// Parses the form values. On failure, returns the first error message per field.
export function parseContact(values: ContactInput): { data: ContactData, errors?: never } | { data?: never, errors: ContactErrors } {
  const result = contactSchema.safeParse(values)
  if (result.success) return { data: result.data }

  const errors: ContactErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField
    errors[field] ??= issue.message
  }
  return { errors }
}
