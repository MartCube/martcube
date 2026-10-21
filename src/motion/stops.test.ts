import { describe, expect, it } from 'vitest'
import { lastStop, nextStop, stopForHash, stopForSlide, stops } from './stops'

describe('stops', () => {
  it('has the hero, four service panels and contact', () => {
    expect(stops.map(s => s.slide)).toEqual([0, 1, 1, 1, 1, 2])
    expect(lastStop).toBe(5)
  })

  it('maps in-page links to stops', () => {
    expect(stopForHash('#hero')).toBe(0)
    expect(stopForHash('#services')).toBe(1)
    expect(stopForHash('#services-cms')).toBe(3)
    expect(stopForHash('#contact')).toBe(5)
    expect(stopForHash('#nope')).toBeUndefined()
  })

  it('maps a slide (and service) to its stop', () => {
    expect(stopForSlide(0)).toBe(0)
    expect(stopForSlide(1)).toBe(1)
    expect(stopForSlide(1, 2)).toBe(3)
    expect(stopForSlide(2)).toBe(5)
  })

  it('steps through every panel on wide screens', () => {
    expect(nextStop(0, 1, false)).toBe(1)
    expect(nextStop(3, 1, false)).toBe(4)
    expect(nextStop(5, 1, false)).toBe(5)
    expect(nextStop(0, -1, false)).toBe(0)
  })

  it('steps slide by slide on phones, keeping the open service tab', () => {
    expect(nextStop(0, 1, true)).toBe(1)
    expect(nextStop(0, 1, true, 2)).toBe(3)
    expect(nextStop(3, 1, true, 2)).toBe(5)
    expect(nextStop(5, -1, true, 3)).toBe(4)
    expect(nextStop(5, 1, true)).toBe(5)
  })
})
