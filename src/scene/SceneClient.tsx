'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Poster } from './Poster'
import { canRunParticles } from './support'

// three.js and the particle code load in their own chunk, only when started.
const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })

type Mode = 'waiting' | 'poster' | 'particles'

// Phones and tablets: the WebGL start-up is the heaviest thing on the page, so they
// show the static poster first and switch to particles on the first touch or scroll.
const TOUCH = '(pointer: coarse), (max-width: 767px)'
const FIRST_INPUT = ['pointerdown', 'touchstart', 'scroll', 'keydown', 'wheel'] as const

// Only cheap checks here. Probing WebGL creates a GPU context, which is slow on
// weak devices, so it waits until the particles are about to start.
function initialPlan() {
  return window.matchMedia(TOUCH).matches
    ? { mode: 'poster', start: 'on-input' } as const
    : { mode: 'waiting', start: 'when-idle' } as const
}

export default function SceneClient() {
  const [plan] = useState(initialPlan)
  const [mode, setMode] = useState<Mode>(plan.mode)

  useEffect(() => {
    const start = () => setMode(canRunParticles() ? 'particles' : 'poster')

    if (plan.start === 'on-input') {
      const once = () => {
        FIRST_INPUT.forEach(type => window.removeEventListener(type, once))
        start()
      }
      FIRST_INPUT.forEach(type => window.addEventListener(type, once, { passive: true }))
      return () => FIRST_INPUT.forEach(type => window.removeEventListener(type, once))
    }

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(start, 300)
    return () => clearTimeout(id)
  }, [plan])

  return (
    <>
      {mode === 'particles' && <ParticleField onLost={() => setMode('poster')} />}
      {/* While the particles gather, the poster fades out underneath them. */}
      {mode !== 'waiting' && <Poster fading={mode === 'particles'} />}
    </>
  )
}
