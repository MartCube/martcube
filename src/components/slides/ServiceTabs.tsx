'use client'

import { services } from '@/content/home'
import { useAppSelector } from '@/store/hooks'
import { selectService, selectSlide } from '@/store/uiSlice'

// Tabs above the strip. Clicks are plain anchors; the scroll engine turns them into slides.
export function ServiceTabs() {
  const slide = useAppSelector(selectSlide)
  const active = useAppSelector(selectService)

  return (
    <nav
      aria-label="Services"
      className="absolute inset-x-0 top-20 z-[5] flex gap-5 px-5 font-mono text-[11px] tracking-[0.1em] uppercase sm:top-28 sm:px-12 sm:text-xs"
    >
      {services.items.map((item, i) => {
        const current = slide === 1 && active === i
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={current ? 'true' : undefined}
            className="border-b-2 border-transparent pb-1 text-muted transition-colors hover:text-lime focus-visible:text-lime focus-visible:outline-none aria-[current=true]:border-lime aria-[current=true]:text-lime"
          >
            {item.tab}
          </a>
        )
      })}
    </nav>
  )
}
