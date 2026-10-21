// Decides whether this browser gets the WebGL particle field or the static poster.
// No WebGL, or the visitor asked to save data: poster.
export function canRunParticles(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    // Hand the probe's GPU context straight back.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  }
  catch {
    return false
  }
}

// How many particles a device should draw: fewer on small screens and on
// phones or laptops with few CPU cores (a decent proxy for a weak GPU).
export function particleBudget(width: number, cores = 8): number {
  const base = width < 720 ? 3200 : 7000
  return cores <= 4 ? Math.round(base * 0.6) : base
}
