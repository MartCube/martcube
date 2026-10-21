import { services } from '@/content/home'

// A "stop" is one place the deck can rest on: the hero, each service panel, then contact.
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

export function stopForSlide(slide: number, service = 0): number {
  return Math.max(0, stops.findIndex(s => s.slide === slide && (slide !== 1 || s.service === service)))
}

// The stop one step up or down from `current`. Wide screens step through every service panel.
// Phones have three slides: the services are tabs, so a step skips past them,
// landing on the service that was last open.
export function nextStop(current: number, direction: 1 | -1, compact: boolean, lastService = 0): number {
  const here = stops[current] ?? stops[0]!
  if (!compact) return Math.min(lastStop, Math.max(0, current + direction))
  const slide = Math.min(slideCount - 1, Math.max(0, here.slide + direction))
  if (slide === here.slide) return current
  return stopForSlide(slide, lastService)
}
