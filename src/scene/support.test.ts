import { afterEach, describe, expect, it, vi } from 'vitest'
import { canRunParticles, particleBudget } from './support'

describe('particleBudget', () => {
  it('draws fewer particles on small screens', () => {
    expect(particleBudget(390)).toBeLessThan(particleBudget(1440))
  })

  it('draws fewer particles on devices with few cores', () => {
    expect(particleBudget(1440, 4)).toBeLessThan(particleBudget(1440, 8))
  })
})

describe('canRunParticles', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('says no without WebGL', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    expect(canRunParticles()).toBe(false)
  })

  it('says yes with WebGL', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ getExtension: () => null } as unknown as RenderingContext)
    expect(canRunParticles()).toBe(true)
  })

  it('says no when the visitor saves data', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ getExtension: () => null } as unknown as RenderingContext)
    vi.stubGlobal('navigator', { connection: { saveData: true } })
    expect(canRunParticles()).toBe(false)
  })
})
