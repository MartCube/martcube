import { Lines } from '@/components/motion/Lines'
import { services, type Service } from '@/content/home'
import { Eyebrow } from './Eyebrow'
import { ServiceTabs } from './ServiceTabs'

// Four panels side by side. In the deck the engine slides the track sideways between them
// (wheel, arrows, swipes or the tabs); on phones the panels act as tabs.
export function Services() {
  return (
    <section id="services" aria-label="Services" tabIndex={-1} className="relative h-svh overflow-hidden outline-none deck:absolute deck:inset-0">
      <ServiceTabs />

      <div data-track className="flex h-svh snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] deck:snap-none deck:overflow-visible">
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
      tabIndex={-1}
      className="flex h-svh w-full shrink-0 snap-start flex-col overflow-y-auto overscroll-contain px-5 pt-36 pb-20 outline-none [scrollbar-width:none] sm:px-12"
    >
      <div className="mx-auto mt-auto w-full max-w-[1240px] sm:my-auto">
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
