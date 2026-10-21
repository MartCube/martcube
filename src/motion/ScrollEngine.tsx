'use client'

import 'lenis/dist/lenis.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { positionChanged, progressChanged } from '@/store/uiSlice'
import { controller } from './controller'
import { nearestStop, stopForHash, stops } from './stops'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Desktop with a mouse and motion allowed: smooth scroll, pinned services strip, one stop per wheel gesture.
// Everything else (touch, small screens, reduced motion): native scroll with CSS snapping and a swipeable strip.
const SMOOTH = '(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const NATIVE = `not all and ${SMOOTH}`

type Report = (stop: number, progress: number) => void

export function ScrollEngine() {
  const dispatch = useAppDispatch()
  const last = useRef({ stop: -1, progress: -1 })

  useGSAP(() => {
    const report: Report = (stop, progress) => {
      if (stop !== last.current.stop) {
        last.current.stop = stop
        controller.setCurrent(stop)
        const { slide, service } = stops[stop] ?? stops[0]!
        dispatch(positionChanged({ slide, service }))
      }
      const rounded = Math.round(progress * 1000) / 1000
      if (rounded !== last.current.progress) {
        last.current.progress = rounded
        dispatch(progressChanged(rounded))
      }
    }

    const mm = gsap.matchMedia()
    mm.add(SMOOTH, () => setupSmooth(report))
    mm.add(NATIVE, () => setupNative(report))
  })

  // In-page links and arrow keys go through the controller, whichever mode is active.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const stop = link && stopForHash(link.hash)
      if (stop === undefined || stop === null || e.metaKey || e.ctrlKey) return
      e.preventDefault()
      controller.goTo(stop)
    }

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable]')) return
      const inServices = stops[controller.current]?.slide === 1
      const down = e.key === 'ArrowDown' || e.key === 'PageDown' || (inServices && e.key === 'ArrowRight')
      const up = e.key === 'ArrowUp' || e.key === 'PageUp' || (inServices && e.key === 'ArrowLeft')
      if (!down && !up) return
      e.preventDefault()
      controller.step(down ? 1 : -1)
    }

    document.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return null
}

function setupSmooth(report: Report) {
  const root = document.documentElement
  const section = document.getElementById('services')
  const track = section?.querySelector<HTMLElement>('[data-track]')
  const contact = document.getElementById('contact')
  if (!section || !track || !contact) return

  root.dataset.scroll = 'smooth'

  let positions: number[] = []
  let target = 0
  let animating = false
  let gestureUsed = false
  let lastWheel = 0
  let settleTimer: ReturnType<typeof setTimeout> | undefined

  function goTo(stop: number) {
    target = Math.min(positions.length - 1, Math.max(0, stop))
    animating = true
    lenis.scrollTo(positions[target] ?? 0, {
      duration: 1.1,
      lock: true,
      force: true,
      onComplete: () => {
        animating = false
      },
    })
  }

  // One step per wheel gesture. A gesture ends after a short pause, so a trackpad's
  // long inertia tail can't skip several slides at once.
  const lenis = new Lenis({
    autoRaf: false,
    virtualScroll: ({ deltaY, event }) => {
      if (event.type.startsWith('touch')) return true
      const now = performance.now()
      if (now - lastWheel > 180) gestureUsed = false
      lastWheel = now
      if (!animating && !gestureUsed && Math.abs(deltaY) > 2) {
        gestureUsed = true
        goTo(target + Math.sign(deltaY))
      }
      return false
    },
  })

  // Anything else that moves the page (scrollbar drag, space bar, find in page) settles on the nearest stop.
  lenis.on('scroll', () => {
    clearTimeout(settleTimer)
    settleTimer = setTimeout(() => {
      if (animating) return
      const nearest = nearestStop(lenis.scroll, positions)
      if (Math.abs(lenis.scroll - (positions[nearest] ?? 0)) > 2) goTo(nearest)
      else target = nearest
    }, 200)
  })

  const tick = (time: number) => lenis.raf(time * 1000)
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // Pin the services section and slide the track sideways while the page scrolls down.
  const distance = () => track.scrollWidth - window.innerWidth
  const strip = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => `+=${distance()}`,
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  function measure() {
    const st = strip.scrollTrigger
    if (!st) return
    const panels = stops.filter(s => s.slide === 1).length
    positions = [
      0,
      ...Array.from({ length: panels }, (_, i) => st.start + ((st.end - st.start) * i) / (panels - 1)),
      contact!.getBoundingClientRect().top + window.scrollY,
    ]
  }

  ScrollTrigger.addEventListener('refresh', measure)
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: self => report(nearestStop(self.scroll(), positions), self.progress),
  })
  ScrollTrigger.refresh()
  target = nearestStop(window.scrollY, positions)

  const unregister = controller.register(goTo)

  return () => {
    unregister()
    clearTimeout(settleTimer)
    ScrollTrigger.removeEventListener('refresh', measure)
    gsap.ticker.remove(tick)
    lenis.destroy()
    delete root.dataset.scroll
  }
}

function setupNative(report: Report) {
  const root = document.documentElement
  const track = document.querySelector<HTMLElement>('#services [data-track]')
  const slides = ['hero', 'services', 'contact'].map(id => document.getElementById(id))
  if (!track || slides.some(s => !s)) return

  root.dataset.scroll = 'native'
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth'

  function update() {
    const y = window.scrollY
    const max = root.scrollHeight - window.innerHeight
    const slide = nearestStop(y, slides.map(s => s!.offsetTop))
    const service = Math.round(track!.scrollLeft / Math.max(1, track!.clientWidth))
    const stop = stops.findIndex(s => s.slide === slide && (slide !== 1 || s.service === service))
    report(Math.max(0, stop), max > 0 ? y / max : 0)
  }

  window.addEventListener('scroll', update, { passive: true })
  track.addEventListener('scroll', update, { passive: true })
  update()

  const unregister = controller.register((stop) => {
    const { slide, service } = stops[stop] ?? stops[0]!
    slides[slide]?.scrollIntoView({ behavior })
    if (slide === 1) track.scrollTo({ left: service * track.clientWidth, behavior })
  })

  return () => {
    unregister()
    window.removeEventListener('scroll', update)
    track.removeEventListener('scroll', update)
    delete root.dataset.scroll
  }
}
