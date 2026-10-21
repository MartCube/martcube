// Random points in a wide box around the camera: where particles start before they gather.
export function scatter(count: number, spread = 30, random: () => number = Math.random): Float32Array {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < positions.length; i++) positions[i] = (random() - 0.5) * spread
  return positions
}
