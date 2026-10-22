type SpinnerProps = {
  // On the lime button the ring is ink; everywhere else it's the light ring with a lime arc.
  tone?: 'light' | 'ink'
  className?: string
}

// The studio's loading ring: the header loader and the contact form's send button.
export function Spinner({ tone = 'light', className = '' }: SpinnerProps) {
  const ring = tone === 'ink' ? 'border-ink/20 border-t-ink' : 'border-paper/15 border-t-lime'
  return <span aria-hidden="true" className={`inline-block rounded-full border-2 motion-safe:animate-spin ${ring} ${className}`} />
}
