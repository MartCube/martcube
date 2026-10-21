import { LIME } from '../colors'
import { circle, fill, roundRect, sketch, text, type Mark } from './sketch'
import type { Random, Shape } from './types'

// One shape per service panel (the first panel, "Move", uses the wave).
// All are drawn flat, centred on 0, about 4 units wide, with a little depth.

// Stores: three product cards fanned out in depth, each with an image, a title, a price and a lime buy button.
export function storeShape(count: number, random?: Random): Shape {
  const card = (cx: number, cy: number, z: number): Mark[] => {
    const x = cx - 0.65
    const y = cy - 0.95
    return [
      ...roundRect(x, y, 1.3, 1.9, 0.12, z),
      fill(x + 0.12, y + 0.85, 1.06, 0.92, z),
      text(x + 0.12, y + 0.6, 0.8, z),
      text(x + 0.12, y + 0.44, 0.45, z),
      ...roundRect(x + 0.12, y + 0.12, 0.6, 0.2, 0.1, z, LIME),
      fill(x + 0.2, y + 0.18, 0.44, 0.08, z, LIME),
    ]
  }
  return sketch([...card(-1.55, -0.15, -0.7), ...card(1.55, -0.15, -0.7), ...card(0, 0.1, 0.4)], count, random)
}

// Editable: a browser window with a page layout, and the headline selected in lime as if being edited.
export function pageShape(count: number, random?: Random): Shape {
  const x = -2.1
  const y = -1.45
  return sketch([
    ...roundRect(x, y, 4.2, 2.9, 0.14, 0),
    text(x, y + 2.5, 4.2, 0, undefined, 0.02),
    circle(x + 0.22, y + 2.7, 0.05),
    circle(x + 0.4, y + 2.7, 0.05),
    circle(x + 0.58, y + 2.7, 0.05),
    // Headline, selected
    text(x + 0.3, y + 2.05, 2.2, 0.15, LIME, 0.16),
    text(x + 0.3, y + 1.8, 1.6, 0.15, LIME, 0.16),
    ...roundRect(x + 0.2, y + 1.7, 2.45, 0.6, 0.04, 0.15, LIME),
    fill(x + 2.7, y + 1.68, 0.03, 0.64, 0.15, LIME),
    // Body copy
    text(x + 0.3, y + 1.45, 2.6),
    text(x + 0.3, y + 1.3, 2.3),
    // Three blocks
    ...roundRect(x + 0.3, y + 0.25, 1.1, 0.85, 0.06),
    ...roundRect(x + 1.55, y + 0.25, 1.1, 0.85, 0.06),
    ...roundRect(x + 2.8, y + 0.25, 1.1, 0.85, 0.06),
    // Image on the right of the hero
    fill(x + 3.05, y + 1.3, 0.85, 1.0, -0.1),
  ], count, random)
}

// Apps: a phone with a list, a chat bubble (the AI feature) and a lime action button.
export function phoneShape(count: number, random?: Random): Shape {
  const x = -0.8
  const y = -1.6
  const row = (top: number): Mark[] => [
    circle(x + 0.32, top, 0.11),
    text(x + 0.55, top + 0.03, 0.75),
    text(x + 0.55, top - 0.1, 0.45),
  ]
  return sketch([
    ...roundRect(x, y, 1.6, 3.2, 0.24, 0),
    ...roundRect(x + 0.08, y + 0.08, 1.44, 3.04, 0.18, 0),
    fill(x + 0.55, y + 2.98, 0.5, 0.08, 0),
    text(x + 0.2, y + 2.6, 0.7, 0, undefined, 0.1),
    ...row(y + 2.25),
    ...row(y + 1.9),
    ...row(y + 1.55),
    // Chat bubble, floating out of the screen
    ...roundRect(x + 0.9, y + 0.7, 1.3, 0.55, 0.14, 0.45, LIME),
    text(x + 1.05, y + 1.02, 0.95, 0.45, LIME),
    text(x + 1.05, y + 0.87, 0.6, 0.45, LIME),
    circle(x + 1.25, y + 0.32, 0.17, 0.1, LIME),
    fill(x + 1.18, y + 0.29, 0.14, 0.06, 0.1, LIME),
  ], count, random)
}
