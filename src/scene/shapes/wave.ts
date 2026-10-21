import { LIME, PAPER, VIOLET } from '../colors'
import type { Shape } from './types'

const HALF_WIDTH = 9
const HALF_DEPTH = 4

// A flat grid of points for the services slide. It lies in x/z with y = 0;
// the vertex shader lifts it into rolling waves over time.
export function waveShape(count: number, random: () => number = Math.random): Shape {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const columns = Math.ceil(Math.sqrt(count * (HALF_WIDTH / HALF_DEPTH)))
  const rows = Math.ceil(count / columns)

  for (let i = 0; i < count; i++) {
    const x = ((i % columns) / (columns - 1)) * 2 - 1
    const z = (Math.floor(i / columns) / Math.max(1, rows - 1)) * 2 - 1
    positions.set([x * HALF_WIDTH, 0, z * HALF_DEPTH], i * 3)
    const r = random()
    colors.set(r < 0.03 ? VIOLET : r < 0.15 ? LIME : PAPER, i * 3)
  }

  return { positions, colors }
}
