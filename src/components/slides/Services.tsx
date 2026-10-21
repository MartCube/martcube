import { services, type Service } from '@/content/home'
import { Eyebrow } from './Eyebrow'

// Four panels side by side. For now this is a native sideways scroll (swipe, trackpad,
// or the tabs). In task 4 the scroll engine pins it and drives it with vertical scroll.
export function Services() {
  return (
    <section id="services" aria-label="Services" className="relative min-h-svh">
      <nav
        aria-label="Services"
        className="absolute inset-x-0 top-20 z-[5] flex gap-5 px-5 font-mono text-[11px] tracking-[0.1em] uppercase sm:top-28 sm:px-12 sm:text-xs"
      >
        {services.items.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="pb-1 text-muted transition-colors hover:text-lime focus-visible:text-lime focus-visible:outline-none"
          >
            {item.tab}
          </a>
        ))}
      </nav>

      <div className="flex h-svh snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none]">
        {services.items.map((item, i) => (
          <ServicePanel key={item.id} item={item} index={i} total={services.items.length} />
        ))}
      </div>
    </section>
  )
}

type ServicePanelProps = {
  item: Service
  index: number
  total: number
}

function ServicePanel({ item, index, total }: ServicePanelProps) {
  const [line1, line2] = item.title

  return (
    <article
      id={item.id}
      aria-label={`${index + 1} of ${total}: ${line1} ${line2}`}
      className="flex w-full shrink-0 snap-start items-end px-5 pt-36 pb-20 sm:items-center sm:px-12"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="max-w-[560px]">
          <Eyebrow>{services.eyebrow}</Eyebrow>
          <h2 className="font-display text-[52px] leading-[0.95] font-bold tracking-[-0.045em] sm:text-[clamp(56px,7vw,104px)]">
            {line1}
            {' '}
            <br />
            {line2}
          </h2>
          <p className="mt-5 text-base text-soft sm:mt-7 sm:text-xl">{item.body}</p>
          <ul aria-label="Good for" className="mt-6 flex flex-wrap gap-2 sm:mt-7">
            {item.tags.map(tag => (
              <li key={tag} className="rounded-full border border-line bg-ink/60 px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] uppercase sm:text-xs">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
