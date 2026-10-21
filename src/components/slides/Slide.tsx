import type { ComponentProps } from 'react'

// One full-screen slide. In the deck the slides sit on top of each other and the deck engine
// switches between them. A slide taller than the screen (the contact form on a phone) scrolls inside itself.
export function Slide({ className = '', children, ...props }: ComponentProps<'section'>) {
  return (
    <section
      tabIndex={-1}
      className={`relative flex min-h-svh flex-col px-5 pt-28 pb-20 outline-none sm:px-12 sm:py-28 deck:absolute deck:inset-0 deck:h-svh deck:min-h-0 deck:overflow-y-auto deck:overscroll-contain deck:[scrollbar-width:none] ${className}`}
      {...props}
    >
      {/* Auto margins centre the content, and still let it start at the top when it's taller than the slide. */}
      <div className="mx-auto mt-auto w-full max-w-[1240px] sm:my-auto">{children}</div>
    </section>
  )
}
