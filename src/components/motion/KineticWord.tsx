'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectSlide } from '@/store/uiSlice'

const HOLD = 2800

// A word that swaps itself letter by letter: "move." → "sell." → "think.".
// Screen readers get the first word as plain text; the animated letters are hidden from them.
export function KineticWord({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0)
  const letters = useRef<HTMLSpanElement>(null)
  const onHero = useAppSelector(selectSlide) === 0
  const word = words[index % words.length] ?? ''

  // New letters rise into place. Skipped for the very first word, so the server-rendered headline never moves.
  useGSAP(() => {
    if (index === 0 || !letters.current) return
    gsap.from(letters.current.children, { yPercent: 110, duration: 0.6, ease: 'power3.out', stagger: 0.03 })
  }, { dependencies: [index] })

  // Cycle only while the hero is on screen, the tab is visible and motion is allowed.
  useEffect(() => {
    if (!onHero || words.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let leaving: gsap.core.Tween | undefined
    const timer = setInterval(() => {
      if (document.hidden || !letters.current) return
      leaving = gsap.to(letters.current.children, {
        yPercent: -110,
        duration: 0.35,
        ease: 'power2.in',
        stagger: 0.02,
        onComplete: () => setIndex(i => i + 1),
      })
    }, HOLD)

    return () => {
      clearInterval(timer)
      // Leaving the hero mid-swap: put the letters back rather than freeze them half gone.
      if (leaving?.isActive()) gsap.set(leaving.targets(), { yPercent: 0 })
      leaving?.kill()
    }
  }, [onHero, words.length])

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true" className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span ref={letters} key={index} data-testid="kinetic-word" className="inline-block whitespace-nowrap">
          {[...word].map((char, i) => (
            <span key={i} className="inline-block">{char}</span>
          ))}
        </span>
      </span>
    </>
  )
}
