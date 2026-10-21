import { LIME, PAPER } from '../colors'
import { arc, box, build, tile } from './solid'
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

// CMS: three stacked content layers, like a page being assembled. The top layer is lime.
export function cmsShape(count: number, random?: Random): Shape {
  return build([
    ...box([0, -1.0, 0], [2.6, 0.22, 2.0]),
    ...box([0.15, 0, 0.1], [2.6, 0.22, 2.0]),
    ...box([0.3, 1.0, 0.2], [2.6, 0.22, 2.0], { top: LIME }),
  ], count, random)
}

// Apps: a phone as a thin slab outline, with a grid of app icons on its screen; two are lime.
export function phoneShape(count: number, random?: Random): Shape {
  const icons = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const lime = (row === 1 && col === 2) || (row === 3 && col === 0)
      icons.push(...tile(-0.6 + col * 0.44, 0.7 - row * 0.52, 0.32, 0.13, lime ? LIME : PAPER))
    }
  }
  return build([
    ...box([0, 0, 0], [1.6, 3.2, 0.24], { faces: 'none' }),
    ...icons,
  ], count, random)
}
