'use client'

import dynamic from 'next/dynamic'

// three.js and the particle code load after the page, in their own chunk, browser only.
// The text and form never wait for WebGL.
const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })

export function Scene() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <ParticleField />
    </div>
  )
}
