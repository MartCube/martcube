'use client'

import { Spinner } from '@/components/ui/Spinner'
import { useAppSelector } from '@/store/hooks'
import { selectSceneLoading, selectSending } from '@/store/uiSlice'

// Small spinner beside the logo. It runs while the particle scene downloads and starts
// (on phones that's after the first touch, and can take a couple of seconds), and while the contact form sends.
// It used to run during slide transitions too: swap in selectMoving to bring that back.
export function DeckLoader() {
  const sceneLoading = useAppSelector(selectSceneLoading)
  const sending = useAppSelector(selectSending)
  const loading = sceneLoading || sending

  return <Spinner className={`size-[18px] translate-y-[2px] transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0'}`} />
}
