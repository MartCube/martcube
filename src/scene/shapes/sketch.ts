import { PAPER, type Tone } from '../colors'
import { tone, type Random, type Shape } from './types'

// A tiny drawing kit for flat, wireframe-style shapes (cards, pages, a phone).
// Each mark is a line, an arc, or a filled box at some depth; particles are shared
// between marks by length or area, so denser marks get more of them.
export type Mark
  = | { kind: 'line', from: [number, number], to: [number, number], z: number, tone: Tone }
    | { kind: 'arc', center: [number, number], radius: number, start: number, end: number, z: number, tone: Tone }
    | { kind: 'fill', x: number, y: number, w: number, h: number, z: number, tone: Tone }

// Fills are weighed by area plus width, so big blocks read as solid
// and thin bars (lines of text) still get enough particles to show.
const FILL_AREA = 2
const FILL_WIDTH = 0.5

function weight(mark: Mark): number {
  switch (mark.kind) {
    case 'line': return Math.hypot(mark.to[0] - mark.from[0], mark.to[1] - mark.from[1])
    case 'arc': return Math.abs(mark.end - mark.start) * mark.radius
    case 'fill': return mark.w * mark.h * FILL_AREA + mark.w * FILL_WIDTH
  }
}

function point(mark: Mark, random: Random): [number, number, number] {
  const t = random()
  switch (mark.kind) {
    case 'line':
      return [mark.from[0] + (mark.to[0] - mark.from[0]) * t, mark.from[1] + (mark.to[1] - mark.from[1]) * t, mark.z]
    case 'arc': {
      const a = mark.start + (mark.end - mark.start) * t
      return [mark.center[0] + Math.cos(a) * mark.radius, mark.center[1] + Math.sin(a) * mark.radius, mark.z]
    }
    case 'fill':
      return [mark.x + mark.w * t, mark.y + mark.h * random(), mark.z]
  }
}

export function sketch(marks: Mark[], count: number, random: Random = Math.random): Shape {
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
    const [x, y, z] = point(m, random)
    positions.set([x, y, z + (random() - 0.5) * 0.04], i * 3)
    tones[i] = tone(random, m.tone)
  }

  return { positions, tones }
}

// Helpers that return several marks.

export function line(x1: number, y1: number, x2: number, y2: number, z = 0, t: Tone = PAPER): Mark {
  return { kind: 'line', from: [x1, y1], to: [x2, y2], z, tone: t }
}

export function fill(x: number, y: number, w: number, h: number, z = 0, t: Tone = PAPER): Mark {
  return { kind: 'fill', x, y, w, h, z, tone: t }
}

export function circle(cx: number, cy: number, radius: number, z = 0, t: Tone = PAPER): Mark {
  return { kind: 'arc', center: [cx, cy], radius, start: 0, end: Math.PI * 2, z, tone: t }
}

// Outline of a rounded rectangle; (x, y) is the bottom-left corner.
export function roundRect(x: number, y: number, w: number, h: number, r: number, z = 0, t: Tone = PAPER): Mark[] {
  const arc = (cx: number, cy: number, start: number): Mark =>
    ({ kind: 'arc', center: [cx, cy], radius: r, start, end: start + Math.PI / 2, z, tone: t })
  return [
    line(x + r, y, x + w - r, y, z, t),
    line(x + w, y + r, x + w, y + h - r, z, t),
    line(x + w - r, y + h, x + r, y + h, z, t),
    line(x, y + h - r, x, y + r, z, t),
    arc(x + w - r, y + r, -Math.PI / 2),
    arc(x + w - r, y + h - r, 0),
    arc(x + r, y + h - r, Math.PI / 2),
    arc(x + r, y + r, Math.PI),
  ]
}

// A row of text, drawn as a thin filled bar.
export function text(x: number, y: number, w: number, z = 0, t: Tone = PAPER, h = 0.07): Mark {
  return fill(x, y, w, h, z, t)
}
