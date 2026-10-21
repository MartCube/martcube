// Brand colours as 0..1 RGB, written straight to the shader (no colour management).
export type Rgb = [number, number, number]

const hex = (value: string): Rgb => {
  const n = parseInt(value.slice(1), 16)
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]
}

export const LIME = hex('#c8f542')
export const PAPER = hex('#ecebe4')
export const VIOLET = hex('#5b5cf6')
