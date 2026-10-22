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

// Apps: a phone running an AI chat. A question bubble, a lime answer bubble,
// typing dots and the message bar, on a phone outline with a little depth.
export function appShape(count: number, random?: Random): Shape {
  const z = 0.14
  return build([
    ...phoneBody(),
    // Question, with two lines of text.
    ...roundRect([-0.18, 0.75], 1.15, 0.5, 0.2, z),
    line([-0.55, 0.8, z], [0.15, 0.8, z]),
    line([-0.55, 0.66, z], [-0.05, 0.66, z]),
    // Answer in lime, with three lines.
    ...roundRect([0.15, -0.05], 1.15, 0.75, 0.2, z, LIME),
    line([-0.22, 0.12, z], [0.55, 0.12, z], LIME),
    line([-0.22, -0.04, z], [0.5, -0.04, z], LIME),
    line([-0.22, -0.2, z], [0.25, -0.2, z], LIME),
    // Typing dots, then the message bar.
    ...[-0.5, -0.32, -0.14].map(x => arc([x, -0.85, z], 0.06, 0, Math.PI * 2)),
    ...roundRect([0, -1.35], 1.4, 0.32, 0.16, z),
  ], count, random)
}

// The phone: front and back outlines joined at the middle of each side, and the speaker slot.
function phoneBody() {
  const d = 0.12
  return [
    ...roundRect([0, 0], 1.8, 3.5, 0.3, d),
    ...roundRect([0, 0], 1.8, 3.5, 0.3, -d),
    ...[[0.9, 0], [-0.9, 0], [0, 1.75], [0, -1.75]].map(([x, y]) => line([x!, y!, -d], [x!, y!, d])),
    ...roundRect([0, 1.52], 0.5, 0.12, 0.06, d),
  ]
}
