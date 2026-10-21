'use client'

import { useAppSelector } from '@/store/hooks'
import { selectSlide } from '@/store/uiSlice'

// The hero cube as a static dotted drawing, in the same spot as the particle cube.
// Shown before the particles start on touch devices, and instead of them without WebGL.
const top = 'M100 20 L180 60 L100 100 L20 60 Z'
const sides = 'M20 60 L20 150 L100 190 L180 150 L180 60 M100 100 L100 190'

export function Poster({ fading = false }: { fading?: boolean }) {
  const onHero = useAppSelector(selectSlide) === 0
  const visible = onHero && !fading

  return (
    <svg
      viewBox="0 0 200 210"
      className={`absolute top-[8%] right-[4%] w-[46vw] max-w-[220px] transition-opacity duration-1000 md:top-1/2 md:right-[10%] md:w-[30vw] md:max-w-[440px] md:-translate-y-1/2 ${visible ? 'opacity-55 md:opacity-100' : 'opacity-0'}`}
      fill="none"
      strokeLinecap="round"
      strokeWidth="2.4"
      strokeDasharray="0 6"
    >
      <path d={sides} stroke="#ecebe4" />
      <path d={top} stroke="#c8f542" />
    </svg>
  )
}
