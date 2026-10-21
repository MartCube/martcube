import { Logo } from '@/components/ui/Logo'
import { site } from '@/content/site'

export default function Home() {
  const { eyebrow, headline, body } = site.placeholder

  return (
    <main className="flex min-h-svh flex-col justify-between gap-16 px-6 py-8 sm:px-12 sm:py-12">
      <header>
        <Logo className="h-auto w-40 sm:w-48" />
      </header>

      <section className="max-w-3xl">
        <p className="mb-6 font-mono text-xs tracking-[0.18em] text-lime uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-7xl lg:text-8xl">
          {headline}
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">{body}</p>
      </section>

      <footer className="font-mono text-xs text-muted">
        {site.name}
        {' '}
        · New site in progress
      </footer>
    </main>
  )
}
