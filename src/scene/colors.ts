// Each particle gets a tone: an index into the brand palette below. Shapes store
// tones, and the shader turns them into colours, so four shapes fit in one attribute.
export const PAPER = 0
export const LIME = 1
export const VIOLET = 2

export type Tone = typeof PAPER | typeof LIME | typeof VIOLET

// The palette as GLSL, in tone order (no colour management: 0..1 sRGB values go straight out).
const hex = (value: string) => {
  const n = parseInt(value.slice(1), 16)
  return [n >> 16 & 255, n >> 8 & 255, n & 255].map(c => (c / 255).toFixed(3)).join(', ')
}

export const paletteGlsl = /* glsl */ `
  vec3 toneColor(float tone) {
    if (tone > 1.5) return vec3(${hex('#5b5cf6')});
    if (tone > 0.5) return vec3(${hex('#c8f542')});
    return vec3(${hex('#ecebe4')});
  }
`
