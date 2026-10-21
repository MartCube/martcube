'use client'

import { useAppSelector } from '@/store/hooks'
import { selectSceneLoading } from '@/store/uiSlice'

// Small spinner beside the logo. It runs while the particle scene downloads and starts
// (on phones that's after the first touch, and can take a couple of seconds).
// It used to run during slide transitions too: swap in selectMoving to bring that back.
export function DeckLoader() {
  const loading = useAppSelector(selectSceneLoading)

  return (
    <span
      aria-hidden="true"
      className={`size-[18px] translate-y-[2px] rounded-full border-2 border-paper/15 border-t-lime transition-opacity duration-300 motion-safe:animate-spin ${loading ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
