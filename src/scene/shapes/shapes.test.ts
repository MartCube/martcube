import { describe, expect, it } from 'vitest'
import { LIME } from '../colors'
import { sphereShape } from './sphere'
import { waveShape } from './wave'

const count = 3000
const fixed = () => 0.5

describe('waveShape', () => {
  const { positions } = waveShape(count, fixed)

  it('is a flat grid inside its bounds', () => {
    expect(positions).toHaveLength(count * 3)
    for (let i = 0; i < count; i++) {
      expect(positions[i * 3 + 1]).toBe(0)
      expect(Math.abs(positions[i * 3]!)).toBeLessThanOrEqual(9)
      expect(Math.abs(positions[i * 3 + 2]!)).toBeLessThanOrEqual(4)
    }
  })
})

describe('sphereShape', () => {
  const { positions, colors } = sphereShape(count, fixed)

  it('puts every point on the surface', () => {
    for (let i = 0; i < count; i++) {
      const [x, y, z] = [positions[i * 3]!, positions[i * 3 + 1]!, positions[i * 3 + 2]!]
      expect(Math.hypot(x, y, z)).toBeCloseTo(2.3, 4)
    }
  })

  it('has a lime band around the equator', () => {
    let lime = 0
    for (let i = 0; i < count; i++) if (colors[i * 3] === Math.fround(LIME[0])) lime++
    expect(lime / count).toBeGreaterThan(0.05)
    expect(lime / count).toBeLessThan(0.12)
  })
})
