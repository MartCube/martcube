'use client'

import dynamic from 'next/dynamic'

// Browser only: whether to show particles or the poster depends on the device,
// so nothing is rendered on the server. The text and form never wait for it.
const SceneClient = dynamic(() => import('./SceneClient'), { ssr: false })

export function Scene() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <SceneClient />
    </div>
  )
}
