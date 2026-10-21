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

// Apps: a phone in an exploded view. The body at the back, its screen's interface floating
// in front of it, and a lime notification popping out furthest forward.
export function phoneShape(count: number, random?: Random): Shape {
  const ui = 0.4
  const note = 0.85
  return build([
    // Body: front and back outlines with the speaker slot.
    ...roundRect([0, 0], 1.8, 3.4, 0.28, 0),
    ...roundRect([0, 0], 1.8, 3.4, 0.28, -0.22),
    line([-0.2, 1.52, 0], [0.2, 1.52, 0]),
    // Interface: a card with a lime chart, two tiles and the tab bar.
    ...roundRect([0, 0.55], 1.36, 0.95, 0.1, ui),
    line([-0.52, 0.25, ui], [-0.25, 0.5, ui], LIME),
    line([-0.25, 0.5, ui], [0.0, 0.38, ui], LIME),
    line([0.0, 0.38, ui], [0.25, 0.72, ui], LIME),
    line([0.25, 0.72, ui], [0.52, 0.82, ui], LIME),
    ...roundRect([-0.36, -0.4], 0.62, 0.62, 0.1, ui),
    ...roundRect([0.36, -0.4], 0.62, 0.62, 0.1, ui),
    line([-0.68, -1.1, ui], [0.68, -1.1, ui]),
    ...[-0.45, 0, 0.45].map(x => arc([x, -1.32, ui], 0.07, 0, Math.PI * 2)),
    // Notification, hanging over the phone's edge.
    ...roundRect([0.45, 1.25], 1.6, 0.46, 0.23, note, LIME),
    arc([-0.13, 1.25, note], 0.11, 0, Math.PI * 2, LIME),
    line([0.12, 1.32, note], [1.0, 1.32, note], LIME),
    line([0.12, 1.16, note], [0.75, 1.16, note], LIME),
  ], count, random)
}
