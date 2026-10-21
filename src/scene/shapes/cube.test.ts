import { describe, expect, it } from 'vitest'
import { LIME, PAPER } from '../colors'
import { cubeShape } from './cube'

// Small deterministic random so every run builds the same cube.
function seeded(seed = 1) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

describe('cubeShape', () => {
  const count = 2000
  const { positions, tones } = cubeShape(count, seeded())

  it('returns xyz and a tone for every particle', () => {
    expect(positions).toHaveLength(count * 3)
    expect(tones).toHaveLength(count)
  })

  it('keeps every particle on the cube surface', () => {
    for (let i = 0; i < count; i++) {
      const p = [positions[i * 3]!, positions[i * 3 + 1]!, positions[i * 3 + 2]!]
      const maxAxis = Math.max(...p.map(Math.abs))
      expect(maxAxis).toBeCloseTo(1.25, 5)
    }
  })

  it('colours the top face lime and most of the rest paper', () => {
    const lime = tones.filter(t => t === LIME).length
    const paper = tones.filter(t => t === PAPER).length
    expect(lime).toBeGreaterThan(count * 0.05)
    expect(paper).toBeGreaterThan(count * 0.6)
  })
})
