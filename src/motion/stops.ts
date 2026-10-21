import { services } from '@/content/home'

// A "stop" is one place the page snaps to: the hero, each service panel, then contact.
export type Stop = { slide: number, service: number, id: string }

export const stops: Stop[] = [
  { slide: 0, service: 0, id: 'hero' },
  ...services.items.map((item, i) => ({ slide: 1, service: i, id: item.id })),
  { slide: 2, service: 0, id: 'contact' },
]

export const slideCount = 3
export const lastStop = stops.length - 1

// Index of the stop for an in-page link target ("#services" means its first panel).
export function stopForHash(hash: string): number | undefined {
  const id = hash.replace(/^#/, '')
  const target = id === 'services' ? services.items[0]?.id : id
  const index = stops.findIndex(s => s.id === target)
  return index === -1 ? undefined : index
}

export function stopForSlide(slide: number): number {
  return Math.max(0, stops.findIndex(s => s.slide === slide))
}

// The stop whose scroll position is closest to `scroll`.
export function nearestStop(scroll: number, positions: number[]): number {
  let best = 0
  positions.forEach((p, i) => {
    if (Math.abs(p - scroll) < Math.abs((positions[best] ?? 0) - scroll)) best = i
  })
  return best
}
