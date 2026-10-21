'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppDispatch } from '@/store/hooks'
import type { AppDispatch } from '@/store/store'
import { movingChanged, positionChanged, progressChanged } from '@/store/uiSlice'
import { controller, sceneMotion } from './controller'
import { lastStop, nextStop, stopForHash, stopForSlide, stops } from './stops'

gsap.registerPlugin(useGSAP)

// Phones: three slides, with the services as tabs inside the middle one.
const COMPACT = '(max-width: 767px)'
// A wheel gesture ends after a pause in its events. Until then, the rest of it (a trackpad's
// long momentum tail included) can't move the deck again. A short pause only counts if the
// next event is stronger than the last: momentum only ever fades, and a busy page can delay its events.
const GESTURE_GAP = 160
const GESTURE_END = 400
// How far a wheel gesture or a swipe has to travel before it counts.
const WHEEL_THRESHOLD = 24
const SWIPE_THRESHOLD = 50

// The page doesn't scroll. The three slides sit on top of each other and the engine
// plays a transition between any two stops, so a jump from the hero to contact never
// passes through the services. While a transition plays, input is locked.
export function DeckEngine() {
  const dispatch = useAppDispatch()
  useGSAP(() => setupDeck(dispatch))
  return null
}

function setupDeck(dispatch: AppDispatch) {
  const root = document.documentElement
  const slides = ['hero', 'services', 'contact'].map(id => document.getElementById(id))
  const track = document.querySelector<HTMLElement>('#services [data-track]')
  if (!track || slides.some(s => !s)) return
  const slideEls = slides as HTMLElement[]
  const panels = Array.from(track.children) as HTMLElement[]
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const compact = window.matchMedia(COMPACT)

  root.dataset.deck = ''

  let current = 0
  let lastService = 0
  let moving = false
  let timeline: gsap.core.Timeline | undefined

  // The element that holds a stop's content: a service panel, or the whole slide.
  const holder = (stop: number) => {
    const { slide, service } = stops[stop] ?? stops[0]!
    return slide === 1 ? panels[service] : slideEls[slide]
  }

  function publish(stop: number) {
    const { slide, service } = stops[stop] ?? stops[0]!
    current = stop
    if (slide === 1) lastService = service
    controller.setCurrent(stop)
    dispatch(positionChanged({ slide, service }))
    dispatch(progressChanged(stop / lastStop))
  }

  // Only the active slide and panel can be reached by keyboard and screen readers.
  function setInert(stop: number) {
    const { slide, service } = stops[stop] ?? stops[0]!
    slideEls.forEach((el, i) => (el.inert = i !== slide))
    panels.forEach((el, i) => (el.inert = i !== service))
  }

  // Jump with no animation (first load, or a link to #contact from another page).
  function show(stop: number) {
    const { slide, service } = stops[stop] ?? stops[0]!
    slideEls.forEach((el, i) => gsap.set(el, { autoAlpha: i === slide ? 1 : 0, y: 0 }))
    gsap.set(track, { xPercent: -100 * service })
    setInert(stop)
    Object.assign(sceneMotion, { from: stop, to: stop, mix: 1 })
    publish(stop)
  }

  function goTo(target: number, { focus = false } = {}) {
    if (moving || target === current) return
    const from = current
    const a = stops[from]!
    const b = stops[target]!
    const into = holder(target)

    moving = true
    dispatch(movingChanged(true))
    publish(target)
    setInert(target)

    const tl = gsap.timeline({
      onComplete: () => {
        moving = false
        timeline = undefined
        dispatch(movingChanged(false))
        // Keyboard and link users land on the new slide, so Tab carries on from there.
        if (focus) into?.focus({ preventScroll: true })
      },
    })
    timeline = tl

    // The particles morph straight from this stop's shape to the target's.
    Object.assign(sceneMotion, { from, to: target, mix: 0 })
    tl.to(sceneMotion, { mix: 1, duration: reduced ? 0.3 : 1.3, ease: 'none' }, 0)

    if (a.slide === b.slide) {
      // Between service panels: the strip slides sideways.
      tl.to(track, { xPercent: -100 * b.service, duration: reduced ? 0.01 : 0.9, ease: 'power3.inOut' }, 0)
      reveal(tl, into, 0.35)
    }
    else {
      // Between slides: the old one lifts away, the new one rises in, in the direction of travel.
      const direction = target > from ? 1 : -1
      const outgoing = slideEls[a.slide]!
      const incoming = slideEls[b.slide]!
      if (b.slide === 1) tl.set(track, { xPercent: -100 * b.service }, 0)
      tl.to(outgoing, { autoAlpha: 0, y: reduced ? 0 : -60 * direction, duration: reduced ? 0.2 : 0.45, ease: 'power2.in' }, 0)
      tl.set(outgoing, { y: 0 })
      if (incoming.scrollTop) tl.set(incoming, { scrollTop: 0 }, 0)
      tl.fromTo(incoming, { autoAlpha: 0, y: reduced ? 0 : 60 * direction }, { autoAlpha: 1, y: 0, duration: reduced ? 0.2 : 0.8, ease: 'power3.out' }, reduced ? 0.2 : 0.4)
      reveal(tl, into, 0.4)
    }
  }

  // Headline lines slide up out of their masks, then everything marked data-reveal="item" rises in.
  function reveal(tl: gsap.core.Timeline, el: HTMLElement | undefined, at: number) {
    if (!el || reduced) return
    const lines = el.querySelectorAll('[data-reveal="line"]')
    const items = el.querySelectorAll('[data-reveal="item"]')
    if (lines.length) tl.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.08 }, at)
    if (items.length) tl.fromTo(items, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, at + 0.15)
  }

  function step(direction: 1 | -1, options?: { focus?: boolean }) {
    goTo(nextStop(current, direction, compact.matches, lastService), options)
  }

  // Next or previous service panel, staying inside the services slide.
  function stepService(direction: 1 | -1) {
    const { slide, service } = stops[current]!
    if (slide !== 1) return
    const next = Math.min(panels.length - 1, Math.max(0, service + direction))
    goTo(stopForSlide(1, next))
  }

  // A slide taller than the screen (the contact form on a phone) scrolls inside itself
  // first. True if `target`, or something around it on the active slide, can still scroll that way.
  function canScroll(target: EventTarget | null, direction: 1 | -1): boolean {
    const stopAt = slideEls[stops[current]!.slide]
    let el = target instanceof Element ? target : null
    while (el && el !== document.body) {
      if (el instanceof HTMLElement && el.scrollHeight - el.clientHeight > 2) {
        const { overflowY } = getComputedStyle(el)
        if (overflowY === 'auto' || overflowY === 'scroll') {
          const room = direction > 0 ? el.scrollHeight - el.clientHeight - el.scrollTop : el.scrollTop
          if (room > 2) return true
        }
      }
      if (el === stopAt) break
      el = el.parentElement
    }
    return false
  }

  // Wheel and trackpad: one move per gesture.
  let lastWheel = 0
  let lastStrength = 0
  let gestureUsed = false
  let travel = 0
  function onWheel(e: WheelEvent) {
    if (e.ctrlKey) return // pinch zoom
    const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY)
    const delta = sideways ? e.deltaX : e.deltaY
    const strength = Math.abs(delta)
    const gap = e.timeStamp - lastWheel
    if (gap > GESTURE_END || (gap > GESTURE_GAP && strength > lastStrength * 1.2)) {
      gestureUsed = false
      travel = 0
    }
    lastWheel = e.timeStamp
    lastStrength = strength
    if (moving || gestureUsed) return

    const direction = delta > 0 ? 1 : -1
    if (!sideways && canScroll(e.target, direction)) {
      // This gesture scrolls the slide's own content; reaching its end doesn't also change slide.
      gestureUsed = true
      return
    }
    travel += delta
    if (Math.abs(travel) < WHEEL_THRESHOLD) return
    gestureUsed = true
    if (sideways) stepService(direction)
    else step(direction)
  }

  // Touch: a swipe up or down changes slide, left or right changes service.
  let touch: { x: number, y: number, up: boolean, down: boolean } | null = null
  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0]
    if (!t || e.touches.length > 1) {
      touch = null
      return
    }
    touch = { x: t.clientX, y: t.clientY, up: canScroll(e.target, -1), down: canScroll(e.target, 1) }
  }
  function onTouchEnd(e: TouchEvent) {
    const t = e.changedTouches[0]
    if (!touch || !t || moving) return
    const dx = touch.x - t.clientX
    const dy = touch.y - t.clientY
    const start = touch
    touch = null
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > SWIPE_THRESHOLD) stepService(dx > 0 ? 1 : -1)
      return
    }
    if (Math.abs(dy) < SWIPE_THRESHOLD) return
    const direction = dy > 0 ? 1 : -1
    // The swipe was scrolling the slide's own content.
    if (direction > 0 ? start.down : start.up) return
    step(direction)
  }

  function onKey(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey) return
    const target = e.target as HTMLElement
    if (target.closest('input, textarea, select, [contenteditable]')) return
    if (e.key === ' ' && target.closest('a, button')) return

    const inServices = stops[current]?.slide === 1
    if (inServices && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault()
      return stepService(e.key === 'ArrowRight' ? 1 : -1)
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      return goTo(e.key === 'Home' ? 0 : lastStop, { focus: true })
    }

    const down = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)
    const up = e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)
    if (!down && !up) return
    e.preventDefault()
    const direction = down ? 1 : -1

    // A tall slide scrolls through its own content before the deck moves on.
    const scroller = holder(current)
    if (scroller && canScroll(scroller, direction)) {
      scroller.scrollBy({ top: direction * scroller.clientHeight * 0.8, behavior: reduced ? 'auto' : 'smooth' })
      return
    }
    step(direction, { focus: true })
  }

  // In-page links (#contact, #services-cms...) jump straight to their stop.
  function onClick(e: MouseEvent) {
    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
    const stop = link && stopForHash(link.hash)
    if (stop === undefined || stop === null || e.metaKey || e.ctrlKey) return
    e.preventDefault()
    goTo(stop, { focus: e.detail === 0 })
  }

  show(stopForHash(window.location.hash) ?? 0)

  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('keydown', onKey)
  document.addEventListener('click', onClick)
  const unregister = controller.register(stop => goTo(stop), direction => step(direction))

  return () => {
    unregister()
    timeline?.kill()
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('keydown', onKey)
    document.removeEventListener('click', onClick)
    slideEls.forEach(el => (el.inert = false))
    panels.forEach(el => (el.inert = false))
    gsap.set([...slideEls, track], { clearProps: 'all' })
    delete root.dataset.deck
  }
}
