import { VIOLET, type Tone } from '../colors'

// A particle shape: one xyz position and one tone per particle, flattened.
export type Shape = {
  positions: Float32Array
  tones: Float32Array
}

export type Random = () => number

// Every shape sprinkles in a few violet particles.
export function tone(random: Random, base: Tone): Tone {
  return random() < 0.03 ? VIOLET : base
}
