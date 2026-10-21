import { LIME, PAPER, VIOLET } from '../colors'
import type { Shape } from './types'

const RADIUS = 2.3
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

// An evenly spread sphere (Fibonacci lattice) that sits behind the contact form,
// with a lime band around the equator.
export function sphereShape(count: number, random: () => number = Math.random): Shape {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count
    const ring = Math.sqrt(1 - y * y)
    const angle = i * GOLDEN_ANGLE
    positions.set([Math.cos(angle) * ring * RADIUS, y * RADIUS, Math.sin(angle) * ring * RADIUS], i * 3)
    colors.set(random() < 0.03 ? VIOLET : Math.abs(y) < 0.08 ? LIME : PAPER, i * 3)
  }

  return { positions, colors }
}
