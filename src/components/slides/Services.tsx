import { Lines } from '@/components/motion/Lines'
import { services, type Service } from '@/content/home'
import { Eyebrow } from './Eyebrow'
import { ServiceTabs } from './ServiceTabs'

// Four panels side by side. On desktop the scroll engine pins this section and moves the
// track sideways as the page scrolls. On touch screens the track is swiped natively.
export function Services() {
  return (
    <section id="services" aria-label="Services" className="relative h-svh snap-start smooth:overflow-hidden">
      <ServiceTabs />

      <div data-track className="flex h-svh snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] smooth:snap-none smooth:overflow-visible">
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
            <Lines lines={[line1, line2]} />
          </h2>
          <p data-reveal="item" className="mt-5 text-base text-soft sm:mt-7 sm:text-xl">{item.body}</p>
          <ul data-reveal="item" aria-label="Good for" className="mt-6 flex flex-wrap gap-2 sm:mt-7">
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
