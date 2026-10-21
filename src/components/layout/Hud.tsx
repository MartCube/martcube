'use client'

import { controller } from '@/motion/controller'
import { slideCount, stopForSlide } from '@/motion/stops'
import { useAppSelector } from '@/store/hooks'
import { selectProgress, selectSlide } from '@/store/uiSlice'

const slideNames = ['Intro', 'Services', 'Contact']
const pad = (n: number) => String(n).padStart(2, '0')

// Bottom bar: slide counter, progress and one dot per slide.
export function Hud() {
  const slide = useAppSelector(selectSlide)
  const progress = useAppSelector(selectProgress)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex items-center justify-between px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] font-mono text-[11px] tracking-[0.12em] text-muted sm:px-12 sm:pb-6 sm:text-xs">
      <div className="flex items-center gap-3.5 tabular-nums">
        <span>
          <span className="text-paper">{pad(slide + 1)}</span>
          {' / '}
          {pad(slideCount)}
        </span>
        <span aria-hidden="true" className="hidden h-0.5 w-[120px] overflow-hidden bg-line md:block">
          <span className="block h-full origin-left bg-lime" style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className="hidden md:inline">SCROLL OR USE ↑ ↓</span>
      </div>

      <nav aria-label="Slides" className="pointer-events-auto flex gap-1">
        {slideNames.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            aria-current={slide === i ? 'true' : undefined}
            onClick={() => controller.goTo(stopForSlide(i))}
            className="group grid size-7 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-lime"
          >
            <span className="size-2 rounded-full bg-line transition-[background-color,scale] duration-300 group-aria-[current=true]:scale-130 group-aria-[current=true]:bg-lime" />
          </button>
        ))}
      </nav>
    </div>
  )
}
