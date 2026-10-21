import { describe, expect, it } from 'vitest'
import { LIME, PAPER } from '../colors'
import { box, build } from './solid'

const fixed = () => 0.5

describe('build', () => {
  it('shares particles by size: a box gets most of them on its edges', () => {
    const count = 4000
    const { positions } = build(box([0, 0, 0], [2, 2, 2]), count, fixed)
    let onEdge = 0
    for (let i = 0; i < count; i++) {
      const p = [positions[i * 3]!, positions[i * 3 + 1]!, positions[i * 3 + 2]!].map(Math.abs)
      if (p.filter(v => Math.abs(v - 1) < 1e-6).length >= 2) onEdge++
    }
    expect(onEdge / count).toBeGreaterThan(0.4)
  })

  it('gives the top of a box its own tone', () => {
    const { positions, tones } = build(box([0, 0, 0], [2, 2, 2], { top: LIME }), 2000, fixed)
    for (let i = 0; i < 2000; i++) {
      if (tones[i] === LIME) expect(positions[i * 3 + 1]).toBeCloseTo(1, 5)
    }
    expect(tones.includes(PAPER)).toBe(true)
  })
})
