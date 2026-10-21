import type { ComponentProps } from 'react'

// One full-screen slide. The scroll engine (task 4) snaps between these.
export function Slide({ className = '', children, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={`relative flex min-h-svh items-end px-5 pt-28 pb-20 sm:items-center sm:px-12 sm:py-28 ${className}`}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1240px]">{children}</div>
    </section>
  )
}
