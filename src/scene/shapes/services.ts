import { LIME } from '../colors'
import { arc, box, build, line, roundRect } from './solid'
import type { Random, Shape } from './types'

// One shape per service panel (the first panel, "Move", uses the wave). They're
// built like the hero cube, dense edges and light faces with lime accents, so the
// whole page reads as one family of objects. Each is centred on 0, about 3 units tall.

// Stores: a shopping bag with lime handles.
export function storeShape(count: number, random?: Random): Shape {
  return build([
    ...box([0, -0.3, 0], [2.2, 2.4, 1.1]),
    // One handle on the front, one on the back.
    arc([0, 0.9, 0.3], 0.5, 0, Math.PI, LIME),
    arc([0, 0.9, -0.3], 0.5, 0, Math.PI, LIME),
  ], count, random)
}

// CMS: a web page in a browser window, mid-edit. The page's image block has been
// lifted out of its slot and floats in front in lime, with the editor's cursor on it.
export function cmsShape(count: number, random?: Random): Shape {
  const z = 0
  const lifted = 0.75
  return build([
    // Window, its toolbar and the three dots.
    ...roundRect([0, 0], 3.4, 2.4, 0.14, z),
    line([-1.7, 0.82, z], [1.7, 0.82, z]),
    ...[-1.5, -1.32, -1.14].map(x => arc([x, 1.01, z], 0.06, 0, Math.PI * 2)),
    // The empty slot the block came from.
    ...roundRect([-0.75, 0.15], 1.4, 0.9, 0.06, z),
    // Text lines beside it, and a row of cards below.
    ...[[0.45, 0.5, 1.5], [0.45, 0.28, 1.25], [0.45, 0.06, 1.4], [0.45, -0.16, 0.95]].map(([x0, y, x1]) => line([x0!, y!, z], [x1!, y!, z])),
    ...[-1.0, 0, 1.0].flatMap(x => roundRect([x, -0.75], 0.8, 0.55, 0.06, z)),
    // The lifted block: an image card with a mountain and a sun, floating forward.
    ...roundRect([-0.45, 0.4], 1.4, 0.9, 0.06, lifted, LIME),
    line([-1.0, 0.1, lifted], [-0.6, 0.55, lifted], LIME),
    line([-0.6, 0.55, lifted], [-0.35, 0.3, lifted], LIME),
    line([-0.35, 0.3, lifted], [-0.2, 0.42, lifted], LIME),
    line([-0.2, 0.42, lifted], [0.1, 0.1, lifted], LIME),
    arc([-0.05, 0.65, lifted], 0.1, 0, Math.PI * 2, LIME),
    // Cursor arrow on the block's corner.
    line([0.22, 0.0, lifted], [0.22, -0.42, lifted], LIME),
    line([0.22, -0.42, lifted], [0.33, -0.31, lifted], LIME),
    line([0.33, -0.31, lifted], [0.5, -0.31, lifted], LIME),
    line([0.5, -0.31, lifted], [0.22, 0.0, lifted], LIME),
  ], count, random)
}

// Apps: a 3D app icon, a rounded tile with depth, with a lime AI sparkle on its face
// and a tilted orbit around it carrying three small lime nodes.
export function appShape(count: number, random?: Random): Shape {
  const front = 0.22
  const half = 1.1
  return build([
    // The tile: front and back outlines, joined at the middle of each side.
    ...roundRect([0, 0], 2.2, 2.2, 0.55, front),
    ...roundRect([0, 0], 2.2, 2.2, 0.55, -front),
    ...[[half, 0], [-half, 0], [0, half], [0, -half]].map(([x, y]) => line([x!, y!, -front], [x!, y!, front])),
    // The sparkle: a four-pointed star with curved sides, and a small one beside it.
    ...sparkle([-0.08, -0.08], 0.62, front),
    ...sparkle([0.58, 0.58], 0.2, front),
    // The orbit, tipped towards the viewer, and its nodes.
    ...orbit(1.95, 0.65, 64),
    ...[0.6, 2.6, 4.4].map(t => arc([1.95 * Math.cos(t), 0.65 * Math.sin(t), 1.95 * Math.sin(t) * 0.9], 0.1, 0, Math.PI * 2, LIME)),
  ], count, random)
}

// A four-pointed star whose sides curve inwards: one quarter arc between each pair of points.
function sparkle([x, y]: [number, number], size: number, z: number) {
  const q = Math.PI / 2
  return [
    arc([x + size, y + size, z], size, 2 * q, 3 * q, LIME),
    arc([x - size, y + size, z], size, 3 * q, 4 * q, LIME),
    arc([x - size, y - size, z], size, 0, q, LIME),
    arc([x + size, y - size, z], size, q, 2 * q, LIME),
  ]
}

// A flat ring around the icon, tilted so its front dips and its back rises, as short segments.
function orbit(radius: number, lift: number, segments: number) {
  const point = (t: number): [number, number, number] => [radius * Math.cos(t), lift * Math.sin(t), radius * Math.sin(t) * 0.9]
  return Array.from({ length: segments }, (_, i) => line(point((i / segments) * Math.PI * 2), point(((i + 1) / segments) * Math.PI * 2)))
}
