import { KineticWord } from '@/components/motion/KineticWord'
import { Lines } from '@/components/motion/Lines'
import { ButtonLink } from '@/components/ui/Button'
import { hero } from '@/content/home'
import { Eyebrow } from './Eyebrow'
import { Slide } from './Slide'

export function Hero() {
  const [line1, line2] = hero.title

  return (
    <Slide id="hero" aria-label="Intro">
      <div className="max-w-[660px]">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="font-display text-[58px] leading-[0.95] font-bold tracking-[-0.045em] sm:text-[clamp(64px,9vw,128px)]">
          <Lines
            lines={[
              line1,
              <span key="kinetic" className="text-lime">
                {line2}
                {' '}
                <KineticWord words={hero.words} />
              </span>,
            ]}
          />
        </h1>
        <p data-reveal="item" className="mt-5 max-w-[520px] text-base text-soft sm:mt-7 sm:text-xl">{hero.body}</p>
        <div data-reveal="item" className="mt-7 flex flex-wrap gap-3 sm:mt-9">
          <ButtonLink href={hero.primary.href}>{hero.primary.label}</ButtonLink>
          <ButtonLink href={hero.secondary.href} variant="ghost">{hero.secondary.label}</ButtonLink>
        </div>
      </div>
    </Slide>
  )
}
