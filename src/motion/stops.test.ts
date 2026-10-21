import { describe, expect, it } from 'vitest'
import { lastStop, nearestStop, stopForHash, stopForSlide, stops } from './stops'

describe('stops', () => {
  it('has the hero, four service panels and contact', () => {
    expect(stops.map(s => s.slide)).toEqual([0, 1, 1, 1, 1, 2])
    expect(lastStop).toBe(5)
  })

  it('maps in-page links to stops', () => {
    expect(stopForHash('#hero')).toBe(0)
    expect(stopForHash('#services')).toBe(1)
    expect(stopForHash('#services-editable')).toBe(3)
    expect(stopForHash('#contact')).toBe(5)
    expect(stopForHash('#nope')).toBeUndefined()
  })

  it('maps a slide to its first stop', () => {
    expect(stopForSlide(0)).toBe(0)
    expect(stopForSlide(1)).toBe(1)
    expect(stopForSlide(2)).toBe(5)
  })

  it('finds the nearest stop to a scroll position', () => {
    const positions = [0, 900, 1800, 2700, 3600, 4500]
    expect(nearestStop(0, positions)).toBe(0)
    expect(nearestStop(1300, positions)).toBe(1)
    expect(nearestStop(1400, positions)).toBe(2)
    expect(nearestStop(9999, positions)).toBe(5)
  })
})
