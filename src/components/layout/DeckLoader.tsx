'use client'

import { useAppSelector } from '@/store/hooks'
import { selectMoving } from '@/store/uiSlice'

// Small spinner beside the logo. It runs while a slide transition plays,
// which is also while scrolling and swiping are locked.
export function DeckLoader() {
  const moving = useAppSelector(selectMoving)

  return (
    <span
      aria-hidden="true"
      className={`size-[18px] translate-y-[2px] rounded-full border-2 border-paper/15 border-t-lime transition-opacity duration-300 motion-safe:animate-spin ${moving ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
