import type { ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

// Label row with room for the error on the right, so showing an error never moves the layout.
export function Field({ id, label, error, className = '', children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex min-h-[1.5em] items-baseline justify-between gap-3 text-sm text-muted">
        <label htmlFor={id}>{label}</label>
        <span
          id={`${id}-error`}
          aria-live="polite"
          className={`truncate text-[13px] text-error transition-[opacity,translate] duration-200 ${error ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
        >
          {error}
        </span>
      </div>
      {children}
    </div>
  )
}

export const inputClass
  = 'w-full rounded-[10px] border border-line bg-field px-3.5 py-[13px] text-base text-paper placeholder:text-[#8d8c86] '
    + 'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-lime '
    + 'aria-invalid:border-error disabled:opacity-60'
