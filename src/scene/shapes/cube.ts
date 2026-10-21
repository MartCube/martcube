import { LIME, PAPER } from '../colors'
import { tone, type Random, type Shape } from './types'

const EDGE_SHARE = 0.45
const HALF = 1.25

// The 12 edges of a cube from -1 to 1, as [from, to] corner pairs.
const edges: [number[], number[]][] = []
for (const a of [-1, 1]) {
  for (const b of [-1, 1]) {
    edges.push([[-1, a, b], [1, a, b]], [[a, -1, b], [a, 1, b]], [[a, b, -1], [a, b, 1]])
  }
}

// The MartCube cube: dense edges, sparse faces, lime top face, paper sides, a few violet strays.
// `random` is injectable so tests get the same cube every time.
export function cubeShape(count: number, random: Random = Math.random): Shape {
  const positions = new Float32Array(count * 3)
  const tones = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number
    if (i < count * EDGE_SHARE) {
      const [from, to] = edges[i % edges.length]!
      const t = random()
      x = from[0]! + (to[0]! - from[0]!) * t
      y = from[1]! + (to[1]! - from[1]!) * t
      z = from[2]! + (to[2]! - from[2]!) * t
    }
    else {
      const face = i % 6
      const u = random() * 2 - 1
      const v = random() * 2 - 1
      const side = face % 2 ? 1 : -1
      if (face < 2) [x, y, z] = [side, u, v]
      else if (face < 4) [x, y, z] = [u, side, v]
      else [x, y, z] = [u, v, side]
    }

    positions.set([x * HALF, y * HALF, z * HALF], i * 3)
    tones[i] = tone(random, y > 0.99 ? LIME : PAPER)
  }

  return { positions, tones }
}
