import { PAPER, type Tone } from '../colors'
import { tone, type Random, type Shape } from './types'

// A small kit for building shapes the way the hero cube is built: dense edges
// and sparse faces, in 3D. Particles are shared out by each mark's size.
type Vec = [number, number, number]

export type Mark
  = | { kind: 'edge', from: Vec, to: Vec, tone: Tone }
    | { kind: 'face', origin: Vec, u: Vec, v: Vec, tone: Tone }
    | { kind: 'arc', center: Vec, radius: number, start: number, end: number, tone: Tone }

// Faces get fewer particles per unit of area than edges get per unit of length,
// so outlines stay crisp and faces read as a light fill.
const FACE_DENSITY = 0.55

const length = ([x, y, z]: Vec) => Math.hypot(x, y, z)
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

function weight(mark: Mark): number {
  switch (mark.kind) {
    case 'edge': return length(sub(mark.to, mark.from))
    case 'face': return length(mark.u) * length(mark.v) * FACE_DENSITY
    case 'arc': return Math.abs(mark.end - mark.start) * mark.radius
  }
}

function point(mark: Mark, random: Random): Vec {
  const t = random()
  switch (mark.kind) {
    case 'edge': {
      const d = sub(mark.to, mark.from)
      return [mark.from[0] + d[0] * t, mark.from[1] + d[1] * t, mark.from[2] + d[2] * t]
    }
    case 'face': {
      const s = random()
      const { origin: o, u, v } = mark
      return [o[0] + u[0] * t + v[0] * s, o[1] + u[1] * t + v[1] * s, o[2] + u[2] * t + v[2] * s]
    }
    case 'arc': {
      // Arcs stand upright in the x/y plane.
      const a = mark.start + (mark.end - mark.start) * t
      return [mark.center[0] + Math.cos(a) * mark.radius, mark.center[1] + Math.sin(a) * mark.radius, mark.center[2]]
    }
  }
}

export function build(marks: Mark[], count: number, random: Random = Math.random): Shape {
  const positions = new Float32Array(count * 3)
  const tones = new Float32Array(count)
  const weights = marks.map(weight)
  const total = weights.reduce((a, b) => a + b, 0)

  let mark = 0
  let reach = (weights[0] ?? 0) / total
  for (let i = 0; i < count; i++) {
    // Walk the marks in order so each gets its share of particles.
    while ((i + 0.5) / count > reach && mark < marks.length - 1) {
      mark++
      reach += (weights[mark] ?? 0) / total
    }
    const m = marks[mark]!
    positions.set(point(m, random), i * 3)
    tones[i] = tone(random, m.tone)
  }

  return { positions, tones }
}

type BoxOptions = { edges?: Tone, top?: Tone, faces?: Tone | 'none' }

// A box centred on `center`: 12 edges and 6 faces. The top face (and its four edges) can take its own tone,
// like the hero cube's lime top. `faces: 'none'` draws the outline only.
export function box(center: Vec, size: Vec, { edges = PAPER, top = edges, faces = edges }: BoxOptions = {}): Mark[] {
  const [cx, cy, cz] = center
  const [hx, hy, hz] = size.map(s => s / 2) as Vec
  const corner = (x: number, y: number, z: number): Vec => [cx + x * hx, cy + y * hy, cz + z * hz]
  const marks: Mark[] = []

  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      marks.push({ kind: 'edge', from: corner(-1, a, b), to: corner(1, a, b), tone: a > 0 ? top : edges })
      marks.push({ kind: 'edge', from: corner(a, -1, b), to: corner(a, 1, b), tone: edges })
      marks.push({ kind: 'edge', from: corner(a, b, -1), to: corner(a, b, 1), tone: b > 0 ? top : edges })
    }
  }

  if (faces === 'none') return marks

  const face = (origin: Vec, u: Vec, v: Vec, t: Tone): Mark => ({ kind: 'face', origin, u, v, tone: t })
  const [w, h, d] = size
  marks.push(
    face(corner(-1, 1, -1), [w, 0, 0], [0, 0, d], top),
    face(corner(-1, -1, -1), [w, 0, 0], [0, 0, d], faces),
    face(corner(-1, -1, 1), [w, 0, 0], [0, h, 0], faces),
    face(corner(-1, -1, -1), [w, 0, 0], [0, h, 0], faces),
    face(corner(-1, -1, -1), [0, h, 0], [0, 0, d], faces),
    face(corner(1, -1, -1), [0, h, 0], [0, 0, d], faces),
  )
  return marks
}

export function arc(center: Vec, radius: number, start: number, end: number, t: Tone = PAPER): Mark {
  return { kind: 'arc', center, radius, start, end, tone: t }
}

// A flat square tile facing the viewer at depth z: its outline, or filled.
export function tile(x: number, y: number, size: number, z: number, t: Tone = PAPER, filled = false): Mark[] {
  if (filled) return [{ kind: 'face', origin: [x, y, z], u: [size, 0, 0], v: [0, size, 0], tone: t }]
  const c = (dx: number, dy: number): Vec => [x + dx * size, y + dy * size, z]
  return [
    { kind: 'edge', from: c(0, 0), to: c(1, 0), tone: t },
    { kind: 'edge', from: c(1, 0), to: c(1, 1), tone: t },
    { kind: 'edge', from: c(1, 1), to: c(0, 1), tone: t },
    { kind: 'edge', from: c(0, 1), to: c(0, 0), tone: t },
  ]
}
