import { describe, expect, it } from 'vitest'
import { morphProgress } from './morph'

describe('morphProgress', () => {
  const viewportHeight = 800
  const at = (servicesTop: number, panel: number, contactTop: number) =>
    morphProgress({ servicesTop, panel, contactTop, viewportHeight })

  it('is 0 on the hero', () => {
    expect(at(800, 0, 1600)).toBe(0)
  })

  it('is halfway to the first panel when services is half in', () => {
    expect(at(400, 0, 1200)).toBe(0.5)
  })

  it('counts panels while services is pinned', () => {
    expect(at(0, 0, 2400)).toBe(1)
    expect(at(0, 1.5, 2400)).toBe(2.5)
    expect(at(0, 3, 2400)).toBe(4)
  })

  it('reaches 5 when contact is at the top', () => {
    expect(at(-800, 3, 0)).toBe(5)
  })

  it('ignores panel overscroll', () => {
    expect(at(0, 3.4, 2400)).toBe(4)
    expect(at(0, -0.2, 2400)).toBe(1)
  })
})
