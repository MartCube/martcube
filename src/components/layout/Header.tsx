import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { DeckLoader } from './DeckLoader'
import { site } from '@/content/site'

// On the homepage the links are in-page anchors (the deck engine handles them).
// Other pages pass `base="/"` so the same links lead back to the homepage.
export function Header({ base = '' }: { base?: string }) {
  const { cta } = site.header

  return (
    <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-5 sm:px-12 sm:pt-7">
      <div className="flex items-center gap-3.5">
        <a href={`${base}#hero`} aria-label={`${site.name}, back to top`} className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper">
          <Logo className="h-auto w-32 sm:w-36" />
        </a>
        <DeckLoader />
      </div>
      <ButtonLink href={`${base}${cta.href}`} size="sm">{cta.label}</ButtonLink>
    </header>
  )
}
