import { describe, expect, it } from 'vitest'
import { LIME, PAPER } from '../colors'
import { fill, line, sketch } from './sketch'

describe('sketch', () => {
  it('shares particles between marks by their size', () => {
    // A line of length 3 and one of length 1: three quarters go to the first.
    const { positions } = sketch([line(0, 0, 3, 0), line(0, 1, 1, 1)], 400, () => 0.5)
    let first = 0
    for (let i = 0; i < 400; i++) if (positions[i * 3 + 1] === 0) first++
    expect(first).toBe(300)
  })

  it('keeps each mark’s tone', () => {
    const { tones } = sketch([fill(0, 0, 1, 1, 0, LIME), line(0, 0, 0.6, 0)], 100, () => 0.5)
    expect(tones[0]).toBe(LIME)
    expect(tones[99]).toBe(PAPER)
  })
})
