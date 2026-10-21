import { Header } from '@/components/layout/Header'
import { ButtonLink } from '@/components/ui/Button'
import { site } from '@/content/site'

export default function NotFound() {
  const { title, body, back } = site.notFound

  return (
    <>
      <Header base="/" />
      <main className="flex min-h-svh items-center px-5 sm:px-12">
        <div className="mx-auto w-full max-w-[1240px]">
          <p className="mb-5 font-mono text-[13px] tracking-[0.14em] text-lime uppercase">404</p>
          <h1 className="max-w-[12ch] font-display text-[52px] leading-[0.95] font-bold tracking-[-0.045em] sm:text-[clamp(64px,8vw,112px)]">{title}</h1>
          <p className="mt-6 max-w-[480px] text-base text-soft sm:text-xl">{body}</p>
          <div className="mt-8">
            <ButtonLink href="/">{back}</ButtonLink>
          </div>
        </div>
      </main>
    </>
  )
}
