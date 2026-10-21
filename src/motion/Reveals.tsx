'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectService, selectSlide } from '@/store/uiSlice'
import { stops } from './stops'

// Plays the text reveal for each stop as you arrive on it: headline lines slide up
// out of their masks, then everything marked data-reveal="item" rises and fades in.
// The first stop is skipped on load, so the hero (the page's largest paint) shows at once.
export function Reveals() {
  const slide = useAppSelector(selectSlide)
  const service = useAppSelector(selectService)
  const id = stops.find(s => s.slide === slide && (slide !== 1 || s.service === service))?.id
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const root = id ? document.getElementById(id) : null
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('[data-reveal="line"]', { yPercent: 105, duration: 0.9, ease: 'power4.out', stagger: 0.08 })
        .from('[data-reveal="item"]', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, 0.15)
    }, root)

    // Moving on before it finishes snaps this stop's text back to fully visible.
    return () => ctx.revert()
  }, [id])

  return null
}
