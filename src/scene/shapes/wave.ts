import { LIME, PAPER } from '../colors'
import { tone, type Random, type Shape } from './types'

const HALF_WIDTH = 9
const HALF_DEPTH = 4

// A flat grid of points for the services slide. It lies in x/z with y = 0;
// the vertex shader lifts it into rolling waves over time.
export function waveShape(count: number, random: Random = Math.random): Shape {
  const positions = new Float32Array(count * 3)
  const tones = new Float32Array(count)
  const columns = Math.ceil(Math.sqrt(count * (HALF_WIDTH / HALF_DEPTH)))
  const rows = Math.ceil(count / columns)

  for (let i = 0; i < count; i++) {
    const x = ((i % columns) / (columns - 1)) * 2 - 1
    const z = (Math.floor(i / columns) / Math.max(1, rows - 1)) * 2 - 1
    positions.set([x * HALF_WIDTH, 0, z * HALF_DEPTH], i * 3)
    tones[i] = tone(random, random() < 0.12 ? LIME : PAPER)
  }

  return { positions, tones }
}
